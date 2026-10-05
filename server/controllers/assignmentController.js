const Assignment = require('../models/Assignment');
const Teacher = require('../models/Teacher');
const Submission = require('../models/Submission');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subjectName, deadline, targetSemester, targetStudentId } = req.body;
    
    // ensure teacher has this subject
    const teacherProfile = await Teacher.findOne({ userId: req.user._id });
    if (!teacherProfile.assignedSubjects.includes(subjectName)) {
      return res.status(403).json({ message: 'You cannot create an assignment for a subject you do not teach.' });
    }

    const assignment = new Assignment({
      title, description, subjectName, teacherId: req.user._id, deadline, targetSemester, targetStudentId,
      taskFileUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating assignment' });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const assignments = await Assignment.find({ teacherId: req.user._id, isActive: true }).lean();
      
      // Calculate submission counts
      for (let ass of assignments) {
        ass.submissionCount = await Submission.countDocuments({ assignmentId: ass._id });
        ass.pendingCount = await Submission.countDocuments({ assignmentId: ass._id, status: 'pending' });
      }
      return res.json(assignments);
      
    } else if (req.user.role === 'student') {
      const studentProfile = require('../models/Student');
      const std = await studentProfile.findOne({ userId: req.user._id });
      // Assignments for all or specific to this semester/student
      const q = {
        isActive: true,
        $or: [
          { targetSemester: std.semester },
          { targetSemester: null, targetStudentId: null },
          { targetStudentId: req.user._id }
        ]
      };
      const assignments = await Assignment.find(q).populate('teacherId', 'name');
      return res.json(assignments);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('teacherId', 'name');
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id }, 
      req.body, 
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Not found or not yours' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacherId: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Not found or not yours' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting' });
  }
};
