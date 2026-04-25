import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type StaffMember } from '../../types';
import ConfirmModal from './ConfirmModal';

interface UserForm {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: 'SUPER_ADMIN' | 'INVENTORY_MANAGER';
}

const defaultForm: UserForm = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: 'INVENTORY_MANAGER',
};

const splitName = (name: string) => {
    const parts = name.trim().split(' ');
    return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
};

// Generates an 8-char alphanumeric temp password: up to 4 letters from username + 4 digits
const genTempPassword = (username: string): string => {
    const letters = username.replace(/[^a-zA-Z]/g, '').slice(0, 4).padEnd(4, 'a').toLowerCase();
    return `${letters}1234`;
};


const UsersView: React.FC = () => {
    const { staff, addStaff, updateStaff, deleteStaff, currentUser } = useInventory();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState<UserForm>(defaultForm);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UserForm>(defaultForm);
    const [openActionDropdownId, setOpenActionDropdownId] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasSuperAdmin = staff.some(s => s.role === 'SUPER_ADMIN');

    const openAdd = () => {
        setAddForm(defaultForm);
        setIsAddOpen(true);
    };

    const openEdit = (user: StaffMember) => {
        const { firstName, lastName } = splitName(user.name);
        setEditId(user.id);
        setEditForm({
            firstName,
            lastName,
            email: user.email || '',
            username: user.username,
            role: user.role,
        });
        setIsEditOpen(true);
    };

    const handleDelete = (id: string, role: string) => {
        if (role === 'SUPER_ADMIN') return alert('Cannot delete the Super Admin account.');
        setConfirmModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this staff user? This action cannot be undone.',
            isDestructive: true,
            onConfirm: () => {
                deleteStaff(id);
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (addForm.role === 'SUPER_ADMIN' && hasSuperAdmin) {
            alert('Only one Super Admin account is allowed.');
            return;
        }

        const fullName = `${addForm.firstName} ${addForm.lastName}`.trim();
        const tempPassword = genTempPassword(addForm.username);

        const result = await addStaff({
            name: fullName,
            username: addForm.username,
            email: addForm.email.trim(),
            role: addForm.role,
            password: tempPassword,
        });
        if (!result.success) {
            alert(result.error ?? 'Could not create user.');
            return;
        }
        if (result.welcomeEmailError) {
            alert(
                `User was created, but the welcome email could not be sent.\n\n${result.welcomeEmailError}\n\nCheck server logs and Gmail (App Password, MAIL_USER / MAIL_PASS in backend .env).`
            );
        } else if (addForm.email.trim() && result.welcomeEmailSent) {
            alert(`Welcome email sent to ${addForm.email.trim()}.`);
        }
        setIsAddOpen(false);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editId) return;


        const superAdminAlreadyExists = staff.some(s => s.role === 'SUPER_ADMIN' && s.id !== editId);

        if (editForm.role === 'SUPER_ADMIN' && superAdminAlreadyExists) {
            alert('Only one Super Admin account is allowed.');
            return;
        }

        const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();

        await updateStaff(editId, {
            name: fullName,
            username: editForm.username,
            email: editForm.email,
            role: editForm.role,
        });
        setIsEditOpen(false);
        setEditId(null);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenActionDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const RoleRadios = ({
        value,
        onChange,
        excludeId,
    }: {
        value: 'SUPER_ADMIN' | 'INVENTORY_MANAGER';
        onChange: (r: 'SUPER_ADMIN' | 'INVENTORY_MANAGER') => void;
        excludeId?: string;
    }) => {
        const superAdminTaken = staff.some(
            s => s.role === 'SUPER_ADMIN' && s.id !== excludeId
        );
        return (
            <div className="role-radio-group">
                <label className={`role-radio-option${value === 'INVENTORY_MANAGER' ? ' selected' : ''}`}>
                    <input
                        type="radio"
                        name="role"
                        value="INVENTORY_MANAGER"
                        checked={value === 'INVENTORY_MANAGER'}
                        onChange={() => onChange('INVENTORY_MANAGER')}
                    />
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <span>Inventory Manager</span>
                </label>
                <label className={`role-radio-option${value === 'SUPER_ADMIN' ? ' selected' : ''}${superAdminTaken ? ' disabled' : ''}`}>
                    <input
                        type="radio"
                        name="role"
                        value="SUPER_ADMIN"
                        checked={value === 'SUPER_ADMIN'}
                        onChange={() => !superAdminTaken && onChange('SUPER_ADMIN')}
                        disabled={superAdminTaken}
                    />
                    <i className="fa-solid fa-crown"></i>
                    <span>Super Admin</span>
                    {superAdminTaken && <span className="role-taken-badge">Taken</span>}
                </label>
            </div>
        );
    };

    return (
        <div className="users-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Manage Staff Users</h1>
                    <p className="stats-text">Total: {staff.length} {staff.length === 1 ? 'member' : 'members'}</p>
                </div>
                <div className="header-right">
                    {currentUser?.role === 'SUPER_ADMIN' && (
                        <button className="add-user-btn" onClick={openAdd}>
                            <i className="fa-solid fa-plus"></i> Add User
                        </button>
                    )}
                </div>
            </div>

            <div className="table-container">
                <table className="users-table premium-table">
                    <thead>
                        <tr>
                            <th>User Profile</th>
                            <th>Role</th>
                            <th>Contact Info</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                                        <div className="user-info-text">
                                            <span className="username">{user.name}</span>
                                            <span className="fullname">@{user.username}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <div className="contact-info">
                                        <div className="contact-item">{user.email || 'N/A'}</div>
                                    </div>
                                </td>
                                <td><span className="status-dot active"></span> Active</td>
                                <td style={{ textAlign: 'center' }}>
                                    {currentUser?.role === 'SUPER_ADMIN' && (
                                        <div className="inquiry-actions-container" ref={openActionDropdownId === user.id ? dropdownRef : null}>
                                            <button
                                                className={`action-trigger-btn ${openActionDropdownId === user.id ? 'active' : ''}`}
                                                onClick={() => setOpenActionDropdownId(openActionDropdownId === user.id ? null : user.id)}
                                                title="Actions"
                                            >
                                                <i className="fa-solid fa-bars"></i>
                                            </button>
                                            
                                            <div className={`inquiry-actions-dropdown ${openActionDropdownId === user.id ? 'open' : ''}`}>
                                                <button
                                                    onClick={() => {
                                                        openEdit(user);
                                                        setOpenActionDropdownId(null);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                    Edit User
                                                </button>
                                                
                                                {user.role !== 'SUPER_ADMIN' && (
                                                    <button
                                                        className="archive-item"
                                                        onClick={() => {
                                                            handleDelete(user.id, user.role);
                                                            setOpenActionDropdownId(null);
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                        Delete User
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Add User Modal ── */}
            {isAddOpen && (
                <>
                    <div className="admin-modal-overlay active"></div>
                    <div className="user-modal active">
                        <div className="user-modal-header">
                            <h3>Add New Staff User</h3>
                            <span className="close-user-modal" onClick={() => setIsAddOpen(false)}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="user-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
                                <div className="user-form-group">
                                    <input type="text" placeholder="First Name" className="user-input"
                                        value={addForm.firstName} onChange={e => setAddForm({ ...addForm, firstName: e.target.value })} required />
                                </div>
                                <div className="user-form-group">
                                    <input type="text" placeholder="Last Name" className="user-input"
                                        value={addForm.lastName} onChange={e => setAddForm({ ...addForm, lastName: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <input type="email" placeholder="Email Address" className="user-input"
                                        value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <input type="text" placeholder="Username" className="user-input"
                                        value={addForm.username} onChange={e => setAddForm({ ...addForm, username: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <div className="temp-password-field">
                                        <i className="fa-solid fa-key temp-password-icon"></i>
                                        <input type="text" className="user-input temp-password-input"
                                            value={addForm.username ? genTempPassword(addForm.username) : ''}
                                            placeholder="Temporary password (auto-generated)" readOnly />
                                    </div>
                                    <p className="temp-password-hint">
                                        <i className="fa-solid fa-circle-info"></i> This is the temporary password. Share it with the new user.
                                    </p>
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <label className="field-label">Role</label>
                                    <RoleRadios value={addForm.role} onChange={r => setAddForm({ ...addForm, role: r })} />
                                </div>
                            </div>
                            <div className="user-modal-footer">
                                <button type="button" className="user-cancel-btn" onClick={() => setIsAddOpen(false)}>Cancel</button>
                                <button type="submit" className="user-add-btn">Add User</button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* ── Edit User Modal ── */}
            {isEditOpen && (
                <>
                    <div className="admin-modal-overlay active"></div>
                    <div className="user-modal active">
                        <div className="user-modal-header">
                            <h3>Edit Staff User</h3>
                            <span className="close-user-modal" onClick={() => setIsEditOpen(false)}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <form onSubmit={handleEdit}>
                            <div className="user-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
                                <div className="user-form-group">
                                    <input type="text" placeholder="First Name" className="user-input"
                                        value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} required />
                                </div>
                                <div className="user-form-group">
                                    <input type="text" placeholder="Last Name" className="user-input"
                                        value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <input type="email" placeholder="Email Address" className="user-input"
                                        value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <input type="text" placeholder="Username" className="user-input"
                                        value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} required />
                                </div>
                                <div className="user-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                                    <label className="field-label">Role</label>
                                    {editForm.role === 'SUPER_ADMIN' ? (
                                        <div className="role-locked-notice">
                                            <i className="fa-solid fa-shield-halved"></i>
                                            <span>Super Admin role cannot be changed.</span>
                                        </div>
                                    ) : (
                                        <RoleRadios
                                            value={editForm.role}
                                            onChange={r => setEditForm({ ...editForm, role: r })}
                                            excludeId={editId ?? undefined}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="user-modal-footer">
                                <button type="button" className="user-cancel-btn" onClick={() => setIsEditOpen(false)}>Cancel</button>
                                <button type="submit" className="user-add-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isDestructive={confirmModal.isDestructive}
            />
        </div>
    );
};

export default UsersView;
