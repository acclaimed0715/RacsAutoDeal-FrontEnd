import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const SettingsView: React.FC = () => {
    const { settings, updateSettings, currentUser, changePassword } = useInventory();
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<'General' | 'Security' | 'Notifications' | 'Categories'>('General');
    const [newCategory, setNewCategory] = useState('');

    const handleSave = () => {
        updateSettings(localSettings);
        alert('Settings saved successfully!');
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        const current = localSettings.vehicleTypes || [];
        if (!current.includes(newCategory.trim())) {
            setLocalSettings({ ...localSettings, vehicleTypes: [...current, newCategory.trim()] });
        }
        setNewCategory('');
    };

    const handleRemoveCategory = (cat: string) => {
        const current = localSettings.vehicleTypes || [];
        setLocalSettings({ ...localSettings, vehicleTypes: current.filter(c => c !== cat) });
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
                    {['General', 'Categories', 'Security', 'Notifications'].map(tab => (
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

                    {activeTab === 'Categories' && (
                        <div className="settings-grid">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Manage Vehicle Types</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Add new category (e.g. Truck)" 
                                        value={newCategory} 
                                        onChange={e => setNewCategory(e.target.value)} 
                                        style={{ flex: 1 }}
                                    />
                                    <button className="user-add-btn" onClick={handleAddCategory} style={{ padding: '0 1.5rem', margin: 0 }}>Add</button>
                                </div>
                                <div className="categories-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {(localSettings.vehicleTypes || []).map(cat => (
                                        <div key={cat} style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '50px', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span>{cat}</span>
                                            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => handleRemoveCategory(cat)}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Admin Password</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="password" value={localSettings.adminPassword} onChange={e => setLocalSettings({...localSettings, adminPassword: e.target.value})} />
                                        <button type="button" className="icon-btn-outline"><i className="fa-solid fa-eye"></i></button>
                                    </div>
                                </div>
                                <div className="form-group">
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

                            {/* My Account moved here */}
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
