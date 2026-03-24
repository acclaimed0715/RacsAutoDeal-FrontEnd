// admin.ts — Admin page logic
export {};


// ─── Types ────────────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'users';

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── Session Protection ──────────────────────────────────────────────────────
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    // ── Logout Functionality ──────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink?.addEventListener('click', (e) => {
        // Clear session first
        localStorage.removeItem('adminLoggedIn');
        // Let the default link behavior (navigating to index.html) proceed
    });


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

    // ── Add User Modal ─────────────────────────────────────────────────────────
    const addStaffBtn      = document.getElementById('addStaffBtn');
    const userModal        = document.getElementById('userModal');
    const userOverlay      = document.getElementById('userModalOverlay');
    const closeUserModal   = document.getElementById('closeUserModal');
    const cancelUserBtn    = document.getElementById('cancelUserBtn');

    const openUserModal  = (): void => { userModal?.classList.add('active');    userOverlay?.classList.add('active');    };
    const closeUserModalFn = (): void => { userModal?.classList.remove('active'); userOverlay?.classList.remove('active'); };

    addStaffBtn?.addEventListener('click', openUserModal);
    closeUserModal?.addEventListener('click', closeUserModalFn);
    cancelUserBtn?.addEventListener('click', closeUserModalFn);
    userOverlay?.addEventListener('click', closeUserModalFn);

    // ── Handle Confirm Add/Edit User ──────────────────────────────────────────
    const confirmAddUserBtn = document.getElementById('confirmAddUserBtn');
    const staffTableBody    = document.getElementById('staffTableBody');
    const userModalTitle    = document.querySelector('#userModal h3');
    let editingRow: HTMLTableRowElement | null = null;
    let uploadedAvatarData: string | null = null;

    const resetUserForm = (): void => {
        (document.getElementById('userUsername') as HTMLInputElement).value = '';
        (document.getElementById('userFirstName') as HTMLInputElement).value = '';
        (document.getElementById('userLastName') as HTMLInputElement).value = '';
        (document.getElementById('userEmail') as HTMLInputElement).value = '';
        (document.getElementById('userPhone') as HTMLInputElement).value = '';
        (document.getElementById('userRole') as HTMLSelectElement).value = '';
        
        const avatarBtn = document.getElementById('avatarPreviewBtn');
        if (avatarBtn) {
            avatarBtn.style.backgroundImage = 'none';
            avatarBtn.textContent = 'ADD';
        }
        uploadedAvatarData = null;
        editingRow = null;
        if (userModalTitle) userModalTitle.textContent = 'Add User';
        if (confirmAddUserBtn) confirmAddUserBtn.textContent = 'Add User';
    };

    // ── Avatar Upload Logic ──────────────────────────────────────────────────
    const avatarInput = document.getElementById('userAvatarInput') as HTMLInputElement;
    const avatarBtn   = document.getElementById('avatarPreviewBtn');

    avatarBtn?.addEventListener('click', () => avatarInput?.click());

    avatarInput?.addEventListener('change', (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                uploadedAvatarData = dataUrl;
                if (avatarBtn) {
                    avatarBtn.style.backgroundImage = `url(${dataUrl})`;
                    avatarBtn.style.backgroundSize = 'cover';
                    avatarBtn.style.backgroundPosition = 'center';
                    avatarBtn.textContent = ''; // Hide "ADD" text
                }
            };
            reader.readAsDataURL(file);
        }
    });

    addStaffBtn?.addEventListener('click', () => {

        resetUserForm();
        openUserModal();
    });

    confirmAddUserBtn?.addEventListener('click', () => {
        const username = (document.getElementById('userUsername') as HTMLInputElement)?.value;
        const firstName = (document.getElementById('userFirstName') as HTMLInputElement)?.value;
        const lastName = (document.getElementById('userLastName') as HTMLInputElement)?.value;
        const role = (document.getElementById('userRole') as HTMLSelectElement)?.value;

        if (!username || !firstName || !lastName || !role) {
            alert('Please fill all required fields and select a role.');
            return;
        }

        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        const dateStr = editingRow 
            ? editingRow.cells[2].textContent 
            : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

        const avatarHTML = uploadedAvatarData 
            ? `<img src="${uploadedAvatarData}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : initials;

        const rowHTML = `
            <td>
                <div class="table-vehicle">
                    <div class="avatar" style="width: 30px; height: 30px; font-size: 0.8rem; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        ${avatarHTML}
                    </div>
                    <span>${firstName} ${lastName}</span>
                </div>
            </td>

            <td>${role}</td>
            <td>${dateStr}</td>
            <td><span class="status available">Active</span></td>
            <td>
                <button class="action-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" title="Suspend"><i class="fa-solid fa-user-slash"></i></button>
            </td>
        `;

        if (editingRow) {
            editingRow.innerHTML = rowHTML;
        } else {
            const row = document.createElement('tr');
            row.innerHTML = rowHTML;
            staffTableBody?.appendChild(row);
        }

        // Reset and close
        closeUserModalFn();
        resetUserForm();
    });

    // ── Handle Edit/Delete via Delegation ─────────────────────────────────────
    staffTableBody?.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        const editBtn = target.closest('.edit');
        const deleteBtn = target.closest('.delete');

        if (editBtn) {
            const row = editBtn.closest('tr') as HTMLTableRowElement;
            const name = row.cells[0].querySelector('span')?.textContent || '';
            const role = row.cells[1].textContent || '';
            
            const [first, ...lastParts] = name.split(' ');
            const last = lastParts.join(' ');

            (document.getElementById('userFirstName') as HTMLInputElement).value = first;
            (document.getElementById('userLastName') as HTMLInputElement).value = last;
            (document.getElementById('userRole') as HTMLSelectElement).value = role;
            // Since username/email/phone aren't in the table yet, we'll leave them blank or assume default
            // In a real app, you'd pull this from a data object

            editingRow = row;
            if (userModalTitle) userModalTitle.textContent = 'Edit User';
            if (confirmAddUserBtn) confirmAddUserBtn.textContent = 'Edit User';
            openUserModal();
        }

        if (deleteBtn) {
            if (confirm('Are you sure you want to suspend/delete this user?')) {
                deleteBtn.closest('tr')?.remove();
            }
        }
    });




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
