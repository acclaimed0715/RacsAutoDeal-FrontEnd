// admin.ts — Admin page logic
export {};

// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'users' | 'inventory' | 'settings' | 'reports';

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── RBAC Logic ────────────────────────────────────────────────────────────
    const currentUserRole = localStorage.getItem('currentUserRole');
    
    // Default fallback to prevent crash
    if (!currentUserRole) {
        localStorage.setItem('currentUserRole', 'Super Admin');
    }
    
    if (currentUserRole === 'Inventory Manager' || currentUserRole === 'Inventory Staff') {
        const menuUsers = document.getElementById('menuUsers');
        const menuReports = document.getElementById('menuReports');
        const menuSettings = document.getElementById('menuSettings');
        
        if (menuUsers) menuUsers.style.display = 'none';
        if (menuReports) menuReports.style.display = 'none';
        if (menuSettings) menuSettings.style.display = 'none';

        // Update profile span
        const profileSpan = document.querySelector('.admin-profile span');
        if (profileSpan) profileSpan.textContent = 'Inventory Staff';
    } else {
        const profileSpan = document.querySelector('.admin-profile span');
        if (profileSpan) profileSpan.textContent = 'Super Admin';
    }

    // ── Load Custom Staff Users ───────────────────────────────────────────────
    const staffTableBody = document.getElementById('staffTableBody');
    const storedUsersStr = localStorage.getItem('racs_staff_users');
    if (storedUsersStr && staffTableBody) {
        const storedUsers = JSON.parse(storedUsersStr);
        storedUsers.forEach((u: any) => {
            const initials = (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
            const rowHTML = `
                <td>
                    <div class="table-vehicle">
                        <div class="avatar" style="width: 30px; height: 30px; font-size: 0.8rem; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                            ${initials}
                        </div>
                        <span>${u.firstName} ${u.lastName}</span>
                    </div>
                </td>
                <td>${u.role}</td>
                <td>Newly Added</td>
                <td>
                    <button class="action-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete" title="Remove"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            const row = document.createElement('tr');
            row.innerHTML = rowHTML;
            staffTableBody.appendChild(row);
        });
    }


    // ── Logout Functionality ──────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink?.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
    });

    // ── Car Inventory Persistence Helpers ─────────────────────────────────────
    const INVENTORY_KEY = 'racs_car_inventory';

    function loadInventory(): any[] {
        return JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]');
    }
    function saveInventory(inv: any[]): void {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
    }
    function updateDashboardStats(): void {
        const inv = loadInventory();
        const statCards = document.querySelectorAll('.stat-card .stat-info p');
        if (statCards[0]) statCards[0].textContent = inv.length.toString();
    }
    function buildInventoryRow(car: any): string {
        const statusBadge = car.status === 'open'
            ? '<span class="badge in-progress">OPEN</span>'
            : car.status === 'in-progress'
            ? '<span class="badge in-progress">IN PROGRESS</span>'
            : '<span class="badge closed">CLOSED</span>';
        return `
            <tr data-car-id="${car.id}" data-mileage="${car.mileage||''}" data-fuel="${car.fuel||''}"
                data-engine="${car.engine||''}" data-hp="${car.hp||''}" data-torque="${car.torque||''}"
                data-safety="${car.safety||''}" data-seating="${car.seating||''}"
                data-promo-price="${car.promoPrice||''}" data-model="${car.model||''}"
                data-trans="${car.transmission||''}" data-desc="${car.description||''}"
                data-images='${JSON.stringify(car.images||[])}'>
                <td>${car.name}</td>
                <td>${car.brand || 'N/A'}</td>
                <td>${car.date}</td>
                <td>${car.price}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="icon-btn edit-deal-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete-deal-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }

    // ── Seed Default Cars on First Load ───────────────────────────────────────
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    if (!localStorage.getItem(INVENTORY_KEY)) {
        const defaultCars = [
            { id: 'escape2012', name: 'Ford Escape XLs 2012', brand: 'Ford', price: '₱750,000', model: '2012', fuel: 'Gasoline', transmission: '5-Speed Manual / 6-Speed Automatic', description: 'Front-Wheel Drive (FWD). AM/FM Radio, CD Player, AUX Input. Air Conditioning, Power Windows, Power Door Locks.', mileage: '45,000 KM', engine: '2.5L I4', hp: '171 hp @ 6000 rpm', torque: '171 lb-ft @ 4500 rpm', safety: 'Front Airbags, ABS, ESC', seating: '5 Seater', images: ['assets/suv_silver.png', 'assets/suv_gray.png', 'assets/suv_white.png'], status: 'open', date: 'Mar 15, 2026 10:30 AM', posted: '1 Day Ago', isFavorited: false, promoPrice: '' },
            { id: 'escape2012_titanium', name: 'Ford Escape Titanium 2012', brand: 'Ford', price: '₱800,000', model: '2012', fuel: 'Gasoline', transmission: '6-Speed Automatic', description: 'Front-Wheel Drive (FWD). Titanium Premium Package, Sony Audio, Dual Climate.', mileage: '38,000 KM', engine: '2.0L EcoBoost I4 Turbo', hp: '240 hp @ 5500 rpm', torque: '270 lb-ft @ 3000 rpm', safety: 'Blind Spot Monitor, Rear Camera, ABS', seating: '5 Seater', images: ['assets/suv_gray.png'], status: 'in-progress', date: 'Mar 16, 2026 09:15 AM', posted: '2 Days Ago', isFavorited: false, promoPrice: '' },
            { id: 'livina2023', name: 'Nissan Livina VL 2023', brand: 'Nissan', price: '₱1,100,000', model: '2023', fuel: 'Gasoline', transmission: 'CVT', description: 'Front-Wheel Drive (FWD). 8-inch Touchscreen, Apple CarPlay, Android Auto.', mileage: '12,000 KM', engine: '1.6L HR16DE', hp: '118 hp @ 5600 rpm', torque: '149 Nm @ 4000 rpm', safety: '6 Airbags, VDC, Hill Start Assist', seating: '7 Seater', images: ['assets/suv_white.png'], status: 'closed', date: 'Mar 18, 2026 02:00 PM', posted: '3 Days Ago', isFavorited: false, promoPrice: '' },
            { id: 'tesla_plaid', name: 'Tesla Model S Plaid 2024', brand: 'Tesla', price: '₱6,500,000', model: '2024', fuel: 'Electric', transmission: 'Single-Speed Fixed Gear', description: 'All-Wheel Drive. 1,020 hp, 0-60 mph in 1.99s. 17-inch Cinematic Display, Autopilot, Premium Audio.', mileage: '0 KM', engine: 'Tri-Motor Electric', hp: '1,020 hp', torque: '1,050 lb-ft', safety: 'Autopilot, 8 Cameras, 12 Ultrasonic Sensors', seating: '5 Seater', images: ['assets/tesla_plaid.png'], status: 'open', date: 'Mar 19, 2026 08:00 AM', posted: 'New Arrival', isFavorited: false, promoPrice: '' },
            { id: 'porsche_taycan', name: 'Porsche Taycan Turbo S 2024', brand: 'Porsche', price: '₱12,500,000', model: '2024', fuel: 'Electric', transmission: '2-Speed Automatic (Rear), 1-Speed (Front)', description: 'All-Wheel Drive. 800V Architecture, Matrix LED Headlights. Performance Battery Plus, Sport Chrono Package.', mileage: '0 KM', engine: 'Dual-Motor Electric', hp: '750 hp (Overboost)', torque: '774 lb-ft', safety: 'Porsche InnoDrive, Night View Assist', seating: '4 Seater', images: ['assets/porsche_taycan.png'], status: 'open', date: 'Mar 20, 2026 10:00 AM', posted: 'New Arrival', isFavorited: false, promoPrice: '' },
            { id: 'civic_rs', name: 'Honda Civic RS 2024', brand: 'Honda', price: '₱1,775,000', model: '2024', fuel: 'Gasoline (Turbo)', transmission: 'CVT', description: 'Front-Wheel Drive (FWD). Honda SENSING Suite, Bose 12-Speaker Audio.', mileage: '5,000 KM', engine: '1.5L VTEC Turbo', hp: '178 hp @ 6000 rpm', torque: '240 Nm @ 1700-4500 rpm', safety: 'Honda SENSING, 6 Airbags, LaneWatch', seating: '5 Seater', images: ['assets/sedan_black.png'], status: 'open', date: 'Mar 20, 2026 11:45 AM', posted: '1 Day Ago', isFavorited: false, promoPrice: '' },
            { id: 'mazda3', name: 'Mazda 3 Speed 2.0 2023', brand: 'Mazda', price: '₱1,500,000', model: '2023', fuel: 'Gasoline', transmission: '6-Speed Automatic', description: 'Front-Wheel Drive. SKYACTIV-G, i-ACTIVSENSE, Bose Sound System.', mileage: '8,000 KM', engine: '2.0L SKYACTIV-G', hp: '153 hp @ 6000 rpm', torque: '200 Nm @ 4000 rpm', safety: 'i-ACTIVSENSE, 6 Airbags, BSM', seating: '5 Seater', images: ['assets/hatchback_red.png'], status: 'in-progress', date: 'Mar 21, 2026 01:30 PM', posted: '4 Days Ago', isFavorited: false, promoPrice: '' },
            { id: 'mustang_gt', name: 'Ford Mustang GT 2024', brand: 'Ford', price: '₱3,500,000', model: '2024', fuel: 'Gasoline (V8)', transmission: '10-Speed Automatic', description: 'Rear-Wheel Drive (RWD). Track Apps, MagneRide Damping, SYNC 4. Recaro Leather Seats.', mileage: '2,000 KM', engine: '5.0L Ti-VCT V8', hp: '480 hp @ 7150 rpm', torque: '560 Nm @ 4900 rpm', safety: 'Ford Co-Pilot360, 8 Airbags, ABS', seating: '4 Seater', images: ['assets/sedan_black.png', 'assets/hatchback_red.png'], status: 'open', date: 'Mar 24, 2026 03:00 PM', posted: '1 Day Ago', isFavorited: false, promoPrice: '' }
        ];
        saveInventory(defaultCars);
    }

    // ── Load Inventory into Table on Start ────────────────────────────────────
    {
        const initialInv = loadInventory();
        initialInv.forEach((car: any) => {
            inventoryTableBody?.insertAdjacentHTML('beforeend', buildInventoryRow(car));
        });
        // Update stats text
        const statsText = document.querySelector('.stats-text');
        if (statsText) statsText.textContent = `Total: ${initialInv.length} deals`;
        updateDashboardStats();
    }


    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal         = document.getElementById('addModal');
    const overlay       = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop  = document.getElementById('addCarBtnTop');
    
    // New fields
    const carImageInput = document.getElementById('carImageInput') as HTMLInputElement;
    const addImgBtn     = document.querySelector('.add-img-btn') as HTMLElement;
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
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
        
        const name = nameInput.value.trim();
        const price = priceInput.value.trim();
        const brand = brandInput.value.trim();
        const status = statusSelect.value;

        if (!name || !price) {
            alert('Please fill at least the car name and price.');
            return;
        }

        const mileage = (document.getElementById('carMileage') as HTMLInputElement).value;
        const fuel = (document.getElementById('carFuelType') as HTMLInputElement).value;
        const engine = (document.getElementById('carEngine') as HTMLInputElement).value;
        const hp = (document.getElementById('carHP') as HTMLInputElement).value;
        const torque = (document.getElementById('carTorque') as HTMLInputElement).value;
        const safety = (document.getElementById('carSafety') as HTMLInputElement).value;
        const seating = (document.getElementById('carSeating') as HTMLInputElement).value;
        const promoPrice = (document.getElementById('carPricePromo') as HTMLInputElement).value;
        const model = (document.getElementById('carModelYear') as HTMLInputElement).value;
        const transmission = (document.getElementById('carTransmission') as HTMLInputElement).value;
        const description = (document.getElementById('carDescription') as HTMLTextAreaElement).value;

        const statusBadge = status === 'open' ? '<span class="badge in-progress">OPEN</span>'
            : status === 'in-progress' ? '<span class="badge in-progress">IN PROGRESS</span>'
            : '<span class="badge closed">CLOSED</span>';

        const inv = loadInventory();

        if (editingDealRow) {
            const carId = editingDealRow.getAttribute('data-car-id') || '';
            const idx = inv.findIndex((c: any) => c.id === carId);
            if (idx !== -1) {
                inv[idx] = { ...inv[idx], name, brand, price, status, mileage, fuel, engine, hp, torque, safety, seating, promoPrice, model, transmission, description, images: uploadedDealImagesData.length ? uploadedDealImagesData : inv[idx].images };
                saveInventory(inv);
            }

            editingDealRow.cells[0].textContent = name;
            editingDealRow.cells[1].textContent = brand || 'N/A';
            editingDealRow.cells[3].textContent = price;
            editingDealRow.cells[4].innerHTML = statusBadge;
            editingDealRow.setAttribute('data-mileage', mileage);
            editingDealRow.setAttribute('data-fuel', fuel);
            editingDealRow.setAttribute('data-engine', engine);
            editingDealRow.setAttribute('data-hp', hp);
            editingDealRow.setAttribute('data-torque', torque);
            editingDealRow.setAttribute('data-safety', safety);
            editingDealRow.setAttribute('data-seating', seating);
            editingDealRow.setAttribute('data-promo-price', promoPrice);
            editingDealRow.setAttribute('data-model', model);
            editingDealRow.setAttribute('data-trans', transmission);
            editingDealRow.setAttribute('data-desc', description);
            if (uploadedDealImagesData.length) editingDealRow.setAttribute('data-images', JSON.stringify(uploadedDealImagesData));
        } else {
            const carId = 'admin_' + Date.now();
            const date = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
            const newCar = { id: carId, name, brand, price, status, mileage, fuel, engine, hp, torque, safety, seating, promoPrice, model, transmission, description, images: uploadedDealImagesData, date, posted: 'Just Added', isFavorited: false };
            inv.push(newCar);
            saveInventory(inv);
            updateDashboardStats();
            inventoryTableBody?.insertAdjacentHTML('afterbegin', buildInventoryRow(newCar));
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
                const row = deleteBtn.closest('tr');
                const carId = row?.getAttribute('data-car-id');
                if (carId) {
                    const inv = loadInventory();
                    saveInventory(inv.filter((c: any) => c.id !== carId));
                    updateDashboardStats();
                }
                row?.remove();
            }
        }
    });

    // Handle Edit and Delete buttons on the Dashboard View
    document.querySelectorAll('.dashboard-content#dashboardView .action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
             const target = e.target as HTMLElement;
             const actionBtn = target.closest('.action-btn');
             if (!actionBtn) return;
             
             if (actionBtn.classList.contains('edit')) {
                 alert('This takes you to the Manage Inventory section to edit.');
                 const menuInventory = document.getElementById('menuInventory');
                 if (menuInventory) menuInventory.click();
             } else if (actionBtn.classList.contains('delete')) {
                 if (confirm('Are you sure you want to remove this recent vehicle record?')) {
                     actionBtn.closest('tr')?.remove();
                 }
             }
        });
    });

    // Dashboard View All Link
    const dashboardViewAll = document.querySelector('.dashboard-content#dashboardView .view-all');
    dashboardViewAll?.addEventListener('click', (e) => {
        e.preventDefault();
        const menuInventory = document.getElementById('menuInventory');
        if (menuInventory) menuInventory.click();
    });

    // Handle Inventory Load More
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn?.addEventListener('click', () => {
        if (loadMoreBtn) {
            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                alert('No more vehicles to load at this moment.');
                loadMoreBtn.innerHTML = originalText;
            }, 800);
        }
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
        (document.getElementById('userPassword') as HTMLInputElement).value = '';
        
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
        const password = (document.getElementById('userPassword') as HTMLInputElement)?.value;

        const isAdding = !editingRow;

        if (!username || !firstName || !lastName || !role || (isAdding && !password)) {
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
            const existingStaffBody = document.getElementById('staffTableBody');
            existingStaffBody?.appendChild(row);

            // Store new user in localStorage for authenticating
            const storedUsers = JSON.parse(localStorage.getItem('racs_staff_users') || '[]');
            storedUsers.push({ username, password, role, firstName, lastName });
            localStorage.setItem('racs_staff_users', JSON.stringify(storedUsers));
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
    const settingsView   = document.getElementById('settingsView')  as HTMLElement | null;
    const reportsView    = document.getElementById('reportsView')   as HTMLElement | null;

    function switchView(target: AdminView): void {
        // Clear active state from all sidebar items
        document.querySelectorAll<HTMLElement>('.sidebar-menu li').forEach(li => li.classList.remove('active'));

        // Hide all views
        document.getElementById('menuSettings')?.classList.remove('active');
        document.getElementById('menuReports')?.classList.remove('active');
        
        if (dashboardView) dashboardView.style.display = 'none';
        if (usersView)     usersView.style.display     = 'none';
        if (inventoryView) inventoryView.style.display = 'none';
        if (settingsView)  settingsView.style.display  = 'none';
        if (reportsView)   reportsView.style.display   = 'none';

        if (target === 'dashboard') {
            menuDashboard?.classList.add('active');
            if (dashboardView) dashboardView.style.display = 'block';
            updateTopTitle('Dashboard');
        } else if (target === 'users') {
            menuUsers?.classList.add('active');
            if (usersView) usersView.style.display = 'block';
            updateTopTitle('Manage Users');
        } else if (target === 'inventory') {
            menuInventory?.classList.add('active');
            if (inventoryView) inventoryView.style.display = 'block';
            updateTopTitle('Inventory Management');
        } else if (target === 'settings') {
            document.getElementById('menuSettings')?.classList.add('active');
            if (settingsView) settingsView.style.display = 'block';
            updateTopTitle('System Settings');
        } else if (target === 'reports') {
            document.getElementById('menuReports')?.classList.add('active');
            if (reportsView) reportsView.style.display = 'block';
            updateTopTitle('User Reports');
        }
    }

    function updateTopTitle(title: string): void {
        const topTitle = document.getElementById('currentViewTitle');
        if (topTitle) topTitle.textContent = title;
    }

    menuDashboard?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers?.addEventListener('click',     (e: Event) => { e.preventDefault(); switchView('users');     });
    menuInventory?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('inventory'); });
    document.getElementById('menuSettings')?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('settings'); });
    document.getElementById('menuReports')?.addEventListener('click', (e: Event) => { e.preventDefault(); switchView('reports'); });

    // ── Inventory Sort & Filter Logic ─────────────────────────────────────────
    const sortBtn = document.getElementById('sortBtn');
    const filterBtn = document.getElementById('filterBtn');
    const sortDropdown = document.getElementById('sortDropdown');
    const filterDropdown = document.getElementById('filterDropdown');

    const toggleDropdown = (dropdown: HTMLElement | null) => {
        if (!dropdown) return;
        const isActive = dropdown.classList.contains('active');
        // Close others first
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
        if (!isActive) dropdown.classList.add('active');
    };

    sortBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(sortDropdown); });
    filterBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(filterDropdown); });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
    });

    const parsePrice = (priceStr: string): number => {
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };

    const parseDate = (dateStr: string): number => {
        return new Date(dateStr).getTime() || 0;
    };

    const inventoryTable = document.getElementById('inventoryTableBody');

    // Sorting Logic
    sortDropdown?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const sortType = target.getAttribute('data-sort');
        if (!sortType || !inventoryTable) return;

        const rows = Array.from(inventoryTable.querySelectorAll('tr')) as HTMLTableRowElement[];
        
        rows.sort((a, b) => {
            const valA_name = a.cells[0].textContent?.toLowerCase() || '';
            const valB_name = b.cells[0].textContent?.toLowerCase() || '';
            const valA_price = parsePrice(a.cells[3].textContent || '');
            const valB_price = parsePrice(b.cells[3].textContent || '');
            const valA_date = parseDate(a.cells[2].textContent || '');
            const valB_date = parseDate(b.cells[2].textContent || '');

            switch (sortType) {
                case 'name-az': return valA_name.localeCompare(valB_name);
                case 'price-high': return valB_price - valA_price;
                case 'price-low': return valA_price - valB_price;
                case 'date-new': return valB_date - valA_date;
                case 'date-old': return valA_date - valB_date;
                default: return 0;
            }
        });

        rows.forEach(row => inventoryTable.appendChild(row));
        if (sortBtn) sortBtn.childNodes[0].textContent = `Sort by: ${target.textContent} `;
    });

    // Filtering Logic
    filterDropdown?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filterStatus = target.getAttribute('data-filter');
        if (!filterStatus || !inventoryTable) return;

        const rows = Array.from(inventoryTable.querySelectorAll('tr')) as HTMLTableRowElement[];
        
        rows.forEach(row => {
            const statusLabel = row.cells[4].textContent?.toLowerCase().trim() || '';
            if (filterStatus === 'all' || statusLabel.replace(/\s+/g, '-') === filterStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        if (filterBtn) filterBtn.childNodes[0].textContent = `Filter: ${target.textContent} `;
    });

    // ── Manage Reports Actions ──────────────────────────────────────────────────
    const reportsTableBody = document.getElementById('reportsTableBody');
    reportsTableBody?.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        const actionBtn = target.closest('.action-btn');
        if (!actionBtn) return;
        
        const row = actionBtn.closest('tr') as HTMLTableRowElement;
        const userName = row.cells[0].querySelector('span')?.textContent || 'Unknown';
        const reason = row.cells[1].textContent || '';
        
        if (actionBtn.classList.contains('edit')) {
            // View button
            alert(`Report Details\n\nUser: ${userName}\nReason: ${reason}\n\n[Full details would be shown here]`);
        } else if (actionBtn.classList.contains('delete')) {
            // 'delete' class is used for both Resolve (check icon) and Delete (trash icon) based on status
            const statusBadge = row.cells[3].querySelector('.badge');
            const isResolved = statusBadge?.classList.contains('closed');
            
            if (!isResolved) {
                // Currently Pending -> Resolve it
                if (confirm(`Mark report from ${userName} as RESOLVED?`)) {
                    if (statusBadge) {
                        statusBadge.className = 'badge closed';
                        statusBadge.textContent = 'RESOLVED';
                    }
                    actionBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    actionBtn.setAttribute('title', 'Delete');
                }
            } else {
                // Already Resolved -> Delete it
                if (confirm(`Are you sure you want to completely remove this resolved report?`)) {
                    row.remove();
                }
            }
        }
    });

    // ── Clickable Status Badges ───────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const statusSpan = target.closest('.status, .badge') as HTMLElement;
        
        if (!statusSpan) return;
        
        // Ensure it's inside a table cell to avoid accidentally clicking other badges outside
        if (!statusSpan.closest('td')) return;

        const text = statusSpan.textContent?.trim().toUpperCase() || '';
        
        // Dashboard Badges
        if (statusSpan.classList.contains('status')) {
            if (text === 'AVAILABLE') {
                statusSpan.className = 'status sold';
                statusSpan.textContent = 'Sold';
            } else if (text === 'SOLD') {
                statusSpan.className = 'status available';
                statusSpan.textContent = 'Available';
            }
        }
        
        // Inventory & Reports Badges
        if (statusSpan.classList.contains('badge')) {
            // Reports Table
            if (statusSpan.closest('#reportsTableBody')) {
                const row = statusSpan.closest('tr');
                const actionBtn = row?.querySelector('.action-btn.delete');
                
                if (text === 'PENDING') {
                    statusSpan.className = 'badge closed';
                    statusSpan.textContent = 'RESOLVED';
                    if (actionBtn) {
                        actionBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                        actionBtn.setAttribute('title', 'Delete');
                    }
                } else if (text === 'RESOLVED') {
                    statusSpan.className = 'badge in-progress';
                    statusSpan.textContent = 'PENDING';
                    if (actionBtn) {
                        actionBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                        actionBtn.setAttribute('title', 'Resolve');
                    }
                }
            } 
            // Inventory Table
            else if (statusSpan.closest('#inventoryTableBody') || statusSpan.closest('.inventory-table')) {
                if (text === 'OPEN') {
                    statusSpan.className = 'badge in-progress';
                    statusSpan.textContent = 'IN PROGRESS';
                } else if (text === 'IN PROGRESS') {
                    statusSpan.className = 'badge closed';
                    statusSpan.textContent = 'CLOSED';
                } else if (text === 'CLOSED') {
                    statusSpan.className = 'badge in-progress';
                    statusSpan.textContent = 'OPEN';
                }
            }
        }
    });

    // ── Universal Search Logic ────────────────────────────────────────────────
    const setupSearch = (inputId: string, tableId: string) => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        const tableBody = document.getElementById(tableId);
        
        input?.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            const rows = tableBody?.querySelectorAll('tr');
            
            rows?.forEach(row => {
                const text = row.textContent?.toLowerCase() || '';
                (row as HTMLElement).style.display = text.includes(query) ? '' : 'none';
            });
        });
    };

    // Special case for dashboard search which has multiple tables or a different structure
    const dashboardSearchInput = document.getElementById('dashboardSearch') as HTMLInputElement;
    dashboardSearchInput?.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        const dashboardTable = document.querySelector('#dashboardView .inventory-table tbody');
        dashboardTable?.querySelectorAll('tr').forEach(row => {
            const text = row.textContent?.toLowerCase() || '';
            (row as HTMLElement).style.display = text.includes(query) ? '' : 'none';
        });
    });

    setupSearch('inventorySearch', 'inventoryTableBody');
    setupSearch('userSearch',      'staffTableBody');
    setupSearch('reportSearch',    'reportsTableBody');

    // ── Settings Functionality ──────────────────────────────────────────────
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn?.addEventListener('click', () => {
        // Simulate saving
        saveSettingsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        saveSettingsBtn.setAttribute('disabled', 'true');
        
        setTimeout(() => {
            saveSettingsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            saveSettingsBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                saveSettingsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
                saveSettingsBtn.style.background = '';
                saveSettingsBtn.removeAttribute('disabled');
                alert('Settings saved successfully!');
            }, 1500);
        }, 1000);
    });

    const togglePasswordBtn = document.querySelector('.toggle-password');
    togglePasswordBtn?.addEventListener('click', () => {
        const passInput = document.getElementById('settingAdminPassword') as HTMLInputElement;
        const icon = togglePasswordBtn.querySelector('i');
        if (passInput.type === 'password') {
            passInput.type = 'text';
            icon?.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passInput.type = 'password';
            icon?.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    const toggleUserPass = document.getElementById('toggleUserPass');
    toggleUserPass?.addEventListener('click', () => {
        const passInput = document.getElementById('userPassword') as HTMLInputElement;
        const icon = toggleUserPass.querySelector('i');
        if (passInput.type === 'password') {
            passInput.type = 'text';
            icon?.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passInput.type = 'password';
            icon?.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});
