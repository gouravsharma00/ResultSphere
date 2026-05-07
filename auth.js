const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        // 1. Check if the student exists
        const student = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
        if (!student) {
            return res.status(404).json({ message: 'Invalid Roll Number or Password.' });
        }

        // 2. Compare the plain-text password with the stored bcrypt hash
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Roll Number or Password.' });
        }

        // 3. Generate JWT Token (expires in 24 hours)
        const payload = { id: student._id, rollNumber: student.rollNumber };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // 4. Return token and safe user data
        res.status(200).json({
            token,
            student: { name: student.name, rollNumber: student.rollNumber, course: student.course }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

/**
 * @route   POST /api/auth/admin-login
 * @desc    Authenticate Admin & get high-privilege JWT
 * @access  Public
 */
router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if the admin exists
        const admin = await Admin.findOne({ username: username.toLowerCase() });
        if (!admin) {
            return res.status(404).json({ message: 'Unauthorized Credentials.' });
        }

        // 2. Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized Credentials.' });
        }

        // 3. Generate JWT Token with the strict 'admin' role flag embedded
        const payload = { id: admin._id, username: admin.username, role: 'admin' };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }); // Shorter expiry for security

        // 4. Return token securely
        res.status(200).json({ token, admin: { username: admin.username, role: 'admin' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during admin login.' });
    }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change the active user's password
 * @access  Private (Requires valid JWT)
 */
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const student = await Student.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        // Hash and save the new password
        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during password change.' });
    }
});

module.exports = router;