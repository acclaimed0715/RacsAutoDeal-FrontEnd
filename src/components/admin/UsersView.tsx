import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type StaffMember } from '../../types';

const UsersView: React.FC = () => {
    const { staff, addStaff, deleteStaff, currentUser } = useInventory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<Partial<StaffMember>>({ role: 'INVENTORY_MANAGER' });

    const openAdd = () => {
        setForm({ role: 'INVENTORY_MANAGER', username: '', name: '' });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, role: string) => {
        if (role === 'SUPER_ADMIN') return alert('Cannot delete Super Admin');
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteStaff(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Use a temporary password format like Username123!
        const tempPassword = `${form.username}123!`;
        
        const newUser = {
            ...form,
            password: tempPassword
        } as Partial<StaffMember>;
        
        await addStaff(newUser);
        alert(`User created! Temporary password is: ${tempPassword}`);
        setIsModalOpen(false);
    };

    return (
        <div className="users-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Manage Staff Users</h1>
                    <p className="stats-text">Total: {staff.length} members</p>
                </div>
                <div className="header-right">
                    {currentUser?.role === 'SUPER_ADMIN' && (
                        <button className="add-user-btn" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add User</button>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar">{user.name?.[0]}</div>
                                        <div className="user-info-text">
                                            <span className="username">{user.username}</span>
                                            <span className="fullname">{user.name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role.replace('_', ' ')}</span></td>
                                <td>
                                    <div className="contact-info">
                                        <div className="contact-item">N/A</div>
                                    </div>
                                </td>
                                <td><span className="status-dot active"></span> Active</td>
                                <td>
                                    {currentUser?.role === 'SUPER_ADMIN' && (
                                        <div className="action-row">
                                            <button className="icon-btn" onClick={() => handleDelete(user.id, user.role)} disabled={user.role === 'SUPER_ADMIN'}><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <>
                    <div className="admin-modal-overlay active" onClick={() => setIsModalOpen(false)}></div>
                    <div className="user-modal active">
                        <div className="user-modal-header">
                            <h3>Add New Staff User</h3>
                            <span className="close-user-modal" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-circle-xmark"></i></span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="user-modal-body">
                                <div className="user-form-group full-width">
                                    <input type="text" placeholder="Full Name" className="user-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                </div>
                                <div className="user-form-group full-width">
                                    <input type="text" placeholder="Username" className="user-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                                </div>
                            </div>
                            <div className="user-modal-footer">
                                <div className="status-selector">
                                    <label>Role</label>
                                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} className="status-select">
                                        <option value="INVENTORY_MANAGER">Inventory Manager</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="user-add-btn">Add User</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default UsersView;
