// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // ── Add Vehicle Modal ──────────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal = document.getElementById('addModal');
    const overlay = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const openModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.add('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.add('active'); };
    const closeModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.remove('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove('active'); };
    addVehicleBtn === null || addVehicleBtn === void 0 ? void 0 : addVehicleBtn.addEventListener('click', openModal);
    closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', closeModal);
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', closeModal);
    // ── View Switching (Dashboard / Users) ────────────────────────────────────
    const menuDashboard = document.getElementById('menuDashboard');
    const menuUsers = document.getElementById('menuUsers');
    const dashboardView = document.getElementById('dashboardView');
    const usersView = document.getElementById('usersView');
    function switchView(target) {
        // Clear active state from all sidebar items
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        // Hide all views
        if (dashboardView)
            dashboardView.style.display = 'none';
        if (usersView)
            usersView.style.display = 'none';
        if (target === 'dashboard') {
            menuDashboard === null || menuDashboard === void 0 ? void 0 : menuDashboard.classList.add('active');
            if (dashboardView)
                dashboardView.style.display = 'block';
        }
        else if (target === 'users') {
            menuUsers === null || menuUsers === void 0 ? void 0 : menuUsers.classList.add('active');
            if (usersView)
                usersView.style.display = 'block';
        }
    }
    menuDashboard === null || menuDashboard === void 0 ? void 0 : menuDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers === null || menuUsers === void 0 ? void 0 : menuUsers.addEventListener('click', (e) => { e.preventDefault(); switchView('users'); });
});
export {};
