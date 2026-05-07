// ==========================================================================
// ResultSphere - Bulletproof Authentication Logic
// ==========================================================================

// Ensure the script waits for the entire DOM to load before executing
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. The DOM Selectors
    // CRITICAL: Check your HTML to ensure these exact IDs are used!
    // <form id="login-form">
    // <input id="roll-input" type="text">
    // <input id="pass-input" type="password">
    // <div id="error-msg"></div>
    const loginForm = document.getElementById('login-form');
    const rollInput = document.getElementById('roll-input');
    const passInput = document.getElementById('pass-input');
    const errorMsg = document.getElementById('error-msg');

    // 2. The Event Listener
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // CRITICAL: Stop the page from refreshing immediately
            e.preventDefault();

            // Reset any previous error messages
            errorMsg.textContent = '';
            errorMsg.style.color = 'red'; // Ensuring the text is red as requested

            // 3. The Database Verification Step
            const usersDB = JSON.parse(localStorage.getItem('usersDB'));

            if (!usersDB) {
                const dbErrorMsg = 'Database Error: No users found. Please refresh the page to initialize.';
                errorMsg.textContent = dbErrorMsg;
                console.error(dbErrorMsg);
                return; // Halt execution if the database is missing
            }

            // 4. The Authentication Logic
            const rollNo = rollInput.value.trim();
            const password = passInput.value.trim();

            console.log("Attempting login for:", rollNo);

            // Search the usersDB array for a user matching BOTH Roll Number and Password
            const user = usersDB.find(u => u.rollNo === rollNo && u.password === password);

            // 5. The Routing & Session (Success vs. Fail)
            if (user) {
                console.log("Login Successful! Redirecting...");
                localStorage.setItem('activeUser', rollNo);
                window.location.href = 'dashboard.html';
            } else {
                console.warn("Login Failed: Invalid credentials.");
                errorMsg.textContent = 'Invalid Roll Number or Password.';
                passInput.value = ''; // Clear the password field for security and easy re-typing
            }
        });
    } else {
        console.error("DOM Error: Could not find the form with id='login-form'. Please check your HTML.");
    }
});