const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(adminOnly);

router.post('/add-user', adminController.addUser);
router.delete('/remove-user/:id', adminController.removeUser);
router.get('/users', adminController.getUsers);
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;
