const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const { teacherOnly, studentOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.post('/', studentOnly, upload.single('file'), submissionController.submitAssignment);
router.get('/my', studentOnly, submissionController.getMySubmissions);
router.get('/assignment/:id', teacherOnly, submissionController.getSubmissionsForAssignment);
router.put('/:id/review', teacherOnly, submissionController.reviewSubmission);

module.exports = router;
