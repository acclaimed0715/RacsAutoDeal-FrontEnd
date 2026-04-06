import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { requestPasswordReset, resetPassword } = useInventory();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    if (!isOpen) return null;

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await requestPasswordReset(email);
            if (res.success) {
                setMessage({ text: res.message, type: 'success' });
                setStep('reset');
            } else {
                setMessage({ text: res.message, type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await resetPassword(email, otp, newPassword);
            if (res.success) {
                setMessage({ text: 'Password reset successful! You can now log in.', type: 'success' });
                setTimeout(() => {
                    onClose();
                    setStep('email');
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                    setMessage(null);
                }, 2000);
            } else {
                setMessage({ text: res.message, type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="preview-overlay active" style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="preview-modal active" style={{ width: '450px', maxWidth: '90%', height: 'auto', minHeight: 'unset' }}>
                <div className="preview-modal-content" style={{ padding: '40px' }}>
                    <span className="close-preview-btn" onClick={onClose} style={{ top: '20px', right: '20px' }}>
                        <i className="fa-solid fa-xmark"></i>
                    </span>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            background: 'rgba(225, 29, 72, 0.1)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'var(--primary)',
                            fontSize: '1.5rem'
                        }}>
                            <i className={`fa-solid ${step === 'email' ? 'fa-envelope' : 'fa-lock-open'}`}></i>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>
                            {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {step === 'email' 
                                ? "No worries! Enter your email and we'll send you a reset code." 
                                : "We've sent a 6-digit code to your email. Enter it below with your new password."}
                        </p>
                    </div>

                    {message && (
                        <div style={{ 
                            padding: '12px 16px', 
                            borderRadius: '12px', 
                            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            color: message.type === 'success' ? '#4ade80' : '#f87171',
                            fontSize: '0.85rem',
                            marginBottom: '25px',
                            textAlign: 'center'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={handleRequestOTP}>
                            <div className="composer-field" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 20px', border: '1px solid var(--border)', marginBottom: '25px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Email</span>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', marginTop: '5px', outline: 'none' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="compose-send-btn" 
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', background: 'var(--primary)' }}
                            >
                                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div className="composer-field" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 20px', border: '1px solid var(--border)', marginBottom: '15px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>6-Digit OTP</span>
                                <input 
                                    type="text" 
                                    required 
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    style={{ 
                                        background: 'transparent', 
                                        border: 'none', 
                                        color: 'var(--primary)', 
                                        width: '100%', 
                                        marginTop: '5px', 
                                        outline: 'none',
                                        fontSize: '1.2rem',
                                        fontWeight: '800',
                                        letterSpacing: '5px'
                                    }}
                                />
                            </div>
                            <div className="composer-field" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 20px', border: '1px solid var(--border)', marginBottom: '25px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>New Password</span>
                                <input 
                                    type="password" 
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter secure password"
                                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', marginTop: '5px', outline: 'none' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="compose-send-btn" 
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', background: 'var(--primary)' }}
                            >
                                {isLoading ? 'Verifying...' : 'Reset Password'}
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <button type="button" onClick={() => setStep('email')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}>
                                    Back to Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
