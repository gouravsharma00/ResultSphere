// ResultSphere - Mass Data Generator
function generateMockDatabase() {
    const database = [];
    
    // Arrays to generate realistic names
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Rayaan", "Krishna", "Ishaan", "Shaurya", "Atharva", "Kabir", "Gourav", "Ayush", "Mohammad", "Rohit", "Mohd", "Rohan", "Priya", "Ananya", "Diya", "Sneha", "Kavya"];
    const lastNames = ["Sharma", "Singh", "Kumar", "Patel", "Gupta", "Verma", "Reddy", "Jain", "Sahu", "Raj", "Amaan", "Rehman", "Das", "Yadav"];

    // B.Tech CSE Subjects Pool
    const subjectsPool = [
        "Web Technology", "Compiler Design", "Artificial Intelligence", 
        "Machine Learning", "Database Management Systems", "Computer Networks", 
        "Operating Systems", "Data Structures", "Cloud Computing"
    ];

    // Loop through Semesters 1 to 8
    for (let semester = 1; semester <= 8; semester++) {
        
        // Randomly decide to generate between 50 and 100 students for this semester
        const numStudents = Math.floor(Math.random() * 51) + 50; 

        for (let i = 1; i <= numStudents; i++) {
            // Generate a realistic Roll Number (e.g., 2024CS3001)
            const rollNo = `2024CS${semester}${i.toString().padStart(3, '0')}`;
            
            // Generate a random name
            const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const studentName = `${randomFirstName} ${randomLastName}`;

            // Randomly select 5 subjects for this semester's marksheet
            // Spread into a new array to avoid continuously mutating the original pool
            const semesterSubjects = [...subjectsPool].sort(() => 0.5 - Math.random()).slice(0, 5);
            const marksData = [];
            let totalObtained = 0;
            let totalMax = 500;

            // Generate marks for each subject
            semesterSubjects.forEach(sub => {
                const marksObtained = Math.floor(Math.random() * 61) + 40; // Marks between 40 and 100
                totalObtained += marksObtained;
                
                // Determine Grade and Status
                let grade = 'F', status = 'FAIL';
                if (marksObtained >= 90) { grade = 'O'; status = 'PASS'; }
                else if (marksObtained >= 80) { grade = 'A+'; status = 'PASS'; }
                else if (marksObtained >= 70) { grade = 'A'; status = 'PASS'; }
                else if (marksObtained >= 60) { grade = 'B+'; status = 'PASS'; }
                else if (marksObtained >= 50) { grade = 'B'; status = 'PASS'; }
                else if (marksObtained >= 40) { grade = 'C'; status = 'PASS'; }

                marksData.push({
                    subjectName: sub,
                    maxMarks: 100,
                    marksObtained: marksObtained,
                    grade: grade,
                    status: status
                });
            });

            // Calculate Percentage & SGPA
            const percentage = (totalObtained / totalMax) * 100;
            const sgpa = (percentage / 9.5).toFixed(2); // Standard technical conversion

            // Push the generated student into the database array
            database.push({
                rollNo: rollNo,       // Updated to match search.js & result.js
                name: studentName,    // Updated to match search.js & result.js
                course: "B.Tech CSE",
                semester: semester.toString(),
                sgpa: sgpa,
                percentage: percentage.toFixed(2),
                results: {
                    [semester.toString()]: marksData // Wrapped in an object keyed by the semester
                }
            });
        }
    }

    // Save the massive array to LocalStorage so ResultSphere can search it!
    localStorage.setItem('resultSphereDB', JSON.stringify(database));
    console.log(`✅ Successfully generated ${database.length} student records and saved to LocalStorage!`);
    
    return database;
}

// Run the function to generate the data
generateMockDatabase();