import React, { useState } from 'react';
import { type StaffMember } from '../../types';

const INITIAL_USERS: StaffMember[] = [
    { id: 'u1', username: 'SuperAdmin01', firstName: 'Super', lastName: 'Admin', email: 'admin@racsautodeal.com', phone: '09123456789', role: 'Super Admin' },
    { id: 'u2', username: 'Janina122', firstName: 'Janina', lastName: 'Santos', email: 'janina@racsautodeal.com', phone: '09987654321', role: 'Admin' }
];

const UsersView: React.FC = () => {
    const [users, setUsers] = useState<StaffMember[]>(INITIAL_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<Partial<StaffMember>>({ role: 'Admin' });

    const openAdd = () => {
        setForm({ role: 'Admin', username: '', firstName: '', lastName: '', email: '', phone: '' });
        setIsModalOpen(true);
    };

    const deleteUser = (id: string) => {
        if (id === 'u1') return alert('Cannot delete Super Admin');
        setUsers(users.filter(u => u.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            ...form,
            id: 'u_' + Date.now()
        } as StaffMember;
        setUsers([...users, newUser]);
        setIsModalOpen(false);
    };

    return (
        <div className="users-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Manage Staff Users</h1>
                    <p className="stats-text">Total: {users.length} members</p>
                </div>
                <div className="header-right">
                    <button className="add-user-btn" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add User</button>
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
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar">{user.firstName[0]}</div>
                                        <div className="user-info-text">
                                            <span className="username">{user.username}</span>
                                            <span className="fullname">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>{user.role}</span></td>
                                <td>
                                    <div className="contact-info">
                                        <div className="contact-item"><i className="fa-solid fa-envelope"></i> {user.email}</div>
                                        <div className="contact-item"><i className="fa-solid fa-phone"></i> {user.phone}</div>
                                    </div>
                                </td>
                                <td><span className="status-dot active"></span> Active</td>
                                <td>
                                    <div className="action-row">
                                        <button className="icon-btn" onClick={() => deleteUser(user.id)} disabled={user.id === 'u1'}><i className="fa-solid fa-trash"></i></button>
                                        <i className="fa-solid fa-ellipsis-vertical more-options"></i>
                                    </div>
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
                                <div className="form-group-row">
                                    <div className="user-form-group">
                                        <input type="text" placeholder="First Name" className="user-input" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                                    </div>
                                    <div className="user-form-group">
                                        <input type="text" placeholder="Last Name" className="user-input" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="user-form-group full-width">
                                    <input type="text" placeholder="Username" className="user-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                                </div>
                                <div className="user-form-group full-width">
                                    <input type="email" placeholder="Email Address" className="user-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                                </div>
                                <div className="user-form-group full-width">
                                    <input type="text" placeholder="Phone Number" className="user-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                                </div>
                            </div>
                            <div className="user-modal-footer">
                                <div className="status-selector">
                                    <label>Role</label>
                                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="status-select">
                                        <option value="Admin">Admin</option>
                                        <option value="Super Admin">Super Admin</option>
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
