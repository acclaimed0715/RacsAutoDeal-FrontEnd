// admin.ts — Admin page logic
export {};

// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'users' | 'inventory';

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {


    // ── Logout Functionality ──────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink?.addEventListener('click', (e) => {
        // Clear session first
        localStorage.removeItem('adminLoggedIn');
        // Let the default link behavior (navigating to index.html) proceed
    });


    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal         = document.getElementById('addModal');
    const overlay       = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop  = document.getElementById('addCarBtnTop');
    
    // New fields
    const carImageInput = document.getElementById('carImageInput') as HTMLInputElement;
    const carImageUpload = document.getElementById('carImageUpload');
    const addImgBtn     = document.querySelector('.add-img-btn') as HTMLElement;
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const dealPreviewContainer = document.getElementById('dealImagesPreview');

    let uploadedDealImagesData: string[] = [];
    let editingDealRow: HTMLTableRowElement | null = null;
    const dealModalTitle = document.querySelector('#addModal h3');

    const openModal  = (): void => { modal?.classList.add('active');    overlay?.classList.add('active');    };
    const closeModal = (): void => { modal?.classList.remove('active'); overlay?.classList.remove('active'); };

    const resetDealForm = (): void => {
        (document.getElementById('carName') as HTMLInputElement).value = '';
        (document.getElementById('carPrice') as HTMLInputElement).value = '';
        (document.getElementById('carPricePromo') as HTMLInputElement).value = '';
        (document.getElementById('carModelYear') as HTMLInputElement).value = '';
        (document.getElementById('carMileage') as HTMLInputElement).value = '';
        (document.getElementById('carBrand') as HTMLInputElement).value = '';
        (document.getElementById('carTransmission') as HTMLInputElement).value = '';
        (document.getElementById('carFuelType') as HTMLInputElement).value = '';
        (document.getElementById('carEngine') as HTMLInputElement).value = '';
        (document.getElementById('carHP') as HTMLInputElement).value = '';
        (document.getElementById('carTorque') as HTMLInputElement).value = '';
        (document.getElementById('carSafety') as HTMLInputElement).value = '';
        (document.getElementById('carSeating') as HTMLInputElement).value = '';
        (document.getElementById('carDescription') as HTMLTextAreaElement).value = '';
        (document.getElementById('carStatus') as HTMLSelectElement).value = 'open';
        
        if (addImgBtn) {
            addImgBtn.style.backgroundImage = 'none';
            addImgBtn.textContent = 'ADD';
        }
        uploadedDealImagesData = [];
        if (dealPreviewContainer) dealPreviewContainer.innerHTML = '';
        editingDealRow = null;
        if (dealModalTitle) dealModalTitle.textContent = 'Add Deal';
        if (confirmAddVehicle) confirmAddVehicle.textContent = 'Add Deal';
    };

    addVehicleBtn?.addEventListener('click', () => { resetDealForm(); openModal(); });
    addCarBtnTop?.addEventListener('click',  () => { resetDealForm(); openModal(); });
    closeModalBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // Image Upload for Deal (Multiple)
    addImgBtn?.addEventListener('click', () => carImageInput?.click());
    carImageInput?.addEventListener('change', (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target?.result as string;
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
                    thumb.querySelector('.remove-thumb')?.addEventListener('click', () => {
                        const idx = uploadedDealImagesData.indexOf(dataUrl);
                        if (idx > -1) uploadedDealImagesData.splice(idx, 1);
                        thumb.remove();
                        
                        // Update background if main was removed
                        if (uploadedDealImagesData.length > 0) {
                            if (addImgBtn) addImgBtn.style.backgroundImage = `url(${uploadedDealImagesData[0]})`;
                        } else {
                            if (addImgBtn) {
                                addImgBtn.style.backgroundImage = 'none';
                                addImgBtn.textContent = 'ADD';
                            }
                        }
                    });
                    dealPreviewContainer?.appendChild(thumb);
                };
                reader.readAsDataURL(file);
            });
        }
    });

    confirmAddVehicle?.addEventListener('click', () => {
        const nameInput = document.getElementById('carName') as HTMLInputElement;
        const priceInput = document.getElementById('carPrice') as HTMLInputElement;
        const brandInput = document.getElementById('carBrand') as HTMLInputElement;
        const statusSelect = document.getElementById('carStatus') as HTMLSelectElement;
        
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
            editingDealRow.setAttribute('data-mileage', (document.getElementById('carMileage') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-fuel', (document.getElementById('carFuelType') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-engine', (document.getElementById('carEngine') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-hp', (document.getElementById('carHP') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-torque', (document.getElementById('carTorque') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-safety', (document.getElementById('carSafety') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-seating', (document.getElementById('carSeating') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-promo-price', (document.getElementById('carPricePromo') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-model', (document.getElementById('carModelYear') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-trans', (document.getElementById('carTransmission') as HTMLInputElement).value);
            editingDealRow.setAttribute('data-desc', (document.getElementById('carDescription') as HTMLTextAreaElement).value);
        } else {
            const rowHTML = `
                <tr data-mileage="${(document.getElementById('carMileage') as HTMLInputElement).value}" 
                    data-fuel="${(document.getElementById('carFuelType') as HTMLInputElement).value}"
                    data-engine="${(document.getElementById('carEngine') as HTMLInputElement).value}"
                    data-hp="${(document.getElementById('carHP') as HTMLInputElement).value}"
                    data-torque="${(document.getElementById('carTorque') as HTMLInputElement).value}"
                    data-safety="${(document.getElementById('carSafety') as HTMLInputElement).value}"
                    data-seating="${(document.getElementById('carSeating') as HTMLInputElement).value}"
                    data-promo-price="${(document.getElementById('carPricePromo') as HTMLInputElement).value}"
                    data-model="${(document.getElementById('carModelYear') as HTMLInputElement).value}"
                    data-trans="${(document.getElementById('carTransmission') as HTMLInputElement).value}"
                    data-desc="${(document.getElementById('carDescription') as HTMLTextAreaElement).value}">
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
    inventoryTableBody?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const editBtn = target.closest('.edit-deal-btn');
        if (editBtn) {
            const row = editBtn.closest('tr') as HTMLTableRowElement;
            editingDealRow = row;
            
            if (dealModalTitle) dealModalTitle.textContent = 'Edit Deal';
            if (confirmAddVehicle) confirmAddVehicle.textContent = 'Update Deal';
            
            // Fill form
            (document.getElementById('carName') as HTMLInputElement).value = row.cells[0].textContent || '';
            (document.getElementById('carBrand') as HTMLInputElement).value = row.cells[1].textContent === 'N/A' ? '' : (row.cells[1].textContent || '');
            (document.getElementById('carPrice') as HTMLInputElement).value = row.cells[3].textContent || '';
            
            const statusText = row.cells[4].textContent?.toLowerCase() || '';
            const statusSelect = document.getElementById('carStatus') as HTMLSelectElement;
            if (statusText.includes('open')) statusSelect.value = 'open';
            else if (statusText.includes('progress')) statusSelect.value = 'in-progress';
            else if (statusText.includes('closed')) statusSelect.value = 'closed';

            // Fill new fields (using data attributes since they aren't in the table)
            (document.getElementById('carMileage') as HTMLInputElement).value = row.getAttribute('data-mileage') || '';
            (document.getElementById('carFuelType') as HTMLInputElement).value = row.getAttribute('data-fuel') || '';
            (document.getElementById('carEngine') as HTMLInputElement).value = row.getAttribute('data-engine') || '';
            (document.getElementById('carHP') as HTMLInputElement).value = row.getAttribute('data-hp') || '';
            (document.getElementById('carTorque') as HTMLInputElement).value = row.getAttribute('data-torque') || '';
            (document.getElementById('carSafety') as HTMLInputElement).value = row.getAttribute('data-safety') || '';
            (document.getElementById('carSeating') as HTMLInputElement).value = row.getAttribute('data-seating') || '';
            (document.getElementById('carPricePromo') as HTMLInputElement).value = row.getAttribute('data-promo-price') || '';
            (document.getElementById('carModelYear') as HTMLInputElement).value = row.getAttribute('data-model') || '';
            (document.getElementById('carTransmission') as HTMLInputElement).value = row.getAttribute('data-trans') || '';
            (document.getElementById('carDescription') as HTMLTextAreaElement).value = row.getAttribute('data-desc') || '';
            
            openModal();
        }

        const deleteBtn = target.closest('.delete-deal-btn');
        if (deleteBtn) {
            if (confirm('Are you sure you want to remove this vehicle from inventory?')) {
                deleteBtn.closest('tr')?.remove();
            }
        }
    });

    // Handle Edit buttons on the Dashboard View
    document.querySelectorAll('.dashboard-content#dashboardView .action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
             alert('This takes you to the Manage Inventory section to edit.');
             // Simple redirect/view switch
             const menuInventory = document.getElementById('menuInventory');
             if (menuInventory) menuInventory.click();
        });
    });

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
            <td>
                <button class="action-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" title="Remove"><i class="fa-solid fa-trash"></i></button>
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
            if (confirm('Are you sure you want to remove this user?')) {
                deleteBtn.closest('tr')?.remove();
            }
        }
    });




    // ── View Switching (Dashboard / Users) ────────────────────────────────────
    const menuDashboard  = document.getElementById('menuDashboard');
    const menuUsers      = document.getElementById('menuUsers');
    const menuInventory  = document.getElementById('menuInventory');
    const dashboardView  = document.getElementById('dashboardView') as HTMLElement | null;
    const usersView      = document.getElementById('usersView')     as HTMLElement | null;
    const inventoryView  = document.getElementById('inventoryView') as HTMLElement | null;

    function switchView(target: AdminView): void {
        // Clear active state from all sidebar items
        document.querySelectorAll<HTMLElement>('.sidebar-menu li').forEach(li => li.classList.remove('active'));

        // Hide all views
        if (dashboardView) dashboardView.style.display = 'none';
        if (usersView)     usersView.style.display     = 'none';
        if (inventoryView) inventoryView.style.display = 'none';

        if (target === 'dashboard') {
            menuDashboard?.classList.add('active');
            if (dashboardView) dashboardView.style.display = 'block';
        } else if (target === 'users') {
            menuUsers?.classList.add('active');
            if (usersView) usersView.style.display = 'block';
        } else if (target === 'inventory') {
            menuInventory?.classList.add('active');
            if (inventoryView) inventoryView.style.display = 'block';
        }
    }

    menuDashboard?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers?.addEventListener('click',     (e: Event) => { e.preventDefault(); switchView('users');     });
    menuInventory?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('inventory'); });
});
