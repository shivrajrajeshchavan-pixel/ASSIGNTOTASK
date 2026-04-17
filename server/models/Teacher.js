const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedSubjects: [{ type: String }],
  designation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
