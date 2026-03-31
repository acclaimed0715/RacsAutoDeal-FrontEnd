import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginStaff } = useInventory();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('layout-no-nav-offset');
        return () => document.body.classList.remove('layout-no-nav-offset');
    }, []);

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

    const fieldStyle: React.CSSProperties = {
        width: '100%',
        padding: '13px 16px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.05)',
        color: 'white',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div className="login-page">
            <div style={{ background: 'var(--surface)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'var(--card-bg)', padding: '2.5rem 2.5rem 2rem', borderRadius: '24px', width: '420px', maxWidth: '92vw', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)', boxSizing: 'border-box' }}>
                    <img src="/assets/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '1.75rem' }} />
                    <h2 style={{ color: 'white', marginBottom: '0.4rem', fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to your admin account</p>
                    <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={fieldStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={fieldStyle}
                                required
                            />
                        </div>
                        {error && (
                            <p style={{ color: 'var(--primary)', fontSize: '0.85rem', textAlign: 'center', margin: 0, background: 'rgba(225,29,72,0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(225,29,72,0.2)' }}>
                                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i>{error}
                            </p>
                        )}
                        <button
                            type="submit"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(225,29,72,0.35)', marginTop: '0.25rem' }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{ width: '100%', padding: '11px', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', borderRadius: '10px' }}
                        >
                            <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i>Back to Site
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
