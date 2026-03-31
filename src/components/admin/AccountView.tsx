import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const AccountView: React.FC = () => {
    const { currentUser, changePassword } = useInventory();
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const pwRules = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{1,8}$/;
        if (!pwRules.test(form.next)) {
            if (form.next.length > 8) {
                setError('Password must be at most 8 characters.');
            } else if (!/[a-zA-Z]/.test(form.next)) {
                setError('Password must contain at least one letter.');
            } else if (!/[0-9]/.test(form.next)) {
                setError('Password must contain at least one number.');
            } else {
                setError('Password must be letters and numbers only (max 8 characters).');
            }
            return;
        }
        if (form.next !== form.confirm) {
            setError('New passwords do not match.');
            return;
        }
        if (!currentUser?.id) return;

        setLoading(true);
        const result = await changePassword(currentUser.id, form.current, form.next);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setForm({ current: '', next: '', confirm: '' });
        } else {
            setError(result.error || 'Failed to change password.');
        }
    };

    return (
        <div className="account-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>My Account</h1>
                    <p className="stats-text">Manage your account settings</p>
                </div>
            </div>

            <div className="account-grid">
                {/* Profile Info Card */}
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

                {/* Change Password Card */}
                <div className="account-card">
                    <h3><i className="fa-solid fa-lock"></i> Change Password</h3>
                    <p className="account-card-hint">
                        Max 8 characters — must contain letters and numbers.
                    </p>

                    {success ? (
                        <div className="pw-success-msg" style={{ padding: '1.5rem 0' }}>
                            <i className="fa-solid fa-circle-check"></i>
                            <p>Password changed successfully!</p>
                            <button
                                className="user-add-btn"
                                style={{ marginTop: '0.5rem' }}
                                onClick={() => setSuccess(false)}
                            >
                                Change Again
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="account-pw-form">
                            {error && (
                                <div className="pw-error-msg">
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </div>
                            )}
                            <div className="account-form-group">
                                <label className="field-label">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter current password"
                                    className="user-input"
                                    value={form.current}
                                    onChange={e => setForm({ ...form, current: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="account-form-group">
                                <label className="field-label">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="user-input"
                                    value={form.next}
                                    onChange={e => setForm({ ...form, next: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="account-form-group">
                                <label className="field-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter new password"
                                    className="user-input"
                                    value={form.confirm}
                                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="account-form-footer">
                                <button type="submit" className="user-add-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountView;
