// ── admin.ts — Admin page logic ───────────────────────────────────────────
export {};

// ── Session Protection ──────────────────────────────────────────────────────
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

type AdminView = 'dashboard' | 'users' | 'inventory' | 'settings' | 'reports';

interface Vehicle {
    id: string;
    name: string;
    price: string;
    promoPrice: string;
    modelYear: string;
    mileage: string;
    brand: string;
    transmission: string;
    fuelType: string;
    engine: string;
    hp: string;
    torque: string;
    safety: string;
    seating: string;
    description: string;
    status: 'open' | 'in-progress' | 'closed';
    images: string[];
    date: string;
    type?: string; 
}

interface StaffMember {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    password?: string;
}

interface UserReport {
    id: string;
    userName: string;
    userEmail: string;
    reason: string;
    description?: string;
    date: string;
    status: 'PENDING' | 'RESOLVED';
}

interface AppSettings {
    businessName: string;
    contactEmail: string;
    phone: string;
    address: string;
    adminPassword?: string;
    sessionTimeout: number;
    emailNotif: boolean;
    stockNotif: boolean;
    theme: 'dark' | 'light' | 'luxury';
    currency: string;
}

interface AdminNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    sender: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const INVENTORY_KEY = 'racs_car_inventory';
const STAFF_KEY = 'racs_staff_users';
const REPORTS_KEY = 'racs_reports';
const SETTINGS_KEY = 'racs_settings';
const NOTIF_KEY = 'racs_admin_notifications';

// ─── Persistence Helpers ──────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function saveToStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

// ─── Notification Helper ──────────────────────────────────────────────────────
function createNotification(title: string, message: string, type: AdminNotification['type'] = 'info') {
    const notifs = loadFromStorage<AdminNotification[]>(NOTIF_KEY, []);
    const userRole = localStorage.getItem('currentUserRole') || 'Admin';
    
    const newNotif: AdminNotification = {
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
    
    const renderFn = (window as any).refreshNotifs as (() => void) | undefined;
    if (typeof renderFn === 'function') renderFn();
}

// ─── DOM Ready ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // ── Notification Rendering ────────────────────────────────────────────────
    const notifBadge = document.getElementById('notifBadge') as HTMLElement | null;
    const notifList = document.getElementById('notifList') as HTMLElement | null;
    const notifBtn = document.getElementById('notifBtn') as HTMLElement | null;
    const notifDropdown = document.getElementById('notifDropdown') as HTMLElement | null;
    const clearNotifs = document.getElementById('clearNotifs') as HTMLElement | null;

    function renderNotifications() {
        const notifs = loadFromStorage<AdminNotification[]>(NOTIF_KEY, []);
        const unreadCount = notifs.filter(n => !n.isRead).length;

        if (notifBadge) {
            notifBadge.textContent = unreadCount.toString();
            notifBadge.classList.toggle('active', unreadCount > 0);
        }

        if (notifList) {
            if (notifs.length === 0) {
                notifList.innerHTML = '<div class="notif-empty">No new notifications</div>';
            } else {
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

    (window as any).refreshNotifs = renderNotifications;

    notifBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown?.classList.toggle('active');
        
        // Mark as read
        const notifs = loadFromStorage<AdminNotification[]>(NOTIF_KEY, []);
        notifs.forEach(n => n.isRead = true);
        saveToStorage(NOTIF_KEY, notifs);
        setTimeout(renderNotifications, 300);
    });

    document.addEventListener('click', () => notifDropdown?.classList.remove('active'));
    notifDropdown?.addEventListener('click', (e) => e.stopPropagation());

    clearNotifs?.addEventListener('click', () => {
        saveToStorage(NOTIF_KEY, []);
        renderNotifications();
    });

    // Initial render
    renderNotifications();

    // ... rest of the logic ...

    // ── Theme Initialization ──────────────────────────────────────────────────
    const settings = loadFromStorage<AppSettings>(SETTINGS_KEY, {
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
    const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
    let needsUpdate = false;
    inventory.forEach(car => {
        if (!car.type) {
            needsUpdate = true;
            if (car.name.includes('Escape') || car.name.includes('Livina')) car.type = 'SUV';
            else if (car.name.includes('Tesla') || car.name.includes('Taycan')) car.type = 'Electric Car';
            else if (car.name.includes('Mustang')) car.type = 'Sports Car';
            else if (car.name.includes('Innova')) car.type = 'Van';
            else if (car.name.includes('Mazda')) car.type = 'Hatchback';
            else car.type = 'Sedan';
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

    if (needsUpdate) saveToStorage(INVENTORY_KEY, inventory);

    const currentUserRole = localStorage.getItem('currentUserRole') || 'Super Admin';
    const profileSpan = document.querySelector('.admin-profile span');
    if (profileSpan) profileSpan.textContent = currentUserRole;

    if (currentUserRole === 'Inventory Manager' || currentUserRole === 'Inventory Staff') {
        const restricted = ['menuUsers', 'menuReports', 'menuSettings'];
        restricted.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }

    // ── Dashboard Logic ───────────────────────────────────────────────────────
    let currentChart: any = null;

    function renderDashboardChart() {
        const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement | null;
        if (!ctx) return;

        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        const chartType = (document.getElementById('chartTypeSelect') as HTMLSelectElement)?.value || 'category';
        
        const dataMap: Record<string, number> = {};
        
        inventory.forEach(car => {
            let key = '';
            if (chartType === 'category') key = car.type || 'N/A';
            else if (chartType === 'brand') key = car.brand || 'N/A';
            else if (chartType === 'status') key = car.status.toUpperCase();

            const priceNum = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
            dataMap[key] = (dataMap[key] || 0) + (chartType === 'status' ? 1 : priceNum);
        });

        const labels = Object.keys(dataMap);
        const dataValues = Object.values(dataMap);

        if (currentChart) {
            currentChart.destroy();
        }

        const isStatus = chartType === 'status';
        
        currentChart = new (window as any).Chart(ctx, {
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
        const dashboardBody = document.getElementById('dashboardInventoryBody') as HTMLElement | null;
        const dashboardTable = document.getElementById('dashboardInventoryTable');
        const chartRow = document.querySelector('.chart-container-row') as HTMLElement | null;
        const chartControls = document.querySelector('.chart-controls') as HTMLElement | null;
        
        if (!dashboardBody) return;

        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        
        // Show chart for all admins
        if (chartRow) chartRow.style.display = 'flex';
        if (chartControls) chartControls.style.display = 'block';
        if (dashboardTable) dashboardTable.style.display = 'none';
        renderDashboardChart();

        // Update Stats
        const statValues = document.querySelectorAll('.stat-info p');
        if (statValues[0]) statValues[0].textContent = inventory.length.toString();
        
        // Calculate Total Inventory Value
        const totalValue = inventory.reduce((sum, car) => {
            const priceNum = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
            return sum + priceNum;
        }, 0);
        const statStockValue = document.getElementById('statStockValue');
        if (statStockValue) statStockValue.textContent = '₱' + totalValue.toLocaleString();

        // Calculate Pending Inquiries
        const reports = loadFromStorage<UserReport[]>(REPORTS_KEY, []);
        const pendingCount = reports.filter(r => r.status === 'PENDING').length;
        const statPendingInquiries = document.getElementById('statPendingInquiries');
        if (statPendingInquiries) statPendingInquiries.textContent = pendingCount.toString();
    }

    // ── Reports Logic ─────────────────────────────────────────────────────────
    function renderReports() {
        const reportsTableBody = document.getElementById('reportsTableBody');
        if (!reportsTableBody) return;

        let reports = loadFromStorage<UserReport[]>(REPORTS_KEY, [
            { id: 'rep1', userName: 'Unknown User', userEmail: 'unknown@example.com', reason: 'Technical Issue', description: 'The homepage takes too long to load on my mobile device.', date: 'Mar 26, 2026', status: 'PENDING' },
            { id: 'rep2', userName: 'Alex Lee', userEmail: 'alex.lee@gmail.com', reason: 'Sold Vehicle Still Listed', description: 'I saw the Ford Escape 2012 marked as sold on Facebook but it is still open here.', date: 'Mar 27, 2026', status: 'PENDING' },
            { id: 'rep3', userName: 'Guest User', userEmail: 'guest@web.com', reason: 'Incorrect Listing', description: 'The specs for the Tesla Model S seem to be for the older version.', date: 'Mar 25, 2026', status: 'RESOLVED' }
        ]);

        if (!localStorage.getItem(REPORTS_KEY) || (JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]').length === 0)) saveToStorage(REPORTS_KEY, reports);

        reportsTableBody.innerHTML = '';
        reports.forEach(report => {
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

            row.querySelector('.view-report')?.addEventListener('click', () => {
                const modal = document.getElementById('reportViewModal');
                const overlay = document.getElementById('reportViewOverlay');
                if (modal && overlay) {
                    (document.getElementById('viewReportUser') as HTMLElement).textContent = report.userName;
                    (document.getElementById('viewReportEmail') as HTMLElement).textContent = report.userEmail;
                    (document.getElementById('viewReportReason') as HTMLElement).textContent = report.reason;
                    (document.getElementById('viewReportDate') as HTMLElement).textContent = report.date;
                    (document.getElementById('viewReportStatus') as HTMLElement).textContent = report.status;
                    (document.getElementById('viewReportDesc') as HTMLElement).textContent = report.description || 'No description provided.';
                    
                    const statusBadge = document.getElementById('viewReportStatus');
                    if (statusBadge) {
                        statusBadge.className = 'badge ' + (report.status === 'PENDING' ? 'in-progress' : 'closed');
                    }

                    modal.classList.add('active');
                    overlay.classList.add('active');
                }
            });

            row.querySelector('.resolve-report')?.addEventListener('click', () => {
                if (report.status === 'PENDING') {
                    if (confirm(`Mark report from ${report.userName} as RESOLVED?`)) {
                        saveToStorage(REPORTS_KEY, reports);
                        renderReports();
                        renderDashboardRecent();
                    }
                } else {
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
        const s = loadFromStorage<AppSettings>(SETTINGS_KEY, settings);
        
        (document.getElementById('settingBusinessName') as HTMLInputElement).value = s.businessName;
        (document.getElementById('settingContactEmail') as HTMLInputElement).value = s.contactEmail;
        (document.getElementById('settingPhone') as HTMLInputElement).value = s.phone;
        (document.getElementById('settingAddress') as HTMLTextAreaElement).value = s.address;
        (document.getElementById('settingAdminPassword') as HTMLInputElement).value = s.adminPassword || '';
        (document.getElementById('settingTimeout') as HTMLInputElement).value = s.sessionTimeout.toString();
        (document.getElementById('settingNotifEmail') as HTMLInputElement).checked = s.emailNotif;
        (document.getElementById('settingNotifStock') as HTMLInputElement).checked = s.stockNotif;
        (document.getElementById('settingTheme') as HTMLSelectElement).value = s.theme;
        (document.getElementById('settingCurrency') as HTMLInputElement).value = s.currency;
    }

    // Toggle Admin Password Visibility
    document.getElementById('toggleAdminPass')?.addEventListener('click', (e) => {
        const input = document.getElementById('settingAdminPassword') as HTMLInputElement;
        const icon = (e.currentTarget as HTMLElement).querySelector('i');
        if (input && icon) {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !isPass);
            icon.classList.toggle('fa-eye-slash', isPass);
        }
    });

    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn?.addEventListener('click', () => {
        const updated: AppSettings = {
            businessName: (document.getElementById('settingBusinessName') as HTMLInputElement).value,
            contactEmail: (document.getElementById('settingContactEmail') as HTMLInputElement).value,
            phone: (document.getElementById('settingPhone') as HTMLInputElement).value,
            address: (document.getElementById('settingAddress') as HTMLTextAreaElement).value,
            adminPassword: (document.getElementById('settingAdminPassword') as HTMLInputElement).value,
            sessionTimeout: parseInt((document.getElementById('settingTimeout') as HTMLInputElement).value),
            emailNotif: (document.getElementById('settingNotifEmail') as HTMLInputElement).checked,
            stockNotif: (document.getElementById('settingNotifStock') as HTMLInputElement).checked,
            theme: (document.getElementById('settingTheme') as HTMLSelectElement).value as any,
            currency: (document.getElementById('settingCurrency') as HTMLInputElement).value
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

    // Data Export/Import
    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
        const fullData = {
            inventory: loadFromStorage(INVENTORY_KEY, []),
            settings: loadFromStorage(SETTINGS_KEY, {}),
            staff: loadFromStorage(STAFF_KEY, [])
        };
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `racs_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        alert('Data exported as JSON file. You can import this file on another computer.');
    });

    document.getElementById('importDataBtn')?.addEventListener('click', () => {
        const input = prompt('Paste your exported JSON data here:');
        if (!input) return;
        try {
            const data = JSON.parse(input);
            if (data.inventory) saveToStorage(INVENTORY_KEY, data.inventory);
            if (data.settings) saveToStorage(SETTINGS_KEY, data.settings);
            if (data.staff) saveToStorage(STAFF_KEY, data.staff);
            alert('Data imported successfully! The page will now reload.');
            window.location.reload();
        } catch (e) {
            alert('Invalid JSON data. Please make sure you copied the correct text.');
        }
    });

    // ── Staff Logic ───────────────────────────────────────────────────────────
    let editingStaffId: string | null = null;

    function renderStaff() {
        const staffTableBody = document.getElementById('staffTableBody');
        if (!staffTableBody) return;

        const staff = loadFromStorage<StaffMember[]>(STAFF_KEY, []);
        staffTableBody.innerHTML = '';
        
        staff.forEach((u) => {
            const initials = (u.firstName.charAt(0) + (u.lastName?.charAt(0) || '')).toUpperCase();
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

            row.querySelector('.delete-staff')?.addEventListener('click', () => {
                if (confirm('Are you sure you want to remove this staff member?')) {
                    const updated = loadFromStorage<StaffMember[]>(STAFF_KEY, []).filter(s => s.id !== u.id);
                    saveToStorage(STAFF_KEY, updated);
                    renderStaff();
                }
            });

            staffTableBody.appendChild(row);
        });
    }

    // ── Inventory Logic ───────────────────────────────────────────────────────
    function renderInventory() {
        const inventoryBody = document.getElementById('inventoryTableBody') as HTMLElement | null;
        if (!inventoryBody) return;

        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        inventoryBody.innerHTML = '';
        
        inventory.forEach((car) => {
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

            row.querySelector('.edit-deal-btn')?.addEventListener('click', () => openEditCarModal(car.id));

            row.querySelector('.delete-deal-btn')?.addEventListener('click', () => {
                if (confirm('Delete this vehicle?')) {
                    const updated = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []).filter(c => c.id !== car.id);
                    saveToStorage(INVENTORY_KEY, updated);
                    renderInventory();
                    renderDashboardRecent();
                }
            });

            inventoryBody.appendChild(row);
        });
        
        const statsText = document.querySelector('.stats-text');
        if (statsText) statsText.textContent = `Total: ${inventory.length} deals`;
    }

    // ── Initial Render ────────────────────────────────────────────────────────
    renderDashboardRecent();
    renderReports();
    initSettings();
    renderStaff();
    renderInventory();

    // Chart Type Selector
    document.getElementById('chartTypeSelect')?.addEventListener('change', renderDashboardChart);

    // ── Navigation Logic ──────────────────────────────────────────────────────
    const userModal = document.getElementById('userModal') as HTMLElement | null;
    const userOverlay = document.getElementById('userModalOverlay') as HTMLElement | null;
    const currentViewTitle = document.getElementById('currentViewTitle') as HTMLElement | null;

    function switchView(viewId: AdminView) {
        document.querySelectorAll('.dashboard-content').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(viewId + 'View') as HTMLElement | null;
        if (targetView) targetView.classList.add('active');

        document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
        const menuId = 'menu' + viewId.charAt(0).toUpperCase() + viewId.slice(1);
        document.getElementById(menuId)?.classList.add('active');

        if (currentViewTitle) {
            currentViewTitle.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
        }
    }

    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = item.id.replace('menu', '').toLowerCase() as AdminView;
            switchView(id);
        });
    });

    // ── Report View Modal Logic ───────────────────────────────────────────
    const reportViewModal = document.getElementById('reportViewModal');
    const reportViewOverlay = document.getElementById('reportViewOverlay');
    const closeReportView = document.getElementById('closeReportView');

    const hideReportModal = () => {
        reportViewModal?.classList.remove('active');
        reportViewOverlay?.classList.remove('active');
    };

    closeReportView?.addEventListener('click', hideReportModal);
    reportViewOverlay?.addEventListener('click', hideReportModal);

    // ── Add Deal Modal Logic ──────────────────────────────────────────────────
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    const modal         = document.getElementById('addModal');
    const overlay       = document.getElementById('addModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCarBtnTop  = document.getElementById('addCarBtnTop');
    const confirmAddVehicle = document.getElementById('confirmAddVehicle');
    const carImageInput = document.getElementById('carImageInput') as HTMLInputElement;
    const addImgBtn     = document.querySelector('.add-img-btn') as HTMLElement;
    const dealPreviewContainer = document.getElementById('dealImagesPreview');

    let uploadedDealImagesData: string[] = [];
    let editingDealId: string | null = null;

    const openDealModal  = () => { modal?.classList.add('active'); overlay?.classList.add('active'); };
    const closeModal = () => { modal?.classList.remove('active'); overlay?.classList.remove('active'); };

    const resetDealForm = () => {
        const fields = ['carName', 'carPrice', 'carModelYear', 'carMileage', 'carBrand', 'carTransmission', 'carFuelType', 'carEngine', 'carHP', 'carTorque', 'carSafety', 'carSeating', 'carDescription'];
        fields.forEach(id => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
            if (el) el.value = '';
        });
        (document.getElementById('carStatus') as HTMLSelectElement).value = 'open';
        if (addImgBtn) {
            addImgBtn.style.backgroundImage = 'none';
            addImgBtn.textContent = 'ADD';
        }
        uploadedDealImagesData = [];
        if (dealPreviewContainer) dealPreviewContainer.innerHTML = '';
        editingDealId = null;
        const title = modal?.querySelector('h3');
        if (title) title.textContent = 'Add Deal';
        if (confirmAddVehicle) confirmAddVehicle.textContent = 'Add Deal';
        (document.getElementById('carCategory') as HTMLSelectElement).value = '';
    };

    addVehicleBtn?.addEventListener('click', () => { resetDealForm(); openDealModal(); });
    addCarBtnTop?.addEventListener('click', () => { resetDealForm(); openDealModal(); });
    closeModalBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    addImgBtn?.addEventListener('click', () => carImageInput?.click());
    carImageInput?.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target?.result as string;
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
                    thumb.querySelector('.remove-thumb')?.addEventListener('click', () => {
                        uploadedDealImagesData = uploadedDealImagesData.filter(d => d !== dataUrl);
                        thumb.remove();
                    });
                    dealPreviewContainer?.appendChild(thumb);
                };
                reader.readAsDataURL(file);
            });
        }
    });

    confirmAddVehicle?.addEventListener('click', () => {
        const name = (document.getElementById('carName') as HTMLInputElement).value;
        const price = (document.getElementById('carPrice') as HTMLInputElement).value;
        if (!name || !price) return alert('Name and Price are required');

        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        const carData: Vehicle = {
            id: editingDealId || 'car_' + Date.now(),
            name, 
            price: price.startsWith('₱') ? price : '₱' + price,
            promoPrice: '',
            modelYear: (document.getElementById('carModelYear') as HTMLInputElement).value,
            mileage: (document.getElementById('carMileage') as HTMLInputElement).value,
            brand: (document.getElementById('carBrand') as HTMLInputElement).value,
            transmission: (document.getElementById('carTransmission') as HTMLInputElement).value,
            fuelType: (document.getElementById('carFuelType') as HTMLInputElement).value,
            engine: (document.getElementById('carEngine') as HTMLInputElement).value,
            hp: (document.getElementById('carHP') as HTMLInputElement).value,
            torque: (document.getElementById('carTorque') as HTMLInputElement).value,
            safety: (document.getElementById('carSafety') as HTMLInputElement).value,
            seating: (document.getElementById('carSeating') as HTMLInputElement).value,
            description: (document.getElementById('carDescription') as HTMLTextAreaElement).value,
            status: (document.getElementById('carStatus') as HTMLSelectElement).value as any,
            type: (document.getElementById('carCategory') as HTMLSelectElement).value,
            images: uploadedDealImagesData,
            date: editingDealId ? (inventory.find(c => c.id === editingDealId)?.date || new Date().toLocaleDateString()) : new Date().toLocaleDateString(),
        };

        if (editingDealId) {
            const idx = inventory.findIndex(c => c.id === editingDealId);
            if (idx !== -1) inventory[idx] = carData;
            createNotification('Vehicle Updated', `${name} details were modified.`, 'info');
        } else {
            inventory.push(carData);
            createNotification('New Vehicle Added', `${name} has been added to inventory.`, 'success');
        }

        saveToStorage(INVENTORY_KEY, inventory);
        renderInventory();
        renderDashboardRecent();
        closeModal();
    });

    function openEditCarModal(carId: string) {
        editingDealId = carId;
        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        const car = inventory.find(c => c.id === carId);
        if (!car) return;

        openDealModal();
        const title = modal?.querySelector('h3');
        if (title) title.textContent = 'Edit Deal';
        if (confirmAddVehicle) confirmAddVehicle.textContent = 'Update Deal';

        (document.getElementById('carName') as HTMLInputElement).value = car.name || '';
        (document.getElementById('carPrice') as HTMLInputElement).value = (car.price || '').replace(/[₱,]/g, '');
        // Promo price removed from UI
        (document.getElementById('carModelYear') as HTMLInputElement).value = car.modelYear || '';
        (document.getElementById('carMileage') as HTMLInputElement).value = car.mileage || '';
        (document.getElementById('carBrand') as HTMLInputElement).value = car.brand || '';
        (document.getElementById('carTransmission') as HTMLInputElement).value = car.transmission || '';
        (document.getElementById('carFuelType') as HTMLInputElement).value = car.fuelType || '';
        (document.getElementById('carEngine') as HTMLInputElement).value = car.engine || '';
        (document.getElementById('carHP') as HTMLInputElement).value = car.hp || '';
        (document.getElementById('carTorque') as HTMLInputElement).value = car.torque || '';
        (document.getElementById('carSafety') as HTMLInputElement).value = car.safety || '';
        (document.getElementById('carSeating') as HTMLInputElement).value = car.seating || '';
        (document.getElementById('carDescription') as HTMLTextAreaElement).value = car.description || '';
        (document.getElementById('carCategory') as HTMLSelectElement).value = car.type || '';
        (document.getElementById('carStatus') as HTMLSelectElement).value = car.status || 'open';

        uploadedDealImagesData = car.images || [];
        if (dealPreviewContainer) {
            dealPreviewContainer.innerHTML = '';
            uploadedDealImagesData.forEach(img => {
                const thumb = document.createElement('div');
                thumb.className = 'deal-preview-thumb';
                thumb.innerHTML = `<img src="${img}"><button class="remove-thumb">&times;</button>`;
                thumb.querySelector('.remove-thumb')?.addEventListener('click', () => {
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

    document.getElementById('inventoryTableBody')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const row = target.closest('tr');
        const carId = row?.getAttribute('data-id');
        if (!carId) return;

        if (target.closest('.edit-deal-btn')) {
            openEditCarModal(carId);
        }
    });

    document.getElementById('dashboardInventoryBody')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const row = target.closest('tr');
        const carId = row?.getAttribute('data-id');
        if (!carId) return;

        const inventory = loadFromStorage<Vehicle[]>(INVENTORY_KEY, []);
        const car = inventory.find(c => c.id === carId);
        if (!car) return;

        if (target.closest('.edit')) {
            switchView('inventory');
            openEditCarModal(car.id);
        } else if (target.closest('.delete')) {
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

    const openUserModal = () => { userModal?.classList.add('active'); userOverlay?.classList.add('active'); };
    const closeUserModalFn = () => { userModal?.classList.remove('active'); userOverlay?.classList.remove('active'); };

    addStaffBtn?.addEventListener('click', () => {
        editingStaffId = null;
        const fields = ['userUsername', 'userFirstName', 'userLastName', 'userEmail', 'userPhone', 'userPassword'];
        fields.forEach(f => (document.getElementById(f) as HTMLInputElement).value = '');
        (document.getElementById('userRole') as HTMLSelectElement).value = '';
        openUserModal();
        const title = userModal?.querySelector('h3');
        if (title) title.textContent = 'Add User';
        if (confirmAddUserBtn) confirmAddUserBtn.textContent = 'Add User';
    });
    closeUserModal?.addEventListener('click', closeUserModalFn);
    userOverlay?.addEventListener('click', closeUserModalFn);

    document.getElementById('staffTableBody')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.edit-staff')) {
            const row = target.closest('tr') as HTMLElement | null;
            const sid = row?.getAttribute('data-id');
            const staff = loadFromStorage<StaffMember[]>(STAFF_KEY, []);
            const user = staff.find(s => s.id === sid);
            if (user) {
                editingStaffId = user.id;
                (document.getElementById('userFirstName') as HTMLInputElement).value = user.firstName || '';
                (document.getElementById('userLastName') as HTMLInputElement).value = user.lastName || '';
                (document.getElementById('userRole') as HTMLSelectElement).value = user.role || '';
                (document.getElementById('userUsername') as HTMLInputElement).value = user.username || '';
                (document.getElementById('userEmail') as HTMLInputElement).value = user.email || '';
                (document.getElementById('userPhone') as HTMLInputElement).value = user.phone || '';
                
                openUserModal();
                const title = userModal?.querySelector('h3');
                if (title) title.textContent = 'Edit User';
                if (confirmAddUserBtn) confirmAddUserBtn.textContent = 'Update User';
            }
        }
    });

    confirmAddUserBtn?.addEventListener('click', () => {
        const firstName = (document.getElementById('userFirstName') as HTMLInputElement).value;
        const role = (document.getElementById('userRole') as HTMLSelectElement).value;
        if (!firstName || !role) return alert('First Name and Role are required');

        const staff = loadFromStorage<StaffMember[]>(STAFF_KEY, []);
        const userData: StaffMember = {
            id: editingStaffId || 'staff_' + Date.now(),
            firstName,
            lastName: (document.getElementById('userLastName') as HTMLInputElement).value,
            role,
            username: (document.getElementById('userUsername') as HTMLInputElement).value,
            email: (document.getElementById('userEmail') as HTMLInputElement).value,
            phone: (document.getElementById('userPhone') as HTMLInputElement).value,
            password: (document.getElementById('userPassword') as HTMLInputElement).value
        };

        if (editingStaffId) {
            const idx = staff.findIndex(s => s.id === editingStaffId);
            if (idx !== -1) staff[idx] = userData;
            createNotification('Staff Updated', `${firstName}'s profile was updated.`, 'info');
        } else {
            staff.push(userData);
            createNotification('New Staff Added', `${firstName} has been added to the team.`, 'success');
        }

        saveToStorage(STAFF_KEY, staff);
        renderStaff();
        closeUserModalFn();
    });

    // ── Data Seeding Logic ───────────────────────────────────────────────────
    function seedDefaultInventory() {
        const stored = localStorage.getItem(INVENTORY_KEY);
        if (stored && stored !== '[]') return; // Only seed if missing or literally empty

        const defaultCars: Vehicle[] = [
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
    logoutLink?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });

    seedDefaultInventory();
    renderDashboardRecent();
    renderReports();
});
