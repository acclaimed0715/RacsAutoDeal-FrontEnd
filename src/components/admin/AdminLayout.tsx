import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import ConfirmModal from './ConfirmModal';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { notifications, currentUser, logoutStaff, markAllNotificationsRead } = useInventory();
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        isDestructive?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });
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

    const handleNotifOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        setNotifOpen(prev => {
            if (!prev && unreadCount > 0) {
                void markAllNotificationsRead();
            }
            return !prev;
        });
    };

    const getViewTitle = () => {
        const path = location.pathname;
        if (path.includes('inventory')) return 'Car Inventory';
        if (path.includes('inquiries')) return 'Customer Inquiries';
        if (path.includes('users')) return 'Manage Staff Users';
        if (path.includes('reports')) return 'User Reports';
        if (path.includes('settings')) return 'System Settings';
        if (path.includes('account')) return 'My Account';
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
                            <NavLink to="/admin/inquiries" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa-solid fa-envelope"></i> Manage Inquiries
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
                                <i className="fa-solid fa-car"></i> Manage Inventory
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
                        {currentUser?.role !== 'SUPER_ADMIN' && (
                            <li>
                                <NavLink to="/admin/account" className={({ isActive }) => isActive ? 'active' : ''}>
                                    <i className="fa-solid fa-key"></i> My Account
                                </NavLink>
                            </li>
                        )}
                        <li className="logout-link" onClick={() => {
                            setConfirmModal({
                                isOpen: true,
                                title: 'Confirm Logout',
                                message: 'Are you sure you want to log out? You will need to sign in again to access the dashboard.',
                                confirmText: 'Logout',
                                isDestructive: true,
                                onConfirm: () => {
                                    logoutStaff();
                                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                }
                            });
                        }}>
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
                                <div
                                    className="notifications"
                                    onClick={handleNotifOpen}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleNotifOpen(e);
                                        }
                                    }}
                                    aria-expanded={notifOpen}
                                    aria-label="Notifications"
                                >
                                    <i className="fa-regular fa-bell" aria-hidden />
                                    {unreadCount > 0 && <span className="notif-badge active">{unreadCount}</span>}
                                </div>
                                {notifOpen && (
                                    <div className="notif-dropdown">
                                        <div className="notif-dropdown-header">
                                            <span>Notifications</span>
                                        </div>
                                        <div className="notif-list-scroll">
                                            {notifications.length === 0 ? (
                                                <div className="notif-empty">No notifications</div>
                                            ) : (
                                                notifications.slice(0, 20).map(n => (
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
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isDestructive={confirmModal.isDestructive}
            />
        </div>
    );
};

export default AdminLayout;
