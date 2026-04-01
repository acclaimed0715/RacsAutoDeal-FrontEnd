import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import ChangePasswordForm from './ChangePasswordForm';

const AccountView: React.FC = () => {
    const { currentUser } = useInventory();

    return (
        <div className="account-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>My Account</h1>
                    <p className="stats-text">Manage your account settings</p>
                </div>
            </div>

            <div className="account-grid">
                <div className="account-card">
                    <h3><i className="fa-solid fa-user"></i> Profile</h3>
                    <div className="account-info-row">
                        <span className="account-info-label">Full Name</span>
                        <span className="account-info-value">{currentUser?.name || '—'}</span>
                    </div>
                    <div className="account-info-row">
                        <span className="account-info-label">Username</span>
                        <span className="account-info-value">@{currentUser?.username || '—'}</span>
                    </div>
                    <div className="account-info-row">
                        <span className="account-info-label">Email</span>
                        <span className="account-info-value">{currentUser?.email || 'N/A'}</span>
                    </div>
                    <div className="account-info-row">
                        <span className="account-info-label">Role</span>
                        <span className={`role-badge ${currentUser?.role?.toLowerCase()}`}>
                            {currentUser?.role?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default AccountView;
