// Wait for HTML to fully render before executing JS
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Precise DOM Selectors
    const authForm = document.getElementById('auth-form');
    const rollInput = document.getElementById('roll-id');
    const passInput = document.getElementById('pass-id');
    const errorText = document.getElementById('error-text');

    // 2. The Form Submit Listener
    authForm.addEventListener('submit', (e) => {
        // CRITICAL: Prevent page refresh immediately
        e.preventDefault();
        
        // Hide any existing errors
        errorText.style.display = 'none';

        // Retrieve trimmed values
        const rollValue = rollInput.value.trim();
        const passValue = passInput.value.trim();

        // 3. The Direct Authentication Rules
        if ((rollValue === '2024CS01' || rollValue === '2024CS02') && passValue === 'IILM@123') {
            // Success
            sessionStorage.setItem('activeUser', rollValue);
            window.location.href = 'dashboard.html';
        } else {
            // Fail
            errorText.style.display = 'block';
            errorText.textContent = 'Invalid Roll Number or Password.';
            passInput.value = '';
        }
    });
});