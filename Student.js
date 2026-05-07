const mongoose = require('mongoose');

// Define the exact schema structure required for the Student data
const studentSchema = new mongoose.Schema({
    rollNumber: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        uppercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    course: { 
        type: String, 
        default: 'B.Tech CSE' 
    },
    semester: { 
        type: Number 
    },
    results: [{
        subjectName: String,
        marksObtained: Number,
        maxMarks: Number,
        grade: String,
        status: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);