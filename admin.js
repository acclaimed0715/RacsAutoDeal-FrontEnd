// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}
// ─── Constants ────────────────────────────────────────────────────────────────
const INVENTORY_KEY = 'racs_car_inventory';
const STAFF_KEY = 'racs_staff_users';
const REPORTS_KEY = 'racs_reports';
const SETTINGS_KEY = 'racs_settings';
const NOTIF_KEY = 'racs_admin_notifications';
// ─── Persistence Helpers ──────────────────────────────────────────────────────
function loadFromStorage(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// ─── Notification Helper ──────────────────────────────────────────────────────
function createNotification(title, message, type = 'info') {
    const notifs = loadFromStorage(NOTIF_KEY, []);
    const userRole = localStorage.getItem('currentUserRole') || 'Admin';
    const newNotif = {
        id: 'notif_' + Date.now(),
        title,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        isRead: false,
        sender: userRole
    };
    notifs.unshift(newNotif);
    saveToStorage(NOTIF_KEY, notifs.slice(0, 20)); // Keep last 20
    const renderFn = window.refreshNotifs;
    if (typeof renderFn === 'function')
        renderFn();
}
// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e;
    // ── Notification Rendering ────────────────────────────────────────────────
    const notifBadge = document.getElementById('notifBadge');
    const notifList = document.getElementById('notifList');
    const notifBtn = document.getElementById('notifBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const clearNotifs = document.getElementById('clearNotifs');
    function renderNotifications() {
        const notifs = loadFromStorage(NOTIF_KEY, []);
        const unreadCount = notifs.filter(n => !n.isRead).length;
        if (notifBadge) {
            notifBadge.textContent = unreadCount.toString();
            notifBadge.classList.toggle('active', unreadCount > 0);
        }
        if (notifList) {
            if (notifs.length === 0) {
                notifList.innerHTML = '<div class="notif-empty">No new notifications</div>';
            }
            else {
                notifList.innerHTML = notifs.map(n => `
                    <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
                        <div class="notif-icon" style="background: var(--primary-glow); color: var(--primary);">
                            <i class="fa-solid ${n.type === 'success' ? 'fa-check' : 'fa-info-circle'}"></i>
                        </div>
                        <div class="notif-content">
                            <h4>${n.title}</h4>
                            <p>${n.message}</p>
                            <span class="notif-time">${n.time} • ${n.sender}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    window.refreshNotifs = renderNotifications;
    notifBtn === null || notifBtn === void 0 ? void 0 : notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown === null || notifDropdown === void 0 ? void 0 : notifDropdown.classList.toggle('active');
        // Mark as read
        const notifs = loadFromStorage(NOTIF_KEY, []);
        notifs.forEach(n => n.isRead = true);
        saveToStorage(NOTIF_KEY, notifs);
        setTimeout(renderNotifications, 300);
    });
    document.addEventListener('click', () => notifDropdown === null || notifDropdown === void 0 ? void 0 : notifDropdown.classList.remove('active'));
    notifDropdown === null || notifDropdown === void 0 ? void 0 : notifDropdown.addEventListener('click', (e) => e.stopPropagation());
    clearNotifs === null || clearNotifs === void 0 ? void 0 : clearNotifs.addEventListener('click', () => {
        saveToStorage(NOTIF_KEY, []);
        renderNotifications();
    });
    // Initial render
    renderNotifications();
    // ... rest of the logic ...
    // ── Theme Initialization ──────────────────────────────────────────────────
    const settings = loadFromStorage(SETTINGS_KEY, {
        businessName: 'Racs Auto Deal',
        contactEmail: 'contact@racsautodeal.com',
        phone: '+63 912 345 6789',
        address: '123 Auto Avenue, Quezon City, Metro Manila',
        adminPassword: 'admin123',
        sessionTimeout: 60,
        emailNotif: true,
        stockNotif: true,
        theme: 'dark',
        currency: 'P'
    });
    // Migration: If password is '********', replace with default
    if (settings.adminPassword === '********') {
        settings.adminPassword = 'admin123';
        saveToStorage(SETTINGS_KEY, settings);
    }
    document.body.setAttribute('data-theme', settings.theme);
    // ── RBAC Logic ────────────────────────────────────────────────────────────
    // ── Auto-Repair Missing Categories ────────────────────────────────────────
    const inventory = loadFromStorage(INVENTORY_KEY, []);
    let needsUpdate = false;
    inventory.forEach(car => {
        if (!car.type) {
            needsUpdate = true;
            if (car.name.includes('Escape') || car.name.includes('Livina'))
                car.type = 'SUV';
            else if (car.name.includes('Tesla') || car.name.includes('Taycan'))
                car.type = 'Electric Car';
            else if (car.name.includes('Mustang'))
                car.type = 'Sports Car';
            else if (car.name.includes('Innova'))
                car.type = 'Van';
            else if (car.name.includes('Mazda'))
                car.type = 'Hatchback';
            else
                car.type = 'Sedan';
        }
    });
    // Check if Ford Escape Titanium is missing and add it if we have 8 cars
    if (inventory.length === 8 && !inventory.find(c => c.id === 'escape2012_titanium')) {
        needsUpdate = true;
        inventory.push({
            id: 'escape2012_titanium',
            name: 'Ford Escape Titanium',
            price: '₱800,000',
            promoPrice: '',
            modelYear: '2012',
            mileage: '38,000 KM',
            brand: 'Ford',
            transmission: '6-Speed Automatic',
            fuelType: 'Gasoline',
            engine: '2.0L I4',
            hp: '240 hp',
            torque: '270 lb-ft',
            safety: 'Front/Side Airbags, ABS',
            seating: '5 Seater',
            description: 'Front-Wheel Drive (FWD) / Optional AWD. Bluetooth, Premium Audio.',
            status: 'open',
            type: 'SUV',
            images: ['assets/suv_gray.png'],
            date: new Date().toLocaleDateString()
        });
    }
    if (needsUpdate)
        saveToStorage(INVENTORY_KEY, inventory);
    const currentUserRole = localStorage.getItem('currentUserRole') || 'Super Admin';
    const profileSpan = document.querySelector('.admin-profile span');
    if (profileSpan)
        profileSpan.textContent = currentUserRole;
    if (currentUserRole === 'Inventory Manager' || currentUserRole === 'Inventory Staff') {
        const restricted = ['menuUsers', 'menuReports', 'menuSettings'];
        restricted.forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.style.display = 'none';
        });
    }
    // ── Dashboard Logic ───────────────────────────────────────────────────────
    let currentChart = null;
    function renderDashboardChart() {
        var _a;
        const ctx = document.getElementById('inventoryChart');
        if (!ctx)
            return;
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        const chartType = ((_a = document.getElementById('chartTypeSelect')) === null || _a === void 0 ? void 0 : _a.value) || 'category';
        const dataMap = {};
        inventory.forEach(car => {
            let key = '';
            if (chartType === 'category')
                key = car.type || 'N/A';
            else if (chartType === 'brand')
                key = car.brand || 'N/A';
            else if (chartType === 'status')
                key = car.status.toUpperCase();
            const priceNum = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
            dataMap[key] = (dataMap[key] || 0) + (chartType === 'status' ? 1 : priceNum);
        });
        const labels = Object.keys(dataMap);
        const dataValues = Object.values(dataMap);
        if (currentChart) {
            currentChart.destroy();
        }
        const isStatus = chartType === 'status';
        currentChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                        label: isStatus ? 'Number of Vehicles' : 'Total Value (₱)',
                        data: dataValues,
                        backgroundColor: [
                            'rgba(231, 76, 60, 0.7)',
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(46, 204, 113, 0.7)',
                            'rgba(241, 196, 15, 0.7)',
                            'rgba(155, 89, 182, 0.7)'
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        borderRadius: 8
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.5)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255,255,255,0.8)' }
                    }
                }
            }
        });
        // Update Mini Stats
        const statsMini = document.getElementById('chartStatsMini');
        if (statsMini) {
            statsMini.innerHTML = labels.map((label, i) => `
                <div class="mini-stat-item">
                    <span class="dot" style="background: ${currentChart.data.datasets[0].backgroundColor[i % 5]}"></span>
                    <span class="label">${label}</span>
                    <span class="value">${isStatus ? dataValues[i] : '₱' + dataValues[i].toLocaleString()}</span>
                </div>
            `).join('');
        }
    }
    function renderDashboardRecent() {
        const dashboardBody = document.getElementById('dashboardInventoryBody');
        const dashboardTable = document.getElementById('dashboardInventoryTable');
        const chartRow = document.querySelector('.chart-container-row');
        const chartControls = document.querySelector('.chart-controls');
        if (!dashboardBody)
            return;
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        // Show chart for all admins
        if (chartRow)
            chartRow.style.display = 'flex';
        if (chartControls)
            chartControls.style.display = 'block';
        if (dashboardTable)
            dashboardTable.style.display = 'none';
        renderDashboardChart();
        // Update Stats
        const statValues = document.querySelectorAll('.stat-info p');
        if (statValues[0])
            statValues[0].textContent = inventory.length.toString();
        // Calculate Total Inventory Value
        const totalValue = inventory.reduce((sum, car) => {
            const priceNum = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
            return sum + priceNum;
        }, 0);
        const statStockValue = document.getElementById('statStockValue');
        if (statStockValue)
            statStockValue.textContent = '₱' + totalValue.toLocaleString();
        // Calculate Pending Inquiries
        const reports = loadFromStorage(REPORTS_KEY, []);
        const pendingCount = reports.filter(r => r.status === 'PENDING').length;
        const statPendingInquiries = document.getElementById('statPendingInquiries');
        if (statPendingInquiries)
            statPendingInquiries.textContent = pendingCount.toString();
    }
    // ── Reports Logic ─────────────────────────────────────────────────────────
    function renderReports() {
        const reportsTableBody = document.getElementById('reportsTableBody');
        if (!reportsTableBody)
            return;
        let reports = loadFromStorage(REPORTS_KEY, [
            { id: 'rep1', userName: 'Unknown User', userEmail: 'unknown@example.com', reason: 'Technical Issue', description: 'The homepage takes too long to load on my mobile device.', date: 'Mar 26, 2026', status: 'PENDING' },
            { id: 'rep2', userName: 'Alex Lee', userEmail: 'alex.lee@gmail.com', reason: 'Sold Vehicle Still Listed', description: 'I saw the Ford Escape 2012 marked as sold on Facebook but it is still open here.', date: 'Mar 27, 2026', status: 'PENDING' },
            { id: 'rep3', userName: 'Guest User', userEmail: 'guest@web.com', reason: 'Incorrect Listing', description: 'The specs for the Tesla Model S seem to be for the older version.', date: 'Mar 25, 2026', status: 'RESOLVED' }
        ]);
        if (!localStorage.getItem(REPORTS_KEY))
            saveToStorage(REPORTS_KEY, reports);
        reportsTableBody.innerHTML = '';
        reports.forEach(report => {
            var _a, _b;
            const statusClass = report.status === 'PENDING' ? 'in-progress' : 'closed';
            const actionIcon = report.status === 'PENDING' ? 'fa-check' : 'fa-trash';
            const actionTitle = report.status === 'PENDING' ? 'Resolve' : 'Delete';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="table-vehicle">
                        <div class="avatar" style="width: 30px; height: 30px; font-size: 0.8rem; background: var(--primary);">${report.userName.charAt(0)}</div>
                        <span>${report.userName}</span>
                    </div>
                </td>
                <td>${report.reason}</td>
                <td>${report.date}</td>
                <td><span class="badge ${statusClass}">${report.status}</span></td>
                <td>
                    <button class="action-btn view-report" title="View"><i class="fa-solid fa-eye"></i></button>
                    <button class="action-btn resolve-report" title="${actionTitle}"><i class="fa-solid ${actionIcon}"></i></button>
                </td>
            `;
            (_a = row.querySelector('.view-report')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                const modal = document.getElementById('reportViewModal');
                const overlay = document.getElementById('reportViewOverlay');
                if (modal && overlay) {
                    document.getElementById('viewReportUser').textContent = report.userName;
                    document.getElementById('viewReportEmail').textContent = report.userEmail;
                    document.getElementById('viewReportReason').textContent = report.reason;
                    document.getElementById('viewReportDate').textContent = report.date;
                    document.getElementById('viewReportStatus').textContent = report.status;
                    document.getElementById('viewReportDesc').textContent = report.description || 'No description provided.';
                    const statusBadge = document.getElementById('viewReportStatus');
                    if (statusBadge) {
                        statusBadge.className = 'badge ' + (report.status === 'PENDING' ? 'in-progress' : 'closed');
                    }
                    modal.classList.add('active');
                    overlay.classList.add('active');
                }
            });
            (_b = row.querySelector('.resolve-report')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                if (report.status === 'PENDING') {
                    if (confirm(`Mark report from ${report.userName} as RESOLVED?`)) {
                        saveToStorage(REPORTS_KEY, reports);
                        renderReports();
                        renderDashboardRecent();
                    }
                }
                else {
                    if (confirm(`Delete this resolved report?`)) {
                        reports = reports.filter(r => r.id !== report.id);
                        saveToStorage(REPORTS_KEY, reports);
                        renderReports();
                        renderDashboardRecent();
                    }
                }
            });
            reportsTableBody.appendChild(row);
        });
    }
    // ── Settings Logic ────────────────────────────────────────────────────────
    function initSettings() {
        const s = loadFromStorage(SETTINGS_KEY, settings);
        document.getElementById('settingBusinessName').value = s.businessName;
        document.getElementById('settingContactEmail').value = s.contactEmail;
        document.getElementById('settingPhone').value = s.phone;
        document.getElementById('settingAddress').value = s.address;
        document.getElementById('settingAdminPassword').value = s.adminPassword || '';
        document.getElementById('settingTimeout').value = s.sessionTimeout.toString();
        document.getElementById('settingNotifEmail').checked = s.emailNotif;
        document.getElementById('settingNotifStock').checked = s.stockNotif;
        document.getElementById('settingTheme').value = s.theme;
        document.getElementById('settingCurrency').value = s.currency;
    }
    // Toggle Admin Password Visibility
    (_a = document.getElementById('toggleAdminPass')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        const input = document.getElementById('settingAdminPassword');
        const icon = e.currentTarget.querySelector('i');
        if (input && icon) {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isPass);
            icon.classList.toggle('fa-eye-slash', isPass);
        }
    });
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn === null || saveSettingsBtn === void 0 ? void 0 : saveSettingsBtn.addEventListener('click', () => {
        const updated = {
            businessName: document.getElementById('settingBusinessName').value,
            contactEmail: document.getElementById('settingContactEmail').value,
            phone: document.getElementById('settingPhone').value,
            address: document.getElementById('settingAddress').value,
            adminPassword: document.getElementById('settingAdminPassword').value,
            sessionTimeout: parseInt(document.getElementById('settingTimeout').value),
            emailNotif: document.getElementById('settingNotifEmail').checked,
            stockNotif: document.getElementById('settingNotifStock').checked,
            theme: document.getElementById('settingTheme').value,
            currency: document.getElementById('settingCurrency').value
        };
        saveToStorage(SETTINGS_KEY, updated);
        document.body.setAttribute('data-theme', updated.theme);
        saveSettingsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        setTimeout(() => {
            saveSettingsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            setTimeout(() => {
                saveSettingsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
            }, 1500);
        }, 800);
    });
    // ── Staff Logic ───────────────────────────────────────────────────────────
    let editingStaffId = null;
    function renderStaff() {
        const staffTableBody = document.getElementById('staffTableBody');
        if (!staffTableBody)
            return;
        const staff = loadFromStorage(STAFF_KEY, []);
        staffTableBody.innerHTML = '';
        staff.forEach((u) => {
            var _a, _b;
            const initials = (u.firstName.charAt(0) + (((_a = u.lastName) === null || _a === void 0 ? void 0 : _a.charAt(0)) || '')).toUpperCase();
            const row = document.createElement('tr');
            row.setAttribute('data-id', u.id);
            row.innerHTML = `
                <td>
                    <div class="table-vehicle">
                        <div class="avatar" style="width: 30px; height: 30px; font-size: 0.8rem;">${initials}</div>
                        <span>${u.firstName} ${u.lastName}</span>
                    </div>
                </td>
                <td>${u.role}</td>
                <td>Newly Added</td>
                <td>
                    <button class="action-btn edit-staff" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete-staff" title="Remove"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            (_b = row.querySelector('.delete-staff')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove this staff member?')) {
                    const updated = loadFromStorage(STAFF_KEY, []).filter(s => s.id !== u.id);
                    saveToStorage(STAFF_KEY, updated);
                    renderStaff();
                }
            });
            staffTableBody.appendChild(row);
        });
    }
    // ── Inventory Logic ───────────────────────────────────────────────────────
    function renderInventory() {
        const inventoryBody = document.getElementById('inventoryTableBody');
        if (!inventoryBody)
            return;
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        inventoryBody.innerHTML = '';
        inventory.forEach((car) => {
            var _a, _b;
            const row = document.createElement('tr');
            row.setAttribute('data-id', car.id);
            const statusText = car.status.charAt(0).toUpperCase() + car.status.slice(1);
            const statusBadge = `<span class="badge ${car.status === 'open' ? 'in-progress' : 'closed'}">${statusText.toUpperCase()}</span>`;
            row.innerHTML = `
                <td>${car.name}</td>
                <td>${car.type || 'N/A'}</td>
                <td>${car.date || 'N/A'}</td>
                <td>${car.price}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="icon-btn edit-deal-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn delete-deal-btn"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            (_a = row.querySelector('.edit-deal-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => openEditCarModal(car.id));
            (_b = row.querySelector('.delete-deal-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                if (confirm('Delete this vehicle?')) {
                    const updated = loadFromStorage(INVENTORY_KEY, []).filter(c => c.id !== car.id);
                    saveToStorage(INVENTORY_KEY, updated);
                    renderInventory();
                    renderDashboardRecent();
                }
            });
            inventoryBody.appendChild(row);
        });
        const statsText = document.querySelector('.stats-text');
        if (statsText)
            statsText.textContent = `Total: ${inventory.length} deals`;
    }
    // ── Initial Render ────────────────────────────────────────────────────────
    renderDashboardRecent();
    renderReports();
    initSettings();
    renderStaff();
    renderInventory();
    // Chart Type Selector
    (_b = document.getElementById('chartTypeSelect')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', renderDashboardChart);
    // ── Navigation Logic ──────────────────────────────────────────────────────
    const userModal = document.getElementById('userModal');
    const userOverlay = document.getElementById('userModalOverlay');
    const currentViewTitle = document.getElementById('currentViewTitle');
    function switchView(viewId) {
        var _a;
        document.querySelectorAll('.dashboard-content').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(viewId + 'View');
        if (targetView)
            targetView.classList.add('active');
        document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
        const menuId = 'menu' + viewId.charAt(0).toUpperCase() + viewId.slice(1);
        (_a = document.getElementById(menuId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        if (currentViewTitle) {
            currentViewTitle.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
        }
    }
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = item.id.replace('menu', '').toLowerCase();
            switchView(id);
        });
    });
    // ── Report View Modal Logic ───────────────────────────────────────────
    const reportViewModal = document.getElementById('reportViewModal');
    const reportViewOverlay = document.getElementById('reportViewOverlay');
    const closeReportView = document.getElementById('closeReportView');
    const hideReportModal = () => {
        reportViewModal === null || reportViewModal === void 0 ? void 0 : reportViewModal.classList.remove('active');
        reportViewOverlay === null || reportViewOverlay === void 0 ? void 0 : reportViewOverlay.classList.remove('active');
    };
    closeReportView === null || closeReportView === void 0 ? void 0 : closeReportView.addEventListener('click', hideReportModal);
    reportViewOverlay === null || reportViewOverlay === void 0 ? void 0 : reportViewOverlay.addEventListener('click', hideReportModal);
    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal = document.getElementById('addModal');
    const overlay = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop = document.getElementById('addCarBtnTop');
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
    const carImageInput = document.getElementById('carImageInput');
    const addImgBtn = document.querySelector('.add-img-btn');
    const dealPreviewContainer = document.getElementById('dealImagesPreview');
    let uploadedDealImagesData = [];
    let editingDealId = null;
    const openDealModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.add('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.add('active'); };
    const closeModal = () => { modal === null || modal === void 0 ? void 0 : modal.classList.remove('active'); overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove('active'); };
    const resetDealForm = () => {
        const fields = ['carName', 'carPrice', 'carModelYear', 'carMileage', 'carBrand', 'carTransmission', 'carFuelType', 'carEngine', 'carHP', 'carTorque', 'carSafety', 'carSeating', 'carDescription'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.value = '';
        });
        document.getElementById('carStatus').value = 'open';
        if (addImgBtn) {
            addImgBtn.style.backgroundImage = 'none';
            addImgBtn.textContent = 'ADD';
        }
        uploadedDealImagesData = [];
        if (dealPreviewContainer)
            dealPreviewContainer.innerHTML = '';
        editingDealId = null;
        const title = modal === null || modal === void 0 ? void 0 : modal.querySelector('h3');
        if (title)
            title.textContent = 'Add Deal';
        if (confirmAddVehicle)
            confirmAddVehicle.textContent = 'Add Deal';
        document.getElementById('carCategory').value = '';
    };
    addVehicleBtn === null || addVehicleBtn === void 0 ? void 0 : addVehicleBtn.addEventListener('click', () => { resetDealForm(); openDealModal(); });
    addCarBtnTop === null || addCarBtnTop === void 0 ? void 0 : addCarBtnTop.addEventListener('click', () => { resetDealForm(); openDealModal(); });
    closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', closeModal);
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', closeModal);
    addImgBtn === null || addImgBtn === void 0 ? void 0 : addImgBtn.addEventListener('click', () => carImageInput === null || carImageInput === void 0 ? void 0 : carImageInput.click());
    carImageInput === null || carImageInput === void 0 ? void 0 : carImageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    var _a, _b;
                    const dataUrl = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    uploadedDealImagesData.push(dataUrl);
                    if (uploadedDealImagesData.length === 1 && addImgBtn) {
                        addImgBtn.style.backgroundImage = `url(${dataUrl})`;
                        addImgBtn.style.backgroundSize = 'cover';
                        addImgBtn.style.backgroundPosition = 'center';
                        addImgBtn.textContent = '';
                    }
                    const thumb = document.createElement('div');
                    thumb.className = 'deal-preview-thumb';
                    thumb.innerHTML = `<img src="${dataUrl}"><button class="remove-thumb">&times;</button>`;
                    (_b = thumb.querySelector('.remove-thumb')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                        uploadedDealImagesData = uploadedDealImagesData.filter(d => d !== dataUrl);
                        thumb.remove();
                    });
                    dealPreviewContainer === null || dealPreviewContainer === void 0 ? void 0 : dealPreviewContainer.appendChild(thumb);
                };
                reader.readAsDataURL(file);
            });
        }
    });
    confirmAddVehicle === null || confirmAddVehicle === void 0 ? void 0 : confirmAddVehicle.addEventListener('click', () => {
        var _a;
        const name = document.getElementById('carName').value;
        const price = document.getElementById('carPrice').value;
        if (!name || !price)
            return alert('Name and Price are required');
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        const carData = {
            id: editingDealId || 'car_' + Date.now(),
            name,
            price: price.startsWith('₱') ? price : '₱' + price,
            promoPrice: '',
            modelYear: document.getElementById('carModelYear').value,
            mileage: document.getElementById('carMileage').value,
            brand: document.getElementById('carBrand').value,
            transmission: document.getElementById('carTransmission').value,
            fuelType: document.getElementById('carFuelType').value,
            engine: document.getElementById('carEngine').value,
            hp: document.getElementById('carHP').value,
            torque: document.getElementById('carTorque').value,
            safety: document.getElementById('carSafety').value,
            seating: document.getElementById('carSeating').value,
            description: document.getElementById('carDescription').value,
            status: document.getElementById('carStatus').value,
            type: document.getElementById('carCategory').value,
            images: uploadedDealImagesData,
            date: editingDealId ? (((_a = inventory.find(c => c.id === editingDealId)) === null || _a === void 0 ? void 0 : _a.date) || new Date().toLocaleDateString()) : new Date().toLocaleDateString(),
        };
        if (editingDealId) {
            const idx = inventory.findIndex(c => c.id === editingDealId);
            if (idx !== -1)
                inventory[idx] = carData;
            createNotification('Vehicle Updated', `${name} details were modified.`, 'info');
        }
        else {
            inventory.push(carData);
            createNotification('New Vehicle Added', `${name} has been added to inventory.`, 'success');
        }
        saveToStorage(INVENTORY_KEY, inventory);
        renderInventory();
        renderDashboardRecent();
        closeModal();
    });
    function openEditCarModal(carId) {
        editingDealId = carId;
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        const car = inventory.find(c => c.id === carId);
        if (!car)
            return;
        openDealModal();
        const title = modal === null || modal === void 0 ? void 0 : modal.querySelector('h3');
        if (title)
            title.textContent = 'Edit Deal';
        if (confirmAddVehicle)
            confirmAddVehicle.textContent = 'Update Deal';
        document.getElementById('carName').value = car.name || '';
        document.getElementById('carPrice').value = (car.price || '').replace(/[₱,]/g, '');
        // Promo price removed from UI
        document.getElementById('carModelYear').value = car.modelYear || '';
        document.getElementById('carMileage').value = car.mileage || '';
        document.getElementById('carBrand').value = car.brand || '';
        document.getElementById('carTransmission').value = car.transmission || '';
        document.getElementById('carFuelType').value = car.fuelType || '';
        document.getElementById('carEngine').value = car.engine || '';
        document.getElementById('carHP').value = car.hp || '';
        document.getElementById('carTorque').value = car.torque || '';
        document.getElementById('carSafety').value = car.safety || '';
        document.getElementById('carSeating').value = car.seating || '';
        document.getElementById('carDescription').value = car.description || '';
        document.getElementById('carCategory').value = car.type || '';
        document.getElementById('carStatus').value = car.status || 'open';
        uploadedDealImagesData = car.images || [];
        if (dealPreviewContainer) {
            dealPreviewContainer.innerHTML = '';
            uploadedDealImagesData.forEach(img => {
                var _a;
                const thumb = document.createElement('div');
                thumb.className = 'deal-preview-thumb';
                thumb.innerHTML = `<img src="${img}"><button class="remove-thumb">&times;</button>`;
                (_a = thumb.querySelector('.remove-thumb')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    uploadedDealImagesData = uploadedDealImagesData.filter(d => d !== img);
                    thumb.remove();
                });
                dealPreviewContainer.appendChild(thumb);
            });
        }
        if (addImgBtn && uploadedDealImagesData.length > 0) {
            addImgBtn.style.backgroundImage = `url(${uploadedDealImagesData[0]})`;
            addImgBtn.style.backgroundSize = 'cover';
            addImgBtn.style.backgroundPosition = 'center';
            addImgBtn.textContent = '';
        }
    }
    (_c = document.getElementById('inventoryTableBody')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        const carId = row === null || row === void 0 ? void 0 : row.getAttribute('data-id');
        if (!carId)
            return;
        if (target.closest('.edit-deal-btn')) {
            openEditCarModal(carId);
        }
    });
    (_d = document.getElementById('dashboardInventoryBody')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        const carId = row === null || row === void 0 ? void 0 : row.getAttribute('data-id');
        if (!carId)
            return;
        const inventory = loadFromStorage(INVENTORY_KEY, []);
        const car = inventory.find(c => c.id === carId);
        if (!car)
            return;
        if (target.closest('.edit')) {
            switchView('inventory');
            openEditCarModal(car.id);
        }
        else if (target.closest('.delete')) {
            if (confirm(`Delete ${car.name}?`)) {
                const updated = inventory.filter(c => c.id !== car.id);
                saveToStorage(INVENTORY_KEY, updated);
                createNotification('Vehicle Deleted', `${car.name} was removed from inventory.`, 'warning');
                renderInventory();
                renderDashboardRecent();
            }
        }
    });
    // ── Add Staff Modal Logic ────────────────────────────────────────────────
    const addStaffBtn = document.getElementById('addStaffBtn');
    const closeUserModal = document.getElementById('closeUserModal');
    const confirmAddUserBtn = document.getElementById('confirmAddUserBtn');
    const openUserModal = () => { userModal === null || userModal === void 0 ? void 0 : userModal.classList.add('active'); userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.classList.add('active'); };
    const closeUserModalFn = () => { userModal === null || userModal === void 0 ? void 0 : userModal.classList.remove('active'); userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.classList.remove('active'); };
    addStaffBtn === null || addStaffBtn === void 0 ? void 0 : addStaffBtn.addEventListener('click', () => {
        editingStaffId = null;
        const fields = ['userUsername', 'userFirstName', 'userLastName', 'userEmail', 'userPhone', 'userPassword'];
        fields.forEach(f => document.getElementById(f).value = '');
        document.getElementById('userRole').value = '';
        openUserModal();
        const title = userModal === null || userModal === void 0 ? void 0 : userModal.querySelector('h3');
        if (title)
            title.textContent = 'Add User';
        if (confirmAddUserBtn)
            confirmAddUserBtn.textContent = 'Add User';
    });
    closeUserModal === null || closeUserModal === void 0 ? void 0 : closeUserModal.addEventListener('click', closeUserModalFn);
    userOverlay === null || userOverlay === void 0 ? void 0 : userOverlay.addEventListener('click', closeUserModalFn);
    (_e = document.getElementById('staffTableBody')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.edit-staff')) {
            const row = target.closest('tr');
            const sid = row === null || row === void 0 ? void 0 : row.getAttribute('data-id');
            const staff = loadFromStorage(STAFF_KEY, []);
            const user = staff.find(s => s.id === sid);
            if (user) {
                editingStaffId = user.id;
                document.getElementById('userFirstName').value = user.firstName || '';
                document.getElementById('userLastName').value = user.lastName || '';
                document.getElementById('userRole').value = user.role || '';
                document.getElementById('userUsername').value = user.username || '';
                document.getElementById('userEmail').value = user.email || '';
                document.getElementById('userPhone').value = user.phone || '';
                openUserModal();
                const title = userModal === null || userModal === void 0 ? void 0 : userModal.querySelector('h3');
                if (title)
                    title.textContent = 'Edit User';
                if (confirmAddUserBtn)
                    confirmAddUserBtn.textContent = 'Update User';
            }
        }
    });
    confirmAddUserBtn === null || confirmAddUserBtn === void 0 ? void 0 : confirmAddUserBtn.addEventListener('click', () => {
        const firstName = document.getElementById('userFirstName').value;
        const role = document.getElementById('userRole').value;
        if (!firstName || !role)
            return alert('First Name and Role are required');
        const staff = loadFromStorage(STAFF_KEY, []);
        const userData = {
            id: editingStaffId || 'staff_' + Date.now(),
            firstName,
            lastName: document.getElementById('userLastName').value,
            role,
            username: document.getElementById('userUsername').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            password: document.getElementById('userPassword').value
        };
        if (editingStaffId) {
            const idx = staff.findIndex(s => s.id === editingStaffId);
            if (idx !== -1)
                staff[idx] = userData;
            createNotification('Staff Updated', `${firstName}'s profile was updated.`, 'info');
        }
        else {
            staff.push(userData);
            createNotification('New Staff Added', `${firstName} has been added to the team.`, 'success');
        }
        saveToStorage(STAFF_KEY, staff);
        renderStaff();
        closeUserModalFn();
    });
    // ── Data Seeding Logic ───────────────────────────────────────────────────
    function seedDefaultInventory() {
        if (localStorage.getItem(INVENTORY_KEY))
            return; // Already seeded
        const defaultCars = [
            {
                id: 'escape2012',
                name: 'Ford Escape',
                price: '₱750,000',
                promoPrice: '',
                modelYear: '2012',
                mileage: '45,000 KM',
                brand: 'Ford',
                transmission: '5-Speed Manual',
                fuelType: 'Gasoline',
                engine: '2.5L I4',
                hp: '171 hp',
                torque: '171 lb-ft',
                safety: 'Front Airbags, ABS',
                seating: '5 Seater',
                description: 'Front-Wheel Drive (FWD). AM/FM Radio, CD Player, AUX Input.',
                status: 'open',
                type: 'SUV',
                images: ['assets/suv_silver.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'escape2012_titanium',
                name: 'Ford Escape Titanium',
                price: '₱800,000',
                promoPrice: '',
                modelYear: '2012',
                mileage: '38,000 KM',
                brand: 'Ford',
                transmission: '6-Speed Automatic',
                fuelType: 'Gasoline',
                engine: '2.0L I4',
                hp: '240 hp',
                torque: '270 lb-ft',
                safety: 'Front/Side Airbags, ABS',
                seating: '5 Seater',
                description: 'Front-Wheel Drive (FWD) / Optional AWD. Bluetooth, Premium Audio.',
                status: 'open',
                type: 'SUV',
                images: ['assets/suv_gray.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'tesla_plaid',
                name: 'Tesla Model S Plaid',
                price: '₱6,500,000',
                promoPrice: '',
                modelYear: '2024',
                mileage: '0 KM',
                brand: 'Tesla',
                transmission: 'Single-Speed',
                fuelType: 'Electric',
                engine: 'Tri-Motor',
                hp: '1,020 hp',
                torque: '1,050 lb-ft',
                safety: 'Autopilot, 8 Cameras',
                seating: '5 Seater',
                description: 'All-Wheel Drive (AWD). 1,020 hp, 0-60 mph in 1.99s.',
                status: 'open',
                type: 'Electric Car',
                images: ['assets/tesla_plaid.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'porsche_taycan',
                name: 'Porsche Taycan Turbo S',
                price: '₱12,500,000',
                promoPrice: '',
                modelYear: '2024',
                mileage: '0 KM',
                brand: 'Porsche',
                transmission: '2-Speed Automatic',
                fuelType: 'Electric',
                engine: 'Dual-Motor',
                hp: '750 hp',
                torque: '774 lb-ft',
                safety: 'Porsche InnoDrive',
                seating: '4 Seater',
                description: 'All-Wheel Drive (AWD). 800V Architecture.',
                status: 'open',
                type: 'Electric Car',
                images: ['assets/porsche_taycan.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'livina2023',
                name: 'Nissan Livina VL',
                price: '₱1,100,000',
                promoPrice: '',
                modelYear: '2023',
                mileage: '15,000 KM',
                brand: 'Nissan',
                transmission: '4-Speed Automatic',
                fuelType: 'Gasoline',
                engine: '1.5L I4',
                hp: '103 hp',
                torque: '141 Nm',
                safety: 'Dual Airbags, ABS',
                seating: '7 Seater',
                description: 'Front-Wheel Drive (FWD). 7-inch Touchscreen.',
                status: 'open',
                type: 'SUV',
                images: ['assets/suv_white.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'civic_rs',
                name: 'Honda Civic RS',
                price: '₱1,775,000',
                promoPrice: '',
                modelYear: '2024',
                mileage: '5,000 KM',
                brand: 'Honda',
                transmission: 'CVT',
                fuelType: 'Gasoline',
                engine: '1.5L Turbo',
                hp: '178 hp',
                torque: '240 Nm',
                safety: 'Honda SENSING',
                seating: '5 Seater',
                description: 'Front-Wheel Drive. Honda SENSING, Premium Sound.',
                status: 'open',
                images: ['assets/sedan_black.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'mazda3_sport',
                name: 'Mazda 3 Sport',
                price: '₱1,500,000',
                promoPrice: '',
                modelYear: '2023',
                mileage: '12,000 KM',
                brand: 'Mazda',
                transmission: '6-Speed Automatic',
                fuelType: 'Mild Hybrid',
                engine: '2.0L e-SKYACTIV-G',
                hp: '153 hp',
                torque: '200 Nm',
                safety: 'i-ACTIVSENSE',
                seating: '5 Seater',
                description: 'Front-Wheel Drive. 360 View Monitor.',
                status: 'open',
                type: 'Hatchback',
                images: ['assets/hatchback_red.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'innova_v',
                name: 'Toyota Innova V',
                price: '₱1,750,000',
                promoPrice: '',
                modelYear: '2022',
                mileage: '28,000 KM',
                brand: 'Toyota',
                transmission: '6-Speed Automatic',
                fuelType: 'Diesel',
                engine: '2.8L Turbo Diesel',
                hp: '174 hp',
                torque: '360 Nm',
                safety: 'Dual Airbags, ABS, VSC',
                seating: '7 Seater',
                description: 'Rear-Wheel Drive. Captain Seats, Ambient Lighting.',
                status: 'open',
                type: 'Van',
                images: ['assets/suv_gray.png'],
                date: new Date().toLocaleDateString()
            },
            {
                id: 'mustang_gt',
                name: 'Ford Mustang GT',
                price: '₱3,500,000',
                promoPrice: '',
                modelYear: '2024',
                mileage: '2,000 KM',
                brand: 'Ford',
                transmission: '10-Speed Automatic',
                fuelType: 'Gasoline (V8)',
                engine: '5.0L V8',
                hp: '480 hp',
                torque: '560 Nm',
                safety: 'Ford Co-Pilot360',
                seating: '4 Seater',
                description: 'Rear-Wheel Drive (RWD). Track Apps.',
                status: 'open',
                type: 'Sports Car',
                images: ['assets/sedan_black.png'],
                date: new Date().toLocaleDateString()
            }
        ];
        saveToStorage(INVENTORY_KEY, defaultCars);
    }
    // ── Logout Logic ──────────────────────────────────────────────────────────
    const logoutLink = document.querySelector('.logout-link a');
    logoutLink === null || logoutLink === void 0 ? void 0 : logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });
    seedDefaultInventory();
    renderDashboardRecent();
    renderReports();
});
export {};
