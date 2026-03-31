import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { notifications, currentUser, logoutStaff, markAllNotificationsRead } = useInventory();
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Public site uses body padding-top for fixed navbar; admin has its own topbar — remove the gap
    useEffect(() => {
        document.body.classList.add('layout-no-nav-offset');
        return () => document.body.classList.remove('layout-no-nav-offset');
    }, []);

    const handleNotifOpen = () => {
        setNotifOpen(o => !o);
        if (!notifOpen && unreadCount > 0) markAllNotificationsRead();
    };

    const getViewTitle = () => {
        const path = location.pathname;
        if (path.includes('inventory')) return 'Car Inventory';
        if (path.includes('users')) return 'Manage Staff Users';
        if (path.includes('reports')) return 'User Reports';
        if (path.includes('settings')) return 'System Settings';
        if (path.includes('sold')) return 'Sold Cars';
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
                                {currentUser?.role === 'SUPER_ADMIN' && unreadCount > 0 && (
                                    <span className="sidebar-badge">{unreadCount}</span>
                                )}
                            </NavLink>
                        </li>
                        {currentUser?.role === 'SUPER_ADMIN' && (
                            <li>
                                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <i className="fa-solid fa-users"></i> Manage Users
                                </NavLink>
                            </li>
                        )}
                        {currentUser?.role === 'SUPER_ADMIN' && (
                            <li>
                                <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <i className="fa-solid fa-flag"></i> Manage Reports
                                </NavLink>
                            </li>
                        )}
                        {currentUser?.role === 'SUPER_ADMIN' && (
                            <li>
                                <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <i className="fa-solid fa-gear"></i> Settings
                                </NavLink>
                            </li>
                        )}
                        <li className="logout-link" onClick={logoutStaff}>
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
                            <div className="notif-wrapper" ref={notifRef}>
                                <div className="notifications" onClick={handleNotifOpen}>
                                    <i className="fa-regular fa-bell"></i>
                                    {unreadCount > 0 && <span className="notif-badge active">{unreadCount}</span>}
                                </div>
                                {notifOpen && (
                                    <div className="notif-dropdown">
                                        <div className="notif-dropdown-header">
                                            <span>Notifications</span>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="notif-empty">No notifications</div>
                                        ) : (
                                            notifications.slice(0, 8).map(n => (
                                                <div key={n.id} className={`notif-item${n.isRead ? '' : ' unread'}`}>
                                                    <div className={`notif-dot ${n.type}`}></div>
                                                    <div className="notif-content">
                                                        <p className="notif-title">{n.title}</p>
                                                        <p className="notif-msg">{n.message}</p>
                                                        <p className="notif-time">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="topbar-welcome">
                                Welcome, <span>{currentUser?.username || currentUser?.name || 'Admin'}</span>
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
