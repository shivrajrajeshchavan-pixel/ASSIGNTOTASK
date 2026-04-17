const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, department, ...profileData } = req.body;
    
    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name, email, passwordHash, role, department
    });
    
    await newUser.save();

    if (role === 'student') {
      const newStudent = new Student({
        userId: newUser._id,
        rollNumber: profileData.rollNumber,
        semester: profileData.semester,
        section: profileData.section
      });
      await newStudent.save();
    } else if (role === 'teacher') {
      const newTeacher = new Teacher({
        userId: newUser._id,
        assignedSubjects: profileData.assignedSubjects || [],
        designation: profileData.designation
      });
      await newTeacher.save();
    }

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Server error adding user' });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Soft delete
    user.isActive = false;
    await user.save();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing user' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const cache = {};
    const query = { isActive: true };
    if (role) query.role = role;

    const users = await User.find(query).select('-passwordHash');
    
    // Attach profile data
    const enhancedUsers = await Promise.all(users.map(async u => {
      let profile = null;
      if (u.role === 'student') {
        profile = await Student.findOne({ userId: u._id });
      } else if (u.role === 'teacher') {
        profile = await Teacher.findOne({ userId: u._id });
      }
      return { ...u.toObject(), profile };
    }));

    res.json(enhancedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalTeachers = await User.countDocuments({ role: 'teacher', isActive: true });
    const totalAssignments = await Assignment.countDocuments({ isActive: true });
    const pendingReviews = await Submission.countDocuments({ status: 'pending' });

    res.json({
      totalStudents,
      totalTeachers,
      totalAssignments,
      pendingReviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
