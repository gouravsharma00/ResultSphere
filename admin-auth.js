document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
});

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('adminUsername').value.trim();
    const passwordInput = document.getElementById('adminPassword').value;
    const errorContainer = document.getElementById('adminLoginError');
    
    errorContainer.classList.add('hidden'); // Reset errors
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save strictly as an admin token to prevent token overlap with students
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('activeAdmin', JSON.stringify(data.admin));
            window.location.href = 'admin-dashboard.html'; // Redirect to the secure area
        } else {
            errorContainer.textContent = data.message || 'Unauthorized Credentials.';
            errorContainer.classList.remove('hidden');
        }
    } catch (err) {
        errorContainer.textContent = 'Server unreachable. Is the backend running?';
        errorContainer.classList.remove('hidden');
    }
}