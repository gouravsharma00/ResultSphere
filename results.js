const express = require('express');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/results/me
 * @desc    Get the authenticated student's full result array and SGPA
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Retrieve the student using the ID extracted from the JWT token
        const student = await Student.findById(req.user.id).select('-password'); // Exclude the password hash
        
        if (!student) {
            return res.status(404).json({ message: 'Student data not found.' });
        }

        // Calculate SGPA dynamically from the results array
        let totalObtained = 0;
        let totalMax = 0;
        student.results.forEach(subject => {
            totalObtained += subject.marksObtained;
            totalMax += subject.maxMarks;
        });

        const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        const sgpa = (percentage / 9.5).toFixed(2);

        res.status(200).json({ results: student.results, sgpa, percentage: percentage.toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving results.' });
    }
});

module.exports = router;