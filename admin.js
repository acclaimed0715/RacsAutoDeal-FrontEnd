// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b;
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
        if (menuUsers)
            menuUsers.style.display = 'none';
        if (menuReports)
            menuReports.style.display = 'none';
        if (menuSettings)
            menuSettings.style.display = 'none';
        // Update profile span
        const profileSpan = document.querySelector('.admin-profile span');
        if (profileSpan)
            profileSpan.textContent = 'Inventory Staff';
    }
    else {
        const profileSpan = document.querySelector('.admin-profile span');
        if (profileSpan)
            profileSpan.textContent = 'Super Admin';
    }
    // ── Load Custom Staff Users ───────────────────────────────────────────────
    const staffTableBody = document.getElementById('staffTableBody');
    const storedUsersStr = localStorage.getItem('racs_staff_users');
    if (storedUsersStr && staffTableBody) {
        const storedUsers = JSON.parse(storedUsersStr);
        storedUsers.forEach((u) => {
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
    logoutLink === null || logoutLink === void 0 ? void 0 : logoutLink.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
    });
    // ── Car Inventory Persistence Helpers ─────────────────────────────────────
    const INVENTORY_KEY = 'racs_car_inventory';
    function loadInventory() {
        return JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]');
    }
    function saveInventory(inv) {
        localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
    }
    function updateDashboardStats() {
        const inv = loadInventory();
        const statCards = document.querySelectorAll('.stat-card .stat-info p');
        if (statCards[0])
            statCards[0].textContent = inv.length.toString();
    }
    function buildInventoryRow(car) {
        const statusBadge = car.status === 'open'
            ? '<span class="badge in-progress">OPEN</span>'
            : car.status === 'in-progress'
                ? '<span class="badge in-progress">IN PROGRESS</span>'
                : '<span class="badge closed">CLOSED</span>';
        return `
            <tr data-car-id="${car.id}" data-mileage="${car.mileage || ''}" data-fuel="${car.fuel || ''}"
                data-engine="${car.engine || ''}" data-hp="${car.hp || ''}" data-torque="${car.torque || ''}"
                data-safety="${car.safety || ''}" data-seating="${car.seating || ''}"
                data-promo-price="${car.promoPrice || ''}" data-model="${car.model || ''}"
                data-trans="${car.transmission || ''}" data-desc="${car.description || ''}"
                data-images='${JSON.stringify(car.images || [])}'>
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
        initialInv.forEach((car) => {
            inventoryTableBody === null || inventoryTableBody === void 0 ? void 0 : inventoryTableBody.insertAdjacentHTML('beforeend', buildInventoryRow(car));
        });
        // Update stats text
        const statsText = document.querySelector('.stats-text');
        if (statsText)
            statsText.textContent = `Total: ${initialInv.length} deals`;
        updateDashboardStats();
    }
    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal = document.getElementById('addModal');
    const overlay = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop = document.getElementById('addCarBtnTop');
    // New fields
    const carImageInput = document.getElementById('carImageInput');
    const addImgBtn = document.querySelector('.add-img-btn');
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
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
        const name = nameInput.value.trim();
        const price = priceInput.value.trim();
        const brand = brandInput.value.trim();
        const status = statusSelect.value;
        if (!name || !price) {
            alert('Please fill at least the car name and price.');
            return;
        }
        const mileage = document.getElementById('carMileage').value;
        const fuel = document.getElementById('carFuelType').value;
        const engine = document.getElementById('carEngine').value;
        const hp = document.getElementById('carHP').value;
        const torque = document.getElementById('carTorque').value;
        const safety = document.getElementById('carSafety').value;
        const seating = document.getElementById('carSeating').value;
        const promoPrice = document.getElementById('carPricePromo').value;
        const model = document.getElementById('carModelYear').value;
        const transmission = document.getElementById('carTransmission').value;
        const description = document.getElementById('carDescription').value;
        const statusBadge = status === 'open' ? '<span class="badge in-progress">OPEN</span>'
            : status === 'in-progress' ? '<span class="badge in-progress">IN PROGRESS</span>'
                : '<span class="badge closed">CLOSED</span>';
        const inv = loadInventory();
        if (editingDealRow) {
            const carId = editingDealRow.getAttribute('data-car-id') || '';
            const idx = inv.findIndex((c) => c.id === carId);
            if (idx !== -1) {
                inv[idx] = Object.assign(Object.assign({}, inv[idx]), { name, brand, price, status, mileage, fuel, engine, hp, torque, safety, seating, promoPrice, model, transmission, description, images: uploadedDealImagesData.length ? uploadedDealImagesData : inv[idx].images });
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
            if (uploadedDealImagesData.length)
                editingDealRow.setAttribute('data-images', JSON.stringify(uploadedDealImagesData));
        }
        else {
            const carId = 'admin_' + Date.now();
            const date = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
            const newCar = { id: carId, name, brand, price, status, mileage, fuel, engine, hp, torque, safety, seating, promoPrice, model, transmission, description, images: uploadedDealImagesData, date, posted: 'Just Added', isFavorited: false };
            inv.push(newCar);
            saveInventory(inv);
            updateDashboardStats();
            inventoryTableBody === null || inventoryTableBody === void 0 ? void 0 : inventoryTableBody.insertAdjacentHTML('afterbegin', buildInventoryRow(newCar));
        }
        closeModal();
        resetDealForm();
    });
    // Handle clicks on the Inventory Table (Edit/Delete)
    inventoryTableBody === null || inventoryTableBody === void 0 ? void 0 : inventoryTableBody.addEventListener('click', (e) => {
        var _a;
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
                const row = deleteBtn.closest('tr');
                const carId = row === null || row === void 0 ? void 0 : row.getAttribute('data-car-id');
                if (carId) {
                    const inv = loadInventory();
                    saveInventory(inv.filter((c) => c.id !== carId));
                    updateDashboardStats();
                }
                row === null || row === void 0 ? void 0 : row.remove();
            }
        }
    });
    // Handle Edit and Delete buttons on the Dashboard View
    document.querySelectorAll('.dashboard-content#dashboardView .action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            var _a;
            const target = e.target;
            const actionBtn = target.closest('.action-btn');
            if (!actionBtn)
                return;
            if (actionBtn.classList.contains('edit')) {
                alert('This takes you to the Manage Inventory section to edit.');
                const menuInventory = document.getElementById('menuInventory');
                if (menuInventory)
                    menuInventory.click();
            }
            else if (actionBtn.classList.contains('delete')) {
                if (confirm('Are you sure you want to remove this recent vehicle record?')) {
                    (_a = actionBtn.closest('tr')) === null || _a === void 0 ? void 0 : _a.remove();
                }
            }
        });
    });
    // Dashboard View All Link
    const dashboardViewAll = document.querySelector('.dashboard-content#dashboardView .view-all');
    dashboardViewAll === null || dashboardViewAll === void 0 ? void 0 : dashboardViewAll.addEventListener('click', (e) => {
        e.preventDefault();
        const menuInventory = document.getElementById('menuInventory');
        if (menuInventory)
            menuInventory.click();
    });
    // Handle Inventory Load More
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn === null || loadMoreBtn === void 0 ? void 0 : loadMoreBtn.addEventListener('click', () => {
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
        document.getElementById('userPassword').value = '';
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
        var _a, _b, _c, _d, _e;
        const username = (_a = document.getElementById('userUsername')) === null || _a === void 0 ? void 0 : _a.value;
        const firstName = (_b = document.getElementById('userFirstName')) === null || _b === void 0 ? void 0 : _b.value;
        const lastName = (_c = document.getElementById('userLastName')) === null || _c === void 0 ? void 0 : _c.value;
        const role = (_d = document.getElementById('userRole')) === null || _d === void 0 ? void 0 : _d.value;
        const password = (_e = document.getElementById('userPassword')) === null || _e === void 0 ? void 0 : _e.value;
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
        }
        else {
            const row = document.createElement('tr');
            row.innerHTML = rowHTML;
            const existingStaffBody = document.getElementById('staffTableBody');
            existingStaffBody === null || existingStaffBody === void 0 ? void 0 : existingStaffBody.appendChild(row);
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
    const settingsView = document.getElementById('settingsView');
    const reportsView = document.getElementById('reportsView');
    function switchView(target) {
        var _a, _b, _c, _d;
        // Clear active state from all sidebar items
        document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
        // Hide all views
        (_a = document.getElementById('menuSettings')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
        (_b = document.getElementById('menuReports')) === null || _b === void 0 ? void 0 : _b.classList.remove('active');
        if (dashboardView)
            dashboardView.style.display = 'none';
        if (usersView)
            usersView.style.display = 'none';
        if (inventoryView)
            inventoryView.style.display = 'none';
        if (settingsView)
            settingsView.style.display = 'none';
        if (reportsView)
            reportsView.style.display = 'none';
        if (target === 'dashboard') {
            menuDashboard === null || menuDashboard === void 0 ? void 0 : menuDashboard.classList.add('active');
            if (dashboardView)
                dashboardView.style.display = 'block';
            updateTopTitle('Dashboard');
        }
        else if (target === 'users') {
            menuUsers === null || menuUsers === void 0 ? void 0 : menuUsers.classList.add('active');
            if (usersView)
                usersView.style.display = 'block';
            updateTopTitle('Manage Users');
        }
        else if (target === 'inventory') {
            menuInventory === null || menuInventory === void 0 ? void 0 : menuInventory.classList.add('active');
            if (inventoryView)
                inventoryView.style.display = 'block';
            updateTopTitle('Inventory Management');
        }
        else if (target === 'settings') {
            (_c = document.getElementById('menuSettings')) === null || _c === void 0 ? void 0 : _c.classList.add('active');
            if (settingsView)
                settingsView.style.display = 'block';
            updateTopTitle('System Settings');
        }
        else if (target === 'reports') {
            (_d = document.getElementById('menuReports')) === null || _d === void 0 ? void 0 : _d.classList.add('active');
            if (reportsView)
                reportsView.style.display = 'block';
            updateTopTitle('User Reports');
        }
    }
    function updateTopTitle(title) {
        const topTitle = document.getElementById('currentViewTitle');
        if (topTitle)
            topTitle.textContent = title;
    }
    menuDashboard === null || menuDashboard === void 0 ? void 0 : menuDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
    menuUsers === null || menuUsers === void 0 ? void 0 : menuUsers.addEventListener('click', (e) => { e.preventDefault(); switchView('users'); });
    menuInventory === null || menuInventory === void 0 ? void 0 : menuInventory.addEventListener('click', (e) => { e.preventDefault(); switchView('inventory'); });
    (_a = document.getElementById('menuSettings')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => { e.preventDefault(); switchView('settings'); });
    (_b = document.getElementById('menuReports')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => { e.preventDefault(); switchView('reports'); });
    // ── Inventory Sort & Filter Logic ─────────────────────────────────────────
    const sortBtn = document.getElementById('sortBtn');
    const filterBtn = document.getElementById('filterBtn');
    const sortDropdown = document.getElementById('sortDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const toggleDropdown = (dropdown) => {
        if (!dropdown)
            return;
        const isActive = dropdown.classList.contains('active');
        // Close others first
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
        if (!isActive)
            dropdown.classList.add('active');
    };
    sortBtn === null || sortBtn === void 0 ? void 0 : sortBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(sortDropdown); });
    filterBtn === null || filterBtn === void 0 ? void 0 : filterBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(filterDropdown); });
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
    });
    const parsePrice = (priceStr) => {
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };
    const parseDate = (dateStr) => {
        return new Date(dateStr).getTime() || 0;
    };
    const inventoryTable = document.getElementById('inventoryTableBody');
    // Sorting Logic
    sortDropdown === null || sortDropdown === void 0 ? void 0 : sortDropdown.addEventListener('click', (e) => {
        const target = e.target;
        const sortType = target.getAttribute('data-sort');
        if (!sortType || !inventoryTable)
            return;
        const rows = Array.from(inventoryTable.querySelectorAll('tr'));
        rows.sort((a, b) => {
            var _a, _b;
            const valA_name = ((_a = a.cells[0].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            const valB_name = ((_b = b.cells[0].textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
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
        if (sortBtn)
            sortBtn.childNodes[0].textContent = `Sort by: ${target.textContent} `;
    });
    // Filtering Logic
    filterDropdown === null || filterDropdown === void 0 ? void 0 : filterDropdown.addEventListener('click', (e) => {
        const target = e.target;
        const filterStatus = target.getAttribute('data-filter');
        if (!filterStatus || !inventoryTable)
            return;
        const rows = Array.from(inventoryTable.querySelectorAll('tr'));
        rows.forEach(row => {
            var _a;
            const statusLabel = ((_a = row.cells[4].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
            if (filterStatus === 'all' || statusLabel.replace(/\s+/g, '-') === filterStatus) {
                row.style.display = '';
            }
            else {
                row.style.display = 'none';
            }
        });
        if (filterBtn)
            filterBtn.childNodes[0].textContent = `Filter: ${target.textContent} `;
    });
    // ── Manage Reports Actions ──────────────────────────────────────────────────
    const reportsTableBody = document.getElementById('reportsTableBody');
    reportsTableBody === null || reportsTableBody === void 0 ? void 0 : reportsTableBody.addEventListener('click', (e) => {
        var _a;
        const target = e.target;
        const actionBtn = target.closest('.action-btn');
        if (!actionBtn)
            return;
        const row = actionBtn.closest('tr');
        const userName = ((_a = row.cells[0].querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Unknown';
        const reason = row.cells[1].textContent || '';
        if (actionBtn.classList.contains('edit')) {
            // View button
            alert(`Report Details\n\nUser: ${userName}\nReason: ${reason}\n\n[Full details would be shown here]`);
        }
        else if (actionBtn.classList.contains('delete')) {
            // 'delete' class is used for both Resolve (check icon) and Delete (trash icon) based on status
            const statusBadge = row.cells[3].querySelector('.badge');
            const isResolved = statusBadge === null || statusBadge === void 0 ? void 0 : statusBadge.classList.contains('closed');
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
            }
            else {
                // Already Resolved -> Delete it
                if (confirm(`Are you sure you want to completely remove this resolved report?`)) {
                    row.remove();
                }
            }
        }
    });
    // ── Clickable Status Badges ───────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        var _a;
        const target = e.target;
        const statusSpan = target.closest('.status, .badge');
        if (!statusSpan)
            return;
        // Ensure it's inside a table cell to avoid accidentally clicking other badges outside
        if (!statusSpan.closest('td'))
            return;
        const text = ((_a = statusSpan.textContent) === null || _a === void 0 ? void 0 : _a.trim().toUpperCase()) || '';
        // Dashboard Badges
        if (statusSpan.classList.contains('status')) {
            if (text === 'AVAILABLE') {
                statusSpan.className = 'status sold';
                statusSpan.textContent = 'Sold';
            }
            else if (text === 'SOLD') {
                statusSpan.className = 'status available';
                statusSpan.textContent = 'Available';
            }
        }
        // Inventory & Reports Badges
        if (statusSpan.classList.contains('badge')) {
            // Reports Table
            if (statusSpan.closest('#reportsTableBody')) {
                const row = statusSpan.closest('tr');
                const actionBtn = row === null || row === void 0 ? void 0 : row.querySelector('.action-btn.delete');
                if (text === 'PENDING') {
                    statusSpan.className = 'badge closed';
                    statusSpan.textContent = 'RESOLVED';
                    if (actionBtn) {
                        actionBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                        actionBtn.setAttribute('title', 'Delete');
                    }
                }
                else if (text === 'RESOLVED') {
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
                }
                else if (text === 'IN PROGRESS') {
                    statusSpan.className = 'badge closed';
                    statusSpan.textContent = 'CLOSED';
                }
                else if (text === 'CLOSED') {
                    statusSpan.className = 'badge in-progress';
                    statusSpan.textContent = 'OPEN';
                }
            }
        }
    });
    // ── Universal Search Logic ────────────────────────────────────────────────
    const setupSearch = (inputId, tableId) => {
        const input = document.getElementById(inputId);
        const tableBody = document.getElementById(tableId);
        input === null || input === void 0 ? void 0 : input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = tableBody === null || tableBody === void 0 ? void 0 : tableBody.querySelectorAll('tr');
            rows === null || rows === void 0 ? void 0 : rows.forEach(row => {
                var _a;
                const text = ((_a = row.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    };
    // Special case for dashboard search which has multiple tables or a different structure
    const dashboardSearchInput = document.getElementById('dashboardSearch');
    dashboardSearchInput === null || dashboardSearchInput === void 0 ? void 0 : dashboardSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const dashboardTable = document.querySelector('#dashboardView .inventory-table tbody');
        dashboardTable === null || dashboardTable === void 0 ? void 0 : dashboardTable.querySelectorAll('tr').forEach(row => {
            var _a;
            const text = ((_a = row.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
    setupSearch('inventorySearch', 'inventoryTableBody');
    setupSearch('userSearch', 'staffTableBody');
    setupSearch('reportSearch', 'reportsTableBody');
    // ── Settings Functionality ──────────────────────────────────────────────
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn === null || saveSettingsBtn === void 0 ? void 0 : saveSettingsBtn.addEventListener('click', () => {
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
    togglePasswordBtn === null || togglePasswordBtn === void 0 ? void 0 : togglePasswordBtn.addEventListener('click', () => {
        const passInput = document.getElementById('settingAdminPassword');
        const icon = togglePasswordBtn.querySelector('i');
        if (passInput.type === 'password') {
            passInput.type = 'text';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
        else {
            passInput.type = 'password';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
    const toggleUserPass = document.getElementById('toggleUserPass');
    toggleUserPass === null || toggleUserPass === void 0 ? void 0 : toggleUserPass.addEventListener('click', () => {
        const passInput = document.getElementById('userPassword');
        const icon = toggleUserPass.querySelector('i');
        if (passInput.type === 'password') {
            passInput.type = 'text';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
        else {
            passInput.type = 'password';
            icon === null || icon === void 0 ? void 0 : icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});
export {};
