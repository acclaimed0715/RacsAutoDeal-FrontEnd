import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import ChangePasswordForm from './ChangePasswordForm';

const SettingsView: React.FC = () => {
    const { settings, updateSettings, currentUser } = useInventory();
    const [searchParams] = useSearchParams();
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<'General' | 'Security' | 'Notifications'>('General');

    useEffect(() => {
        if (searchParams.get('tab') === 'security') {
            setActiveTab('Security');
        }
    }, [searchParams]);

    const handleSave = () => {
        // Vehicle categories are edited under Manage Inventory; keep server copy here.
        updateSettings({ ...localSettings, vehicleTypes: settings.vehicleTypes });
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings-view">
            <div className="page-header">
                <div>
                    <h1>System Settings</h1>
                    <p className="stats-text">Configure business and security rules.</p>
                </div>
                <button className="save-btn" onClick={handleSave}><i className="fa-solid fa-save"></i> Save Settings</button>
            </div>

            <div className="settings-container">
                <div className="settings-tabs">
                    {['General', 'Security', 'Notifications'].map(tab => (
                        <div 
                            key={tab} 
                            className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="settings-panel">
                    {activeTab === 'General' && (
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" value={localSettings.businessName} onChange={e => setLocalSettings({...localSettings, businessName: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Support Email</label>
                                <input type="email" value={localSettings.contactEmail} onChange={e => setLocalSettings({...localSettings, contactEmail: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input type="text" value={localSettings.phone} onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Business Address</label>
                                <textarea rows={4} value={localSettings.address} onChange={e => setLocalSettings({...localSettings, address: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <>
                            <p className="stats-text" style={{ marginBottom: '1.25rem', maxWidth: '42rem' }}>
                                Manage your Super Admin profile and login password. App session timeout applies to all staff.
                            </p>
                            <div className="settings-grid">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Session Timeout (seconds)</label>
                                    <input
                                        type="number"
                                        min={10}
                                        value={localSettings.sessionTimeout}
                                        onChange={e => {
                                            const v = parseInt(e.target.value, 10);
                                            setLocalSettings({
                                                ...localSettings,
                                                sessionTimeout: isNaN(v) ? 0 : v,
                                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="account-grid" style={{ marginTop: '2rem' }}>
                                <div className="account-card">
                                    <h3><i className="fa-solid fa-user"></i> My Profile</h3>
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
                        </>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="settings-grid">
                            <div className="toggle-group">
                                <div className="toggle-info">
                                    <h4>Email Notifications</h4>
                                    <p>Get alerted on new user reports via email.</p>
                                </div>
                                <input type="checkbox" checked={localSettings.emailNotif} onChange={e => setLocalSettings({...localSettings, emailNotif: e.target.checked})} />
                            </div>
                            <div className="toggle-group">
                                <div className="toggle-info">
                                    <h4>Stock Alerts</h4>
                                    <p>Low inventory counts warning in dashboard.</p>
                                </div>
                                <input type="checkbox" checked={localSettings.stockNotif} onChange={e => setLocalSettings({...localSettings, stockNotif: e.target.checked})} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
