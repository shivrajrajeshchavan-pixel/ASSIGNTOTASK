const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true, unique: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 } // Legacy or per-semester total
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
