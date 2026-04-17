const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentRemarks } = req.body;
    
    // Check if already submitted
    const existing = await Submission.findOne({ assignmentId, studentId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this assignment.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    const submission = new Submission({
      assignmentId,
      studentId: req.user._id,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      studentRemarks
    });

    await submission.save();
    res.status(201).json({ message: 'Submitted successfully', submission });

  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment' });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate({
        path: 'assignmentId',
        populate: { path: 'teacherId', select: 'name' }
      });
    const enhanced = submissions.map(sub => {
       const obj = sub.toObject();
       obj.fileUrl = obj.filePath ? '/' + obj.filePath.replace(/\\/g, '/') : null;
       return obj;
    });
    res.json(enhanced);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || assignment.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name email');

    // Add roll number from student profile
    const Student = require('../models/Student');
    const populated = await Promise.all(submissions.map(async sub => {
      const studentProfile = await Student.findOne({ userId: sub.studentId._id });
      const obj = sub.toObject();
      obj.fileUrl = obj.filePath ? '/' + obj.filePath.replace(/\\/g, '/') : null;
      return { ...obj, rollNumber: studentProfile ? studentProfile.rollNumber : 'N/A' };
    }));

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    const { status, teacherRemark } = req.body; // status: 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (status === 'rejected' && !teacherRemark) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const submission = await Submission.findById(req.params.id).populate('assignmentId');
    if (!submission) return res.status(404).json({ message: 'Not found' });
    
    // verify teacher owns assignment
    if (submission.assignmentId.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    submission.status = status;
    submission.teacherRemark = teacherRemark;
    submission.reviewedAt = Date.now();
    await submission.save();

    res.json({ message: `Submission ${status}`, submission });
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing submission' });
  }
};
