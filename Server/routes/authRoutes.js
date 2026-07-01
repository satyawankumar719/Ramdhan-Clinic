const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require valid JWT)
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getUserProfile);

// Admin-only route example (requires valid JWT AND 'admin' role)
router.get(
  '/admin-only',
  protect,
  authorize('admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome Admin! You have accessed this secure resource.',
      adminData: {
        systemTime: new Date(),
        serverStatus: 'Active',
      },
    });
  }
);

module.exports = router;
