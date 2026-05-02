import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CompareHighlight: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(1); // Default to Comparison step

    const steps = [
        { 
            id: 0,
            title: 'Explore Digital Showroom', 
            text: 'Browse our live inventory with real-time availability, high-resolution galleries, and comprehensive technical specifications.', 
            icon: 'fa-magnifying-glass',
            visualTitle: 'Smart Inventory',
            visualDesc: 'Filter through our premium collection using our high-speed digital showroom interface.',
            visualBadge: 'Interactive Showroom'
        },
        { 
            id: 1,
            title: 'Smart Side-by-Side Analysis', 
            text: 'Select and analyze up to 4 vehicles simultaneously. Evaluate performance, features, and pricing with our integrated tool.', 
            icon: 'fa-right-left',
            highlight: true,
            visualTitle: 'Compare Engine',
            visualDesc: 'Our proprietary tool allows for real-time spec comparisons of up to 4 vehicles simultaneously.',
            visualBadge: 'Key Feature'
        },
        { 
            id: 2,
            title: 'Submit Digital Inquiry', 
            text: 'Instantly transmit your inquiry through our secure platform to begin the professional acquisition process.', 
            icon: 'fa-paper-plane',
            visualTitle: 'Secure Inquiry',
            visualDesc: 'Your data is encrypted and sent directly to our experts for immediate consultation.',
            visualBadge: 'Direct Access'
        }
    ];

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
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '6rem',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Left: Detailed Process Guide */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span style={{
                        color: 'var(--primary)',
                        fontSize: '0.85rem',
                        fontWeight: '900',
                        letterSpacing: '5px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '1.2rem',
                        opacity: 0.9
                    }}>The Experience</span>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        color: '#fff',
                        lineHeight: '1.1',
                        marginBottom: '3rem',
                        letterSpacing: '-2px'
                    }}>
                        Your Journey to <br/>
                        <span style={{ color: 'var(--primary)' }}>Showroom Perfection</span>
                    </h2>

                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {/* Timeline Line */}
                        <div style={{
                            position: 'absolute',
                            left: '6px',
                            top: '10px',
                            bottom: '10px',
                            width: '2px',
                            background: 'linear-gradient(to bottom, var(--primary), rgba(230, 57, 70, 0.1), transparent)',
                            opacity: 0.3
                        }} />

                        {steps.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                onMouseEnter={() => setActiveStep(idx)}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                style={{ 
                                    marginBottom: '2rem', 
                                    position: 'relative',
                                    padding: '1.5rem',
                                    background: activeStep === idx ? 'rgba(230, 57, 70, 0.04)' : 'transparent',
                                    borderRadius: '20px',
                                    border: activeStep === idx ? '1px solid rgba(230, 57, 70, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer'
                                }}
                            >
                                {/* Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '-32px',
                                    top: '1.8rem',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    background: activeStep === idx ? 'var(--primary)' : '#333',
                                    border: '3px solid #0a0a0a',
                                    boxShadow: activeStep === idx ? '0 0 10px var(--primary-glow)' : 'none',
                                    zIndex: 2,
                                    transition: 'all 0.4s ease'
                                }} />

                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: activeStep === idx ? 'rgba(230, 57, 70, 0.1)' : 'rgba(255,255,255,0.03)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        color: activeStep === idx ? 'var(--primary)' : '#fff',
                                        border: activeStep === idx ? '1px solid rgba(230, 57, 70, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                                        flexShrink: 0,
                                        transition: 'all 0.4s ease'
                                    }}>
                                        <i className={`fa-solid ${step.icon}`}></i>
                                    </div>
                                    <div>
                                        <h4 style={{ 
                                            color: activeStep === idx ? '#fff' : 'rgba(255,255,255,0.8)', 
                                            fontSize: '1.2rem', 
                                            fontWeight: '800', 
                                            marginBottom: '8px',
                                            letterSpacing: '-0.5px',
                                            transition: 'all 0.4s ease'
                                        }}>{step.title}</h4>
                                        <p style={{ 
                                            color: activeStep === idx ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', 
                                            fontSize: '0.95rem', 
                                            lineHeight: '1.6',
                                            maxWidth: '500px',
                                            transition: 'all 0.4s ease'
                                        }}>{step.text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Featured Tool Highlight (Dynamic) */}
                <div style={{ position: 'sticky', top: '150px' }}>
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            background: 'rgba(20, 20, 22, 0.4)',
                            backdropFilter: 'blur(30px)',
                            borderRadius: '32px',
                            padding: '3rem',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Accent Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            padding: '6px 14px',
                            background: 'rgba(230, 57, 70, 0.1)',
                            border: '1px solid rgba(230, 57, 70, 0.3)',
                            borderRadius: '50px',
                            color: 'var(--primary)',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>{steps[activeStep].visualBadge}</div>

                        <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '900', marginBottom: '2.5rem' }}>
                            {steps[activeStep].visualTitle.split(' ')[0]} <br/><span style={{ color: 'var(--primary)' }}>{steps[activeStep].visualTitle.split(' ').slice(1).join(' ')}</span>
                        </h3>

                        {/* Dynamic Visuals */}
                        <div style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {activeStep === 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ 
                                            height: '100px', 
                                            background: 'rgba(255,255,255,0.02)', 
                                            borderRadius: '16px', 
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            <i className="fa-solid fa-car-side" style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.5rem' }}></i>
                                            <div style={{ height: '4px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                                        </div>
                                    ))}
                                    <div style={{ 
                                        height: '45px', 
                                        width: '100%', 
                                        background: 'rgba(230, 57, 70, 0.05)', 
                                        borderRadius: '12px', 
                                        gridColumn: 'span 3',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 15px',
                                        gap: '10px',
                                        border: '1px solid rgba(230, 57, 70, 0.1)'
                                    }}>
                                        <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--primary)', fontSize: '0.8rem' }}></i>
                                        <div style={{ height: '4px', width: '60%', background: 'var(--primary)', opacity: 0.2, borderRadius: '4px' }} />
                                    </div>
                                </div>
                            )}
                            
                            {activeStep === 1 && (
                                <div style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
                                    {[1, 2].map((i) => (
                                        <div key={i} style={{
                                            flex: '1',
                                            background: 'linear-gradient(180deg, #1A1A1C 0%, #121214 100%)',
                                            borderRadius: '20px',
                                            padding: '1.2rem',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            textAlign: 'center'
                                        }}>
                                            <i className="fa-solid fa-car" style={{ color: i === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.2)', fontSize: '2rem', marginBottom: '1rem', opacity: 0.8 }}></i>
                                            <div style={{ height: '6px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', margin: '0 auto 8px' }} />
                                            <div style={{ height: '6px', width: '50%', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', margin: '0 auto' }} />
                                        </div>
                                    ))}
                                    <div style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'var(--primary)',
                                        color: '#fff',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: '900',
                                        boxShadow: '0 0 20px var(--primary-glow)',
                                        zIndex: 10
                                    }}>VS</div>
                                </div>
                            )}

                            {activeStep === 2 && (
                                <div style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-user" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}></i>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }} />
                                            <div style={{ height: '6px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                    <div style={{ 
                                        height: '38px', 
                                        width: '180px', 
                                        margin: '0 auto',
                                        background: 'var(--primary)', 
                                        borderRadius: '10px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 10px 30px rgba(230, 57, 70, 0.2)',
                                        position: 'relative'
                                    }}>
                                        <i className="fa-solid fa-paper-plane" style={{ color: '#fff', fontSize: '0.8rem' }}></i>
                                        <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: '800' }}>SEND INQUIRY</span>

                                        {/* Large Click Simulation Cursor */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '-20px',
                                            color: '#fff',
                                            fontSize: '3.5rem',
                                            textShadow: '0 10px 20px rgba(0,0,0,0.4)',
                                            animation: 'cursorClickLarge 2s infinite',
                                            pointerEvents: 'none',
                                            zIndex: 20
                                        }}>
                                            <i className="fa-solid fa-hand-pointer"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)',
                            margin: '2rem 0'
                        }} />

                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                            {steps[activeStep].visualDesc}
                        </p>

                        <button 
                            onClick={() => navigate('/cars')}
                            className="hero-primary-btn"
                            style={{ width: '100%', justifyContent: 'center', border: 'none' }}
                        >
                            {activeStep === 0 ? 'View Inventory' : activeStep === 1 ? 'Open Comparison' : 'Inquire Now'}
                            <i className="fa-solid fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Background Pulsing Icon */}
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                fontSize: '8rem',
                color: 'var(--primary)',
                opacity: 0.03,
                transform: 'rotate(-15deg)',
                zIndex: -1
            }}>
                <i className="fa-solid fa-right-left"></i>
            </div>

            <style>{`
                @keyframes cursorClickLarge {
                    0% { transform: scale(1) translate(0, 0); }
                    20% { transform: scale(0.9) translate(-5px, 5px); }
                    40% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1) translate(0, 0); }
                }
                @keyframes pulseGlow {
                    0% { transform: scale(1); box-shadow: 0 0 20px rgba(230, 57, 70, 0.4); }
                    50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(230, 57, 70, 0.6); }
                    100% { transform: scale(1); box-shadow: 0 0 20px rgba(230, 57, 70, 0.4); }
                }
            `}</style>
        </section>
    );
};

export default CompareHighlight;
