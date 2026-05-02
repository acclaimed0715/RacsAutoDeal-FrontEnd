import React from 'react';
import { motion } from 'framer-motion';

const StatsAndServices: React.FC = () => {
    const stats = [
        { icon: 'fa-users', number: '500+', text: 'Clients Served' },
        { icon: 'fa-chart-line', number: '99.9%', text: 'Satisfaction Rate' },
        { icon: 'fa-headset', number: '24/7', text: 'Support Available' },
        { icon: 'fa-award', number: '10+', text: 'Years Experience' }
    ];

    return (
        <section className="stats-services" style={{ width: '100%' }}>
            {/* Stats Row */}
            <div style={{ backgroundColor: '#0B0B0D', padding: '5rem 2rem', borderBottom: '1px solid #2A2A2E' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: 'rgba(230, 57, 70, 0.12)',
                                border: '1px solid rgba(230, 57, 70, 0.30)',
                                color: '#E63946',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem',
                                boxShadow: '0 0 16px rgba(230, 57, 70, 0.15)'
                            }}>
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <h3 style={{ fontSize: '2.6rem', fontWeight: '900', color: '#F4A261', margin: 0, letterSpacing: '-0.5px' }}>
                                {stat.number}
                            </h3>
                            <p style={{ color: '#B0B0B0', fontSize: '0.95rem', margin: 0, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {stat.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Services Intro (Restored & Merged) */}
            <div style={{ backgroundColor: '#121212', padding: '6rem 2rem', textAlign: 'center', borderBottom: '1px solid #2A2A2E' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <div style={{
                        background: 'rgba(230, 57, 70, 0.12)',
                        border: '1px solid rgba(230, 57, 70, 0.25)',
                        color: '#FF4D5A',
                        padding: '8px 24px',
                        borderRadius: '50px',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        letterSpacing: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2rem',
                        textTransform: 'uppercase',
                    }}>
                        <i className="fa-solid fa-gem"></i> PREMIUM SOLUTIONS
                    </div>

                    <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 1.5rem 0', color: '#FFFFFF', letterSpacing: '-1px' }}>
                        Our Automotive Services
                    </h2>

                    <p style={{ color: '#B0B0B0', fontSize: '1.15rem', lineHeight: '1.85', margin: 0 }}>
                        We provide professional automotive services covering the supply of premium vehicles, 
                        financing solutions, and secure transactions, alongside <strong>complete car care services</strong> including 
                        maintenance, professional washing, and meticulous detailing to keep your vehicle in showroom condition.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default StatsAndServices;
