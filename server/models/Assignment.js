const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subjectName: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date, required: true },
  targetSemester: { type: Number }, // Optional, filters by semester
  targetStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, specific student
  taskFileUrl: { type: String }, // For the teacher's PDF
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
