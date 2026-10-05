const Teacher = require('../models/Teacher');

const subjectScopeMiddleware = async (req, res, next) => {
  try {
    const teacherProfile = await Teacher.findOne({ userId: req.user._id });
    if (!teacherProfile) {
      return res.status(403).json({ message: 'Teacher profile not found' });
    }

    const { subject } = req.body; // or req.query depending on route
    const reqSubject = subject || req.query.subject;

    if (!reqSubject) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    if (!teacherProfile.assignedSubjects.includes(reqSubject)) {
      return res.status(403).json({ message: 'You are not authorized to access or update records for this subject.' });
    }

    // Pass the teacher profile down
    req.teacherProfile = teacherProfile;
    next();
  } catch (error) {
    console.error('Subject Scope Error:', error);
    res.status(500).json({ message: 'Server error checking subject scope' });
  }
};

module.exports = subjectScopeMiddleware;
