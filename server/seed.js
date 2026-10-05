const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Attendance = require('./models/Attendance');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Clear existing
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Attendance.deleteMany();
    console.log('Cleared DB');

    const salt = await bcrypt.genSalt(10);

    // Admin
    const adminHash = await bcrypt.hash('Admin@123', salt);
    await User.create({
      name: 'Super Admin',
      email: 'admin@college.com',
      passwordHash: adminHash,
      role: 'admin',
      department: 'Management'
    });

    // Teacher
    const teacherHash = await bcrypt.hash('Teacher@123', salt);
    const teacherUser = await User.create({
      name: 'John Doe',
      email: 'teacher@college.com',
      passwordHash: teacherHash,
      role: 'teacher',
      department: 'Computer Science'
    });
    await Teacher.create({
      userId: teacherUser._id,
      assignedSubjects: ['Data Structures', 'Algorithms'],
      designation: 'Assistant Professor'
    });

    // Student
    const studentHash = await bcrypt.hash('Student@123', salt);
    const studentUser = await User.create({
      name: 'Jane Smith',
      email: 'student@college.com',
      passwordHash: studentHash,
      role: 'student',
      department: 'Computer Science'
    });
    await Student.create({
      userId: studentUser._id,
      rollNumber: 'CS101',
      semester: 4,
      section: 'A'
    });

    // Base Attendance
    await Attendance.create({
      studentId: studentUser._id,
      subject: 'Data Structures',
      totalClasses: 40,
      attendedClasses: 25, // 62.5% - Shortage
    });

    console.log('Seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
