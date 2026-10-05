const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');

exports.getStudentAttendance = async (req, res) => {
  try {
    const studentUserId = req.params.id; // From URL (can be "my" id for students)
    
    // Basic auth check: if student, can only view own
    if (req.user.role === 'student' && studentUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot view other students attendance' });
    }

    const records = await Attendance.find({ studentId: studentUserId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { studentId, subject, updatedAttendedClasses, reason } = req.body;
    
    // Subject is already authorized via subjectScopeMiddleware
    
    let record = await Attendance.findOne({ studentId, subject });
    
    if (!record) {
      // Create new record if none exists (assuming totalClasses is known, maybe require it or default)
      return res.status(404).json({ message: 'Attendance record not found for this subject' });
    }

    const oldVal = record.attendedClasses;
    record.attendedClasses = updatedAttendedClasses;
    record.lastUpdatedBy = req.user._id;
    record.lastUpdatedAt = Date.now();
    record.updateHistory.push({
      date: Date.now(),
      updatedBy: req.user._id,
      oldVal,
      newVal: updatedAttendedClasses,
      reason: reason || 'Compensation update'
    });

    await record.save(); // pre-save calculates percentage

    res.json({ message: 'Attendance updated', record });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance' });
  }
};

exports.getClassAttendance = async (req, res) => {
  try {
    const teacherProfile = req.teacherProfile || await require('../models/Teacher').findOne({ userId: req.user._id });
    const subjects = teacherProfile.assignedSubjects;

    // Return attendance for all students, BUT ONLY for this teacher's subjects
    const records = await Attendance.find({ subject: { $in: subjects } }).populate('studentId', 'name email');
    
    // Get all students and attach rollNumber
    const studentProfiles = await Student.find();
    const studentsMap = {};
    studentProfiles.forEach(sp => { studentsMap[sp.userId.toString()] = sp; });

    const formatted = records.map(r => ({
      _id: r._id,
      studentId: r.studentId._id,
      studentName: r.studentId.name,
      rollNumber: studentsMap[r.studentId._id.toString()]?.rollNumber,
      semester: studentsMap[r.studentId._id.toString()]?.semester,
      subject: r.subject,
      totalClasses: r.totalClasses,
      attendedClasses: r.attendedClasses,
      percentage: r.percentage
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class attendance' });
  }
};
