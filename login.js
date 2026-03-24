document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorMsg = document.getElementById('errorMsg');
    // ── Toggle Password Visibility ──────────────────────────────────────────
    togglePassword === null || togglePassword === void 0 ? void 0 : togglePassword.addEventListener('click', () => {
        if (!passwordInput)
            return;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        // Toggle icon
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
    // ── Handle Login ─────────────────────────────────────────────────────────
    loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!usernameInput || !passwordInput || !errorMsg)
            return;
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        // Simple Dummy Auth (admin / admin123)
        // In a real app, this would be an API call
        if (user === 'admin' && pass === 'admin123') {
            errorMsg.textContent = '';
            // Store session (simulated)
            localStorage.setItem('adminLoggedIn', 'true');
            // Redirect to dashboard
            window.location.href = 'admin.html';
        }
        else {
            errorMsg.textContent = 'Invalid username or password. Please try again.';
            errorMsg.style.display = 'block';
            // Shake effect (optional)
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });
    // Clear error on input
    [usernameInput, passwordInput].forEach(inp => {
        inp === null || inp === void 0 ? void 0 : inp.addEventListener('input', () => {
            if (errorMsg)
                errorMsg.style.display = 'none';
        });
    });
});
export {};
