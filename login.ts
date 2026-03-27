// login.ts — Admin Login Logic
export {};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const togglePassword = document.getElementById('togglePassword') as HTMLElement | null;
    const errorMsg = document.getElementById('errorMsg') as HTMLElement | null;

    // ── Toggle Password Visibility ──────────────────────────────────────────
    togglePassword?.addEventListener('click', () => {
        if (!passwordInput) return;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // ── Handle Login ─────────────────────────────────────────────────────────
    loginForm?.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        if (!usernameInput || !passwordInput || !errorMsg) return;

        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        // Simple Dummy Auth (admin / admin123)
        // In a real app, this would be an API call
        if (user === 'admin' && pass === 'admin123') {
            if(errorMsg) errorMsg.textContent = '';
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('currentUserRole', 'Super Admin');
            window.location.href = 'admin.html';
        } else {
            const storedUsersStr = localStorage.getItem('racs_staff_users');
            let matchedUser = null;
            if (storedUsersStr) {
                const users = JSON.parse(storedUsersStr);
                matchedUser = users.find((u: any) => u.username === user && u.password === pass);
            }
            
            if (matchedUser) {
                if(errorMsg) errorMsg.textContent = '';
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('currentUserRole', matchedUser.role);
                window.location.href = 'admin.html';
                return;
            }

            if(errorMsg) {
                errorMsg.textContent = 'Invalid username or password. Please try again.';
                errorMsg.style.display = 'block';
            }
            
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });

    // Clear error on input
    [usernameInput, passwordInput].forEach(inp => {
        inp?.addEventListener('input', () => {
            if (errorMsg) errorMsg.style.display = 'none';
        });
    });
});
