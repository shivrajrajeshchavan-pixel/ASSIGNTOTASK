const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { teacherOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.get('/', assignmentController.getAssignments);
router.post('/', teacherOnly, upload.single('file'), assignmentController.createAssignment);
router.get('/:id', assignmentController.getAssignmentById);
router.put('/:id', teacherOnly, assignmentController.updateAssignment);
router.delete('/:id', teacherOnly, assignmentController.deleteAssignment);

module.exports = router;
