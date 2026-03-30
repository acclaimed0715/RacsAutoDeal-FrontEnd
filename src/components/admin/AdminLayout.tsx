import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { notifications } = useInventory();
    const navigate = useNavigate();
    const location = useLocation();
    
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/login');
    };

    const getViewTitle = () => {
        const path = location.pathname;
        if (path.includes('inventory')) return 'Car Inventory';
        if (path.includes('users')) return 'Manage Staff Users';
        if (path.includes('reports')) return 'User Reports';
        if (path.includes('settings')) return 'System Settings';
        return 'Dashboard Overview';
    };

    return (
        <div className="admin-layout-wrapper">
            <div className="admin-layout" style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex' }}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/assets/logo.png" alt="Logo" className="admin-logo" />
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-chart-line"></i> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-car"></i> Manage Inventory
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-users"></i> Manage Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-flag"></i> Manage Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fa-solid fa-gear"></i> Settings
                        </NavLink>
                    </li>
                    <li className="logout-link" onClick={handleLogout}>
                        <a href="#"><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <h2>{getViewTitle()}</h2>
                    </div>
                    <div className="topbar-right">
                        <div className="notifications">
                            <i className="fa-regular fa-bell"></i>
                            {unreadCount > 0 && <span className="notif-badge active">{unreadCount}</span>}
                        </div>
                        <div className="admin-profile">
                            <div className="avatar"><i className="fa-solid fa-user"></i></div>
                            <span>Admin</span>
                        </div>
                    </div>
                </header>
                <div className="dashboard-content active">
                    {children}
                </div>
            </main>
        </div>
        </div>
    );
};

export default AdminLayout;
