const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const { teacherOnly } = require('../middleware/roleMiddleware');
const subjectScopeMiddleware = require('../middleware/subjectScopeMiddleware');

router.use(authMiddleware);

// Get student's attendance (can be student or teacher)
router.get('/student/:id', attendanceController.getStudentAttendance);

// Teacher updates attendance
router.put('/update', teacherOnly, subjectScopeMiddleware, attendanceController.updateAttendance);

// Teacher views class attendance
router.get('/class', teacherOnly, attendanceController.getClassAttendance);

module.exports = router;
