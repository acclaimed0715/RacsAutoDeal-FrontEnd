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
        // Check Admin Password from Settings
        const settingsStr = localStorage.getItem('racs_settings');
        let adminPass = 'admin123';
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.adminPassword)
                    adminPass = settings.adminPassword;
            }
            catch (e) { }
        }
        // Simple Dummy Auth (admin / dynamic password)
        if (user === 'admin' && pass === adminPass) {
            errorMsg.textContent = '';
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('currentUserRole', 'Super Admin');
            window.location.href = 'admin.html';
        }
        else {
            const storedUsersStr = localStorage.getItem('racs_staff_users');
            let matchedUser;
            if (storedUsersStr) {
                try {
                    const users = JSON.parse(storedUsersStr);
                    matchedUser = users.find(u => u.username === user && u.password === pass);
                }
                catch (e) {
                    console.error('Failed to parse staff users', e);
                }
            }
            if (matchedUser) {
                errorMsg.textContent = '';
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('currentUserRole', matchedUser.role);
                window.location.href = 'admin.html';
                return;
            }
            errorMsg.textContent = 'Invalid username or password. Please try again.';
            errorMsg.style.display = 'block';
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
