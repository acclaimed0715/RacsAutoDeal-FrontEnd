import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginStaff } = useInventory();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const success = await loginStaff(username, password);
        if (success) {
            window.location.href = '/admin'; // Force full refresh to capture secure data fetches
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-page">
            <div className="login-layout" style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-card" style={{ background: 'var(--card-bg)', padding: '2.5rem', borderRadius: '24px', width: '420px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img src="/assets/logo.png" alt="Logo" style={{ width: '160px', marginBottom: '2rem' }} />
                <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please enter your admin credentials</p>
                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Username</label>
                        <input 
                            type="text" 
                            placeholder="e.g. admin" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '800', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)' }}>
                        Sign In
                    </button>
                    <button type="button" onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem' }}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> Back to Site
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Login;
