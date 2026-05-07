// result.js - Dynamic Marksheet Engine

let currentStudent = null; // Global reference for the verified student

document.addEventListener('DOMContentLoaded', () => {
    // 1. Route Protection (Security Check)
    const studentSession = localStorage.getItem('activeStudent');

    if (!studentSession) {
        // Forcefully redirect if no session exists to prevent unauthorized access
        window.location.href = 'index.html';
        return;
    }

    // Parse session data back into a JavaScript Object
    currentStudent = JSON.parse(studentSession);

    // --- Global Back Button Logic ---
    const globalBackBtn = document.getElementById('global-back-btn');
    if (globalBackBtn) {
        globalBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if user has navigation history to go back to (preventing new tab trapping)
            if (window.history.length > 1 && document.referrer !== "") {
                window.history.back();
            } else {
                window.location.href = 'dashboard.html'; // Smart fallback
            }
        });
    }

    // 2. The Verification Event Listener
    // Target the 'Fetch Result' button to trigger verification
    const fetchBtn = document.getElementById('fetchResultBtn');
    if (fetchBtn) {
        fetchBtn.addEventListener('click', verifyUser);
    }
});

/**
 * Verifies user identity against localStorage session data
 * @param {Event} e - The click/submit event
 */
function verifyUser(e) {
    e.preventDefault(); // Prevent default form submission behaviors

    // Extract the Name and Roll Number entered by the user
    const enteredName = document.getElementById('verifyName').value.trim();
    const enteredRoll = document.getElementById('verifyRoll').value.trim();

    if (!enteredName || !enteredRoll) {
        alert('Please enter both your Name and Roll Number.');
        return;
    }

    // Compare strictly (ignoring case) against the data saved in localStorage
    if (enteredName.toLowerCase() !== currentStudent.name.toLowerCase() ||
        enteredRoll.toLowerCase() !== currentStudent.rollNo.toLowerCase()) {
        // Show a clean JavaScript alert on failure
        alert('Verification Failed: Details do not match the logged-in session.');
        return;
    }

    // If they DO match, hide verification form container
    document.getElementById('verificationCard').style.display = 'none';
    
    // Remove the .hidden class from the main Marksheet container to reveal it
    const marksheet = document.getElementById('marksheetContainer');
    marksheet.style.display = 'block';
    marksheet.classList.remove('hidden');
    document.getElementById('actionBar').classList.remove('hidden');

    // Attach print event listener after the button is visible
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    // Execute dynamic data injection
    renderMarksheet(currentStudent);
}

/**
 * Injects data, calculates grades, and renders the marksheet UI dynamically
 * @param {Object} student - The student data object
 */
function renderMarksheet(student) {
    // 3. Dynamic Data Injection (Personal Details)
    document.getElementById('res-name').textContent = student.name;
    document.getElementById('res-roll').textContent = student.rollNo;
    document.getElementById('res-course').textContent = student.course || 'B.Tech CSE';
    
    // Determine the semester targeted
    const selectedSem = localStorage.getItem('selectedSemester') || student.semester || '6th Semester';
    document.getElementById('res-sem').textContent = selectedSem;

    // 4. The Grade Loop & Math Engine
    const tbody = document.querySelector('.official-table tbody');
    tbody.innerHTML = ''; // Clear any existing hardcoded rows from HTML

    let totalMarksObtained = 0;
    let maxTotalMarks = 0;

    // Target the specific semester data from the object
    // Checks both 'results' and 'marks' formats based on your mock DB setups
    let subjectData = [];
    if (student.results && student.results[selectedSem]) {
        subjectData = student.results[selectedSem];
    } else if (student.marks) {
        // Map fallback formatting if testing from login page mock DB
        const map = { wt: 'Web Technology', cd: 'Compiler Design', ai: 'Artificial Intelligence' };
        subjectData = Object.keys(student.marks).map(key => ({
            subjectName: map[key] || key.toUpperCase(),
            maxMarks: student.marks[key].max || 100,
            marksObtained: student.marks[key].obtained || 0,
            grade: student.marks[key].grade || 'F'
        }));
    }

    // Create a loop that iterates through every subject in that semester
    subjectData.forEach((sub, index) => {
        // Keep a running tally of total marks
        totalMarksObtained += sub.marksObtained;
        maxTotalMarks += sub.maxMarks;

        // Determine pass/fail status per subject (assuming 40% passing threshold)
        const isPass = sub.marksObtained >= (sub.maxMarks * 0.4); 
        const statusText = isPass ? 'PASS' : 'FAIL';
        const badgeClass = isPass ? 'badge-pass' : 'badge-fail';

        // Use template literals to dynamically construct a <tr>
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>CS-${601 + index}</td>
            <td>${sub.subjectName}</td>
            <td>${sub.maxMarks}</td>
            <td class="marks-col">${sub.marksObtained}</td>
            <td class="marks-col">${sub.grade}</td>
            <td><span class="${badgeClass}">${statusText}</span></td>
        `;
        
        // Append this to the table's <tbody>
        tbody.appendChild(tr);
    });

    // 5. Summary Analytics Rendering
    // Calculate the final percentage
    const percentage = maxTotalMarks > 0 ? ((totalMarksObtained / maxTotalMarks) * 100).toFixed(2) : 0;

    // Inject the Totals and the Percentage into the bottom summary boxes
    const totalSpan = document.getElementById('res-total');
    if (totalSpan) {
        // Dynamically overwrite parent text to reflect the true dynamic max total
        totalSpan.parentElement.innerHTML = `<span id="res-total">${totalMarksObtained}</span> / ${maxTotalMarks}`;
    }
    
    const percentSpan = document.getElementById('res-percent');
    if (percentSpan) {
        percentSpan.textContent = percentage;
    }

    // Write an if/else statement for the final status
    const statusEl = document.getElementById('res-status');
    if (statusEl) {
        // Clear any existing badges first
        statusEl.classList.remove('badge-pass', 'badge-fail');
        
        if (percentage >= 40) {
            statusEl.textContent = 'PASSED';
            statusEl.classList.add('badge-pass'); // Apply passing CSS class
        } else {
            statusEl.textContent = 'FAILED';
            statusEl.classList.add('badge-fail'); // Apply failing CSS class
        }
    }
}