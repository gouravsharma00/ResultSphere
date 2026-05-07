const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Admin = require('./models/Admin');

dotenv.config();

const MOCK_SUBJECTS = ['Web Technology', 'Database Management', 'Data Structures', 'Operating Systems', 'Computer Networks'];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear out existing data
        await Student.deleteMany();
        await Admin.deleteMany();
        console.log('🗑️  Cleared existing students.');
        console.log('🗑️  Cleared existing admins.');

        // Securely hash the mandatory default password
        const salt = await bcrypt.genSalt(10);
        const defaultHashedPassword = await bcrypt.hash('IILM@123', salt);

        // Hash the strict admin default password
        const adminHashedPassword = await bcrypt.hash('adminoo@', salt);

        const studentsToInsert = [];

        for (let i = 1; i <= 50; i++) {
            const rollNo = `2024CS${i.toString().padStart(2, '0')}`; // Generates 2024CS01 to 2024CS50
            
            // Generate mock results for Semester 3
            const mockResults = MOCK_SUBJECTS.map(sub => {
                const marks = Math.floor(Math.random() * 61) + 40; // 40 to 100
                const isPass = marks >= 40;
                
                return {
                    subjectName: sub,
                    marksObtained: marks,
                    maxMarks: 100,
                    grade: marks >= 90 ? 'O' : marks >= 80 ? 'A+' : marks >= 70 ? 'A' : marks >= 60 ? 'B+' : 'C',
                    status: isPass ? 'PASS' : 'FAIL'
                };
            });

            studentsToInsert.push({
                rollNumber: rollNo,
                password: defaultHashedPassword,
                name: `Student ${i}`,
                course: 'B.Tech CSE',
                semester: 3,
                results: mockResults
            });
        }

        // Bulk insert to MongoDB
        await Student.insertMany(studentsToInsert);
        console.log('🌱 Successfully seeded 50 mock students into the database!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();