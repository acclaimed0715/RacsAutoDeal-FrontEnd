// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // ── Session Protection ──────────────────────────────────────────────────────
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
    // ── Logout Functionality ──────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink === null || logoutLink === void 0 ? void 0 : logoutLink.addEventListener('click', (e) => {
        // Clear session first
        localStorage.removeItem('adminLoggedIn');
        // Let the default link behavior (navigating to index.html) proceed
    });
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
    // ── Add User Modal ─────────────────────────────────────────────────────────
    const addStaffBtn = document.getElementById('addStaffBtn');
    const userModal = document.getElementById('userModal');
    const userOverlay = document.getElementById('userModalOverlay');
    const closeUserModal = document.getElementById('closeUserModal');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const openUserModal = () => { userModal === null || userModal === void 0 ? void 0 : userModal.classList.add('active'); userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.classList.add('active'); };
    const closeUserModalFn = () => { userModal === null || userModal === void 0 ? void 0 : userModal.classList.remove('active'); userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.classList.remove('active'); };
    addStaffBtn === null || addStaffBtn === void 0 ? void 0 : addStaffBtn.addEventListener('click', openUserModal);
    closeUserModal === null || closeUserModal === void 0 ? void 0 : closeUserModal.addEventListener('click', closeUserModalFn);
    cancelUserBtn === null || cancelUserBtn === void 0 ? void 0 : cancelUserBtn.addEventListener('click', closeUserModalFn);
    userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.addEventListener('click', closeUserModalFn);
    // ── Handle Confirm Add/Edit User ──────────────────────────────────────────
    const confirmAddUserBtn = document.getElementById('confirmAddUserBtn');
    const staffTableBody = document.getElementById('staffTableBody');
    const userModalTitle = document.querySelector('#userModal h3');
    let editingRow = null;
    let uploadedAvatarData = null;
    const resetUserForm = () => {
        document.getElementById('userUsername').value = '';
        document.getElementById('userFirstName').value = '';
        document.getElementById('userLastName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userPhone').value = '';
        document.getElementById('userRole').value = '';
        const avatarBtn = document.getElementById('avatarPreviewBtn');
        if (avatarBtn) {
            avatarBtn.style.backgroundImage = 'none';
            avatarBtn.textContent = 'ADD';
        }
        uploadedAvatarData = null;
        editingRow = null;
        if (userModalTitle)
            userModalTitle.textContent = 'Add User';
        if (confirmAddUserBtn)
            confirmAddUserBtn.textContent = 'Add User';
    };
    // ── Avatar Upload Logic ──────────────────────────────────────────────────
    const avatarInput = document.getElementById('userAvatarInput');
    const avatarBtn = document.getElementById('avatarPreviewBtn');
    avatarBtn === null || avatarBtn === void 0 ? void 0 : avatarBtn.addEventListener('click', () => avatarInput === null || avatarInput === void 0 ? void 0 : avatarInput.click());
    avatarInput === null || avatarInput === void 0 ? void 0 : avatarInput.addEventListener('change', (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                const dataUrl = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
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
    addStaffBtn === null || addStaffBtn === void 0 ? void 0 : addStaffBtn.addEventListener('click', () => {
        resetUserForm();
        openUserModal();
    });
    confirmAddUserBtn === null || confirmAddUserBtn === void 0 ? void 0 : confirmAddUserBtn.addEventListener('click', () => {
        var _a, _b, _c, _d;
        const username = (_a = document.getElementById('userUsername')) === null || _a === void 0 ? void 0 : _a.value;
        const firstName = (_b = document.getElementById('userFirstName')) === null || _b === void 0 ? void 0 : _b.value;
        const lastName = (_c = document.getElementById('userLastName')) === null || _c === void 0 ? void 0 : _c.value;
        const role = (_d = document.getElementById('userRole')) === null || _d === void 0 ? void 0 : _d.value;
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
        }
        else {
            const row = document.createElement('tr');
            row.innerHTML = rowHTML;
            staffTableBody === null || staffTableBody === void 0 ? void 0 : staffTableBody.appendChild(row);
        }
        // Reset and close
        closeUserModalFn();
        resetUserForm();
    });
    // ── Handle Edit/Delete via Delegation ─────────────────────────────────────
    staffTableBody === null || staffTableBody === void 0 ? void 0 : staffTableBody.addEventListener('click', (e) => {
        var _a, _b;
        const target = e.target;
        const editBtn = target.closest('.edit');
        const deleteBtn = target.closest('.delete');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const name = ((_a = row.cells[0].querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            const role = row.cells[1].textContent || '';
            const [first, ...lastParts] = name.split(' ');
            const last = lastParts.join(' ');
            document.getElementById('userFirstName').value = first;
            document.getElementById('userLastName').value = last;
            document.getElementById('userRole').value = role;
            // Since username/email/phone aren't in the table yet, we'll leave them blank or assume default
            // In a real app, you'd pull this from a data object
            editingRow = row;
            if (userModalTitle)
                userModalTitle.textContent = 'Edit User';
            if (confirmAddUserBtn)
                confirmAddUserBtn.textContent = 'Edit User';
            openUserModal();
        }
        if (deleteBtn) {
            if (confirm('Are you sure you want to suspend/delete this user?')) {
                (_b = deleteBtn.closest('tr')) === null || _b === void 0 ? void 0 : _b.remove();
            }
        }
    });
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
