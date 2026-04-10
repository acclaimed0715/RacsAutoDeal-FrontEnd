import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CompareHighlight: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="compare-highlight" style={{
            padding: '8rem 2rem',
            background: 'linear-gradient(160deg, #0a0a0a 0%, #151515 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            {/* Decorative Orbs */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(192, 57, 43, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span style={{
                        color: 'var(--primary)',
                        fontSize: '0.9rem',
                        fontWeight: '800',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1rem'
                    }}>Smart Comparison</span>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        color: '#fff',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        letterSpacing: '-1.5px'
                    }}>
                        Make Informed Decisions with <span style={{ color: 'var(--primary)' }}>Side-by-Side</span> Comparisons
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.15rem',
                        lineHeight: '1.8',
                        marginBottom: '2.5rem',
                        maxWidth: '600px'
                    }}>
                        Stop guessing and start comparing. Our premium comparison tool lets you analyze technical specs, pricing, and features for up to 4 vehicles simultaneously. Find the perfect match for your lifestyle with clinical precision.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '700' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i>
                                Engine performance
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '700' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i>
                                Fuel Efficiency
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '700' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i>
                                Tech Features
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '700' }}>
                                <i className="fa-solid fa-check" style={{ color: 'var(--primary)' }}></i>
                                Market Pricing
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/cars')}
                        className="hero-primary-btn"
                        style={{ border: 'none', cursor: 'pointer', display: 'inline-flex' }}
                    >
                        Try It Now <i className="fa-solid fa-right-left"></i>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{ position: 'relative' }}
                >
                    {/* Visual representation of comparison */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '24px',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative'
                    }}>
                        {/* Mock Comparison Cards */}
                        <div style={{ display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>
                            {[1, 2].map((i) => (
                                <div key={i} style={{
                                    flex: '1',
                                    background: '#1a1a1a',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100px', 
                                        background: i === 1 ? 'linear-gradient(135deg, #333, #111)' : 'linear-gradient(135deg, #444, #222)',
                                        borderRadius: '12px',
                                        marginBottom: '1rem'
                                    }} />
                                    <div style={{ height: '8px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }} />
                                    <div style={{ height: '8px', width: '40%', background: 'var(--primary)', opacity: 0.5, borderRadius: '4px' }} />
                                </div>
                            ))}
                        </div>
                        
                        {/* Comparison Overlay Indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60px',
                            height: '60px',
                            background: 'var(--primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '1.5rem',
                            boxShadow: '0 0 30px var(--primary-glow)',
                            zIndex: 10,
                            animation: 'pulseGlow 2s infinite'
                        }}>
                            <i className="fa-solid fa-right-left"></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes pulseGlow {
                    0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px var(--primary-glow); }
                    50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 40px var(--primary-glow); }
                    100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px var(--primary-glow); }
                }
            `}</style>
        </section>
    );
};

export default CompareHighlight;
