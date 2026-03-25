// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // ── Logout Functionality ──────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink === null || logoutLink === void 0 ? void 0 : logoutLink.addEventListener('click', (e) => {
        // Clear session first
        localStorage.removeItem('adminLoggedIn');
        // Let the default link behavior (navigating to index.html) proceed
    });
    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal = document.getElementById('addModal');
    const overlay = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop = document.getElementById('addCarBtnTop');
    // New fields
    const carImageInput = document.getElementById('carImageInput');
    const carImageUpload = document.getElementById('carImageUpload');
    const addImgBtn = document.querySelector('.add-img-btn');
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const dealPreviewContainer = document.getElementById('dealImagesPreview');
    let uploadedDealImagesData = [];
    let editingDealRow = null;
    const dealModalTitle = document.querySelector('#addModal h3');
    const openModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.add('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.add('active'); };
    const closeModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.remove('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove('active'); };
    const resetDealForm = () => {
        document.getElementById('carName').value = '';
        document.getElementById('carPrice').value = '';
        document.getElementById('carPricePromo').value = '';
        document.getElementById('carModelYear').value = '';
        document.getElementById('carMileage').value = '';
        document.getElementById('carBrand').value = '';
        document.getElementById('carTransmission').value = '';
        document.getElementById('carFuelType').value = '';
        document.getElementById('carEngine').value = '';
        document.getElementById('carHP').value = '';
        document.getElementById('carTorque').value = '';
        document.getElementById('carSafety').value = '';
        document.getElementById('carSeating').value = '';
        document.getElementById('carDescription').value = '';
        document.getElementById('carStatus').value = 'open';
        if (addImgBtn) {
            addImgBtn.style.backgroundImage = 'none';
            addImgBtn.textContent = 'ADD';
        }
        uploadedDealImagesData = [];
        if (dealPreviewContainer)
            dealPreviewContainer.innerHTML = '';
        editingDealRow = null;
        if (dealModalTitle)
            dealModalTitle.textContent = 'Add Deal';
        if (confirmAddVehicle)
            confirmAddVehicle.textContent = 'Add Deal';
    };
    addVehicleBtn === null || addVehicleBtn === void 0 ? void 0 : addVehicleBtn.addEventListener('click', () => { resetDealForm(); openModal(); });
    addCarBtnTop === null || addCarBtnTop === void 0 ? void 0 : addCarBtnTop.addEventListener('click', () => { resetDealForm(); openModal(); });
    closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', closeModal);
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', closeModal);
    // Image Upload for Deal (Multiple)
    addImgBtn === null || addImgBtn === void 0 ? void 0 : addImgBtn.addEventListener('click', () => carImageInput === null || carImageInput === void 0 ? void 0 : carImageInput.click());
    carImageInput === null || carImageInput === void 0 ? void 0 : carImageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    var _a, _b;
                    const dataUrl = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                    uploadedDealImagesData.push(dataUrl);
                    // Update main preview if first image
                    if (uploadedDealImagesData.length === 1 && addImgBtn) {
                        addImgBtn.style.backgroundImage = `url(${dataUrl})`;
                        addImgBtn.style.backgroundSize = 'cover';
                        addImgBtn.style.backgroundPosition = 'center';
                        addImgBtn.textContent = '';
                    }
                    // Add thumbnail
                    const thumb = document.createElement('div');
                    thumb.className = 'deal-preview-thumb';
                    thumb.innerHTML = `
                        <img src="${dataUrl}">
                        <button class="remove-thumb">&times;</button>
                    `;
                    (_b = thumb.querySelector('.remove-thumb')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                        const idx = uploadedDealImagesData.indexOf(dataUrl);
                        if (idx > -1)
                            uploadedDealImagesData.splice(idx, 1);
                        thumb.remove();
                        // Update background if main was removed
                        if (uploadedDealImagesData.length > 0) {
                            if (addImgBtn)
                                addImgBtn.style.backgroundImage = `url(${uploadedDealImagesData[0]})`;
                        }
                        else {
                            if (addImgBtn) {
                                addImgBtn.style.backgroundImage = 'none';
                                addImgBtn.textContent = 'ADD';
                            }
                        }
                    });
                    dealPreviewContainer === null || dealPreviewContainer === void 0 ? void 0 : dealPreviewContainer.appendChild(thumb);
                };
                reader.readAsDataURL(file);
            });
        }
    });
    confirmAddVehicle === null || confirmAddVehicle === void 0 ? void 0 : confirmAddVehicle.addEventListener('click', () => {
        const nameInput = document.getElementById('carName');
        const priceInput = document.getElementById('carPrice');
        const brandInput = document.getElementById('carBrand');
        const statusSelect = document.getElementById('carStatus');
        const name = nameInput.value;
        const price = priceInput.value;
        const brand = brandInput.value;
        const status = statusSelect.value;
        const date = editingDealRow
            ? editingDealRow.cells[2].textContent
            : new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        if (!name || !price) {
            alert('Please fill at least the car name and price.');
            return;
        }
        const statusBadge = status === 'open' ? '<span class="badge in-progress">OPEN</span>' :
            status === 'in-progress' ? '<span class="badge in-progress">IN PROGRESS</span>' :
                '<span class="badge closed">CLOSED</span>';
        if (editingDealRow) {
            editingDealRow.cells[0].textContent = name;
            editingDealRow.cells[1].textContent = brand || 'N/A';
            editingDealRow.cells[3].textContent = price;
            editingDealRow.cells[4].innerHTML = statusBadge;
            // Update attributes
            editingDealRow.setAttribute('data-mileage', document.getElementById('carMileage').value);
            editingDealRow.setAttribute('data-fuel', document.getElementById('carFuelType').value);
            editingDealRow.setAttribute('data-engine', document.getElementById('carEngine').value);
            editingDealRow.setAttribute('data-hp', document.getElementById('carHP').value);
            editingDealRow.setAttribute('data-torque', document.getElementById('carTorque').value);
            editingDealRow.setAttribute('data-safety', document.getElementById('carSafety').value);
            editingDealRow.setAttribute('data-seating', document.getElementById('carSeating').value);
            editingDealRow.setAttribute('data-promo-price', document.getElementById('carPricePromo').value);
            editingDealRow.setAttribute('data-model', document.getElementById('carModelYear').value);
            editingDealRow.setAttribute('data-trans', document.getElementById('carTransmission').value);
            editingDealRow.setAttribute('data-desc', document.getElementById('carDescription').value);
        }
        else {
            const rowHTML = `
                <tr data-mileage="${document.getElementById('carMileage').value}" 
                    data-fuel="${document.getElementById('carFuelType').value}"
                    data-engine="${document.getElementById('carEngine').value}"
                    data-hp="${document.getElementById('carHP').value}"
                    data-torque="${document.getElementById('carTorque').value}"
                    data-safety="${document.getElementById('carSafety').value}"
                    data-seating="${document.getElementById('carSeating').value}"
                    data-promo-price="${document.getElementById('carPricePromo').value}"
                    data-model="${document.getElementById('carModelYear').value}"
                    data-trans="${document.getElementById('carTransmission').value}"
                    data-desc="${document.getElementById('carDescription').value}">
                    <td>${name}</td>
                    <td>${brand || 'N/A'}</td>
                    <td>${date}</td>
                    <td>${price}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="icon-btn edit-deal-btn"><i class="fa-solid fa-pen"></i></button>
                        <button class="icon-btn delete-deal-btn"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
            if (inventoryTableBody) {
                inventoryTableBody.insertAdjacentHTML('afterbegin', rowHTML);
            }
        }
        closeModal();
        resetDealForm();
    });
    // Handle clicks on the Inventory Table (Edit/Delete)
    inventoryTableBody === null || inventoryTableBody === void 0 ? void 0 : inventoryTableBody.addEventListener('click', (e) => {
        var _a, _b;
        const target = e.target;
        const editBtn = target.closest('.edit-deal-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            editingDealRow = row;
            if (dealModalTitle)
                dealModalTitle.textContent = 'Edit Deal';
            if (confirmAddVehicle)
                confirmAddVehicle.textContent = 'Update Deal';
            // Fill form
            document.getElementById('carName').value = row.cells[0].textContent || '';
            document.getElementById('carBrand').value = row.cells[1].textContent === 'N/A' ? '' : (row.cells[1].textContent || '');
            document.getElementById('carPrice').value = row.cells[3].textContent || '';
            const statusText = ((_a = row.cells[4].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            const statusSelect = document.getElementById('carStatus');
            if (statusText.includes('open'))
                statusSelect.value = 'open';
            else if (statusText.includes('progress'))
                statusSelect.value = 'in-progress';
            else if (statusText.includes('closed'))
                statusSelect.value = 'closed';
            // Fill new fields (using data attributes since they aren't in the table)
            document.getElementById('carMileage').value = row.getAttribute('data-mileage') || '';
            document.getElementById('carFuelType').value = row.getAttribute('data-fuel') || '';
            document.getElementById('carEngine').value = row.getAttribute('data-engine') || '';
            document.getElementById('carHP').value = row.getAttribute('data-hp') || '';
            document.getElementById('carTorque').value = row.getAttribute('data-torque') || '';
            document.getElementById('carSafety').value = row.getAttribute('data-safety') || '';
            document.getElementById('carSeating').value = row.getAttribute('data-seating') || '';
            document.getElementById('carPricePromo').value = row.getAttribute('data-promo-price') || '';
            document.getElementById('carModelYear').value = row.getAttribute('data-model') || '';
            document.getElementById('carTransmission').value = row.getAttribute('data-trans') || '';
            document.getElementById('carDescription').value = row.getAttribute('data-desc') || '';
            openModal();
        }
        const deleteBtn = target.closest('.delete-deal-btn');
        if (deleteBtn) {
            if (confirm('Are you sure you want to remove this vehicle from inventory?')) {
                (_b = deleteBtn.closest('tr')) === null || _b === void 0 ? void 0 : _b.remove();
            }
        }
    });
    // Handle Edit buttons on the Dashboard View
    document.querySelectorAll('.dashboard-content#dashboardView .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('This takes you to the Manage Inventory section to edit.');
            // Simple redirect/view switch
            const menuInventory = document.getElementById('menuInventory');
            if (menuInventory)
                menuInventory.click();
        });
    });
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
            <td>
                <button class="action-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" title="Remove"><i class="fa-solid fa-trash"></i></button>
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
            if (confirm('Are you sure you want to remove this user?')) {
                (_b = deleteBtn.closest('tr')) === null || _b === void 0 ? void 0 : _b.remove();
            }
        }
    });
    // ── View Switching (Dashboard / Users) ────────────────────────────────────
    const menuDashboard = document.getElementById('menuDashboard');
    const menuUsers = document.getElementById('menuUsers');
    const menuInventory = document.getElementById('menuInventory');
    const dashboardView = document.getElementById('dashboardView');
    const usersView = document.getElementById('usersView');
    const inventoryView = document.getElementById('inventoryView');
    function switchView(target) {
        // Clear active state from all sidebar items
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        // Hide all views
        if (dashboardView)
            dashboardView.style.display = 'none';
        if (usersView)
            usersView.style.display = 'none';
        if (inventoryView)
            inventoryView.style.display = 'none';
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
        else if (target === 'inventory') {
            menuInventory === null || menuInventory === void 0 ? void 0 : menuInventory.classList.add('active');
            if (inventoryView)
                inventoryView.style.display = 'block';
        }
    }
    menuDashboard === null || menuDashboard === void 0 ? void 0 : menuDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers === null || menuUsers === void 0 ? void 0 : menuUsers.addEventListener('click', (e) => { e.preventDefault(); switchView('users'); });
    menuInventory === null || menuInventory === void 0 ? void 0 : menuInventory.addEventListener('click', (e) => { e.preventDefault(); switchView('inventory'); });
});
export {};
