const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, required: true, default: 0 },
  attendedClasses: { type: Number, required: true, default: 0 },
  percentage: { type: Number, default: 0 },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: { type: Date, default: Date.now },
  updateHistory: [{
    date: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    oldVal: { type: Number },
    newVal: { type: Number },
    reason: { type: String }
  }]
}, { timestamps: true });

// Pre-save middleware to calculate percentage
attendanceSchema.pre('save', function(next) {
  if (this.totalClasses > 0) {
    this.percentage = (this.attendedClasses / this.totalClasses) * 100;
  } else {
    this.percentage = 0;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
