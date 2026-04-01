import React from 'react';
import { Navigate } from 'react-router-dom';
import AccountView from './AccountView';

/** Inventory managers use My Account page; Super Admins use Settings → Security. */
const StaffAccountGate: React.FC = () => {
    const raw = localStorage.getItem('racs_staff_member');
    if (raw) {
        try {
            const u = JSON.parse(raw) as { role?: string };
            if (u.role === 'SUPER_ADMIN') {
                return <Navigate to="/admin/settings?tab=security" replace />;
            }
        } catch {
            /* fall through */
        }
    }
    return <AccountView />;
};

export default StaffAccountGate;
