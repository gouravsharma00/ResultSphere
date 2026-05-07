// search.js - Handles the login logic and mock database

// 1. Create a mock 'database' array containing at least 3 student objects
const mockDatabase = [
    {
        rollNo: "2024CS01",
        name: "Gourav",
        course: "B.Tech CSE",
        semester: "6",
        section: "A",
        
        marks: {
            wt: { max: 100, obtained: 88, grade: "A" },
            cd: { max: 100, obtained: 85, grade: "A" },
            ai: { max: 100, obtained: 92, grade: "O" }
        }
    },
    {
        rollNo: "2024CS02",
        name: "Amit Sharma",
        course: "B.Tech CSE",
        semester: "6",
        section: "B",
        marks: {
            wt: { max: 100, obtained: 45, grade: "F" },
            cd: { max: 100, obtained: 50, grade: "C" },
            ai: { max: 100, obtained: 60, grade: "B" }
        }
    },
    {
        rollNo: "2024CS03",
        name: "Sneha Kapoor",
        course: "B.Tech CSE",
        semester: "6",
        section: "A",
        marks: {
            wt: { max: 100, obtained: 95, grade: "O" },
            cd: { max: 100, obtained: 91, grade: "O" },
            ai: { max: 100, obtained: 98, grade: "O" }
        }
    }
];

function goToResult() {
    const rollInput = document.getElementById('rollInput').value.trim();
    const semInput = document.getElementById('semester').value;

   
    const student = mockDatabase.find(s => s.rollNo === rollInput && s.semester === semInput);

   
    if (!student) {
        alert('Student not found in database. Please check your Roll Number and Semester.');
        return; // Prevents the redirect
    }

    // 4. If it DOES exist: Save that specific student's object to localStorage
    // Explanation for Professor: localStorage only stores strings. 
    // We use JSON.stringify() to convert the JavaScript object into a JSON string format.
    localStorage.setItem('activeStudent', JSON.stringify(student));

    // 5. Redirect to the result page securely
    window.location.href = "result.html";
}