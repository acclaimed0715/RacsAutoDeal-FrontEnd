// admin.ts — Admin page logic
export {};


// ─── Types ────────────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'users';

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── Add Vehicle Modal ──────────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal         = document.getElementById('addModal');
    const overlay       = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const openModal  = (): void => { modal?.classList.add('active');    overlay?.classList.add('active');    };
    const closeModal = (): void => { modal?.classList.remove('active'); overlay?.classList.remove('active'); };

    addVehicleBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // ── View Switching (Dashboard / Users) ────────────────────────────────────
    const menuDashboard  = document.getElementById('menuDashboard');
    const menuUsers      = document.getElementById('menuUsers');
    const dashboardView  = document.getElementById('dashboardView') as HTMLElement | null;
    const usersView      = document.getElementById('usersView')     as HTMLElement | null;

    function switchView(target: AdminView): void {
        // Clear active state from all sidebar items
        document.querySelectorAll<HTMLElement>('.sidebar-menu li').forEach(li => li.classList.remove('active'));

        // Hide all views
        if (dashboardView) dashboardView.style.display = 'none';
        if (usersView)     usersView.style.display     = 'none';

        if (target === 'dashboard') {
            menuDashboard?.classList.add('active');
            if (dashboardView) dashboardView.style.display = 'block';
        } else if (target === 'users') {
            menuUsers?.classList.add('active');
            if (usersView) usersView.style.display = 'block';
        }
    }

    menuDashboard?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers?.addEventListener('click',     (e: Event) => { e.preventDefault(); switchView('users');     });
});
