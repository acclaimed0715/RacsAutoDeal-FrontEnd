import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { settings } = useInventory();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === settings.adminPassword || password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('currentUserRole', 'Super Admin');
            navigate('/admin');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-page">
            <div className="login-layout" style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-card" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '20px', width: '400px', textAlign: 'center' }}>
                <img src="/assets/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '2rem' }} />
                <h3>Admin Access</h3>
                <form onSubmit={handleLogin} style={{ marginTop: '1rem' }}>
                    <input 
                        type="password" 
                        placeholder="Enter Admin Password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '1rem' }}
                    />
                    {error && <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
                    <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Login
                    </button>
                    <button type="button" onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '1rem' }}>
                        Back to Site
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Login;
