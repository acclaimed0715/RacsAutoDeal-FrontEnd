import React, { useState } from 'react';
import { motion } from 'framer-motion';

const services = [
    {
        id: 'maintenance',
        icon: '🔧',
        title: 'Car Maintenance',
        subtitle: 'KEEP IT RUNNING PERFECTLY',
        description:
            'Our certified technicians provide comprehensive vehicle maintenance services to keep your car in peak condition. From routine oil changes to full engine diagnostics, we handle it all with precision.',
        features: [
            'Engine Oil & Filter Change',
            'Brake Inspection & Replacement',
            'Battery Check & Replacement',
            'Tire Rotation & Alignment',
            'Transmission Service',
            'Full Vehicle Diagnostics',
        ],
        accent: '#E63946',
        gradient: 'linear-gradient(135deg, rgba(230,57,70,0.12) 0%, rgba(230,57,70,0.04) 100%)',
        border: 'rgba(230,57,70,0.25)',
        tag: 'Most Popular',
    },
    {
        id: 'carwash',
        icon: '💧',
        title: 'Car Wash',
        subtitle: 'SPOTLESS EVERY TIME',
        description:
            'Give your vehicle a sparkling clean refresh. Our professional car wash service removes dirt, grime, and contaminants using eco-friendly products that protect your paint and finish.',
        features: [
            'Exterior Hand Wash & Rinse',
            'Tire & Rim Cleaning',
            'Window & Mirror Clarity',
            'Underbody Rinse',
            'Door Jamb Wipe-down',
            'Exterior Drying & Buffing',
        ],
        accent: '#3A86FF',
        gradient: 'linear-gradient(135deg, rgba(58,134,255,0.12) 0%, rgba(58,134,255,0.04) 100%)',
        border: 'rgba(58,134,255,0.25)',
        tag: 'Express',
    },
    {
        id: 'detailing',
        icon: '✨',
        title: 'Car Detailing',
        subtitle: 'SHOWROOM PERFECTION',
        description:
            'Restore your vehicle to its absolute best with our meticulous detailing service. We go beyond the surface — deep cleaning, polishing, and protecting every inch inside and out.',
        features: [
            'Interior Deep Vacuum & Shampoo',
            'Dashboard & Console Polish',
            'Leather Conditioning',
            'Paint Clay Bar Treatment',
            'Wax & Sealant Protection',
            'Air Freshener Treatment',
        ],
        accent: '#9B5DE5',
        gradient: 'linear-gradient(135deg, rgba(155,93,229,0.12) 0%, rgba(155,93,229,0.04) 100%)',
        border: 'rgba(155,93,229,0.25)',
        tag: 'Premium',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 80, damping: 14 },
    },
};

const ServicesSection: React.FC = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section
            style={{
                backgroundColor: '#0D0D10',
                padding: '6rem 2rem',
                borderTop: '1px solid #1E1E24',
                borderBottom: '1px solid #1E1E24',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decorative blobs */}
            <div
                style={{
                    position: 'absolute',
                    top: '-120px',
                    left: '-120px',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(230,57,70,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-100px',
                    right: '-100px',
                    width: '450px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(58,134,255,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}
            >
                <p
                    style={{
                        color: '#E63946',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '0.75rem',
                    }}
                >
                    What We Offer
                </p>
                <h2
                    style={{
                        color: '#F0F0F0',
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                        fontWeight: '800',
                        margin: '0 0 1rem 0',
                        lineHeight: 1.15,
                        letterSpacing: '-0.5px',
                    }}
                >
                    Complete Car Care Services
                </h2>
                <p
                    style={{
                        color: '#6B7280',
                        fontSize: '1rem',
                        maxWidth: '520px',
                        margin: '0 auto',
                        lineHeight: 1.7,
                    }}
                >
                    Beyond buying and selling — we take care of your vehicle throughout its entire life.
                </p>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '60px' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #E63946, transparent)',
                        margin: '1.5rem auto 0',
                        borderRadius: '2px',
                    }}
                />
            </motion.div>

            {/* Service Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                style={{
                    display: 'flex',
                    gap: '2rem',
                    maxWidth: '1300px',
                    margin: '0 auto',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {services.map((svc) => (
                    <motion.div
                        key={svc.id}
                        variants={cardVariants}
                        onHoverStart={() => setHoveredId(svc.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        whileHover={{ y: -8, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                            flex: '1 1 340px',
                            maxWidth: '400px',
                            background: hoveredId === svc.id ? svc.gradient : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${hoveredId === svc.id ? svc.border : 'rgba(255,255,255,0.07)'}`,
                            borderRadius: '24px',
                            padding: '2.5rem',
                            cursor: 'default',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'background 0.4s ease, border-color 0.4s ease',
                            boxShadow: hoveredId === svc.id
                                ? `0 0 40px ${svc.accent}22`
                                : '0 0 20px rgba(255,255,255,0.04)',
                        }}
                    >
                        {/* Tag */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                backgroundColor: svc.accent + '22',
                                color: svc.accent,
                                padding: '4px 12px',
                                borderRadius: '50px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                border: `1px solid ${svc.accent}44`,
                            }}
                        >
                            {svc.tag}
                        </div>

                        {/* Icon */}
                        <motion.div
                            animate={hoveredId === svc.id ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                width: '68px',
                                height: '68px',
                                borderRadius: '18px',
                                background: svc.accent + '1A',
                                border: `1.5px solid ${svc.accent}33`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            {svc.icon}
                        </motion.div>

                        {/* Subtitle */}
                        <p
                            style={{
                                color: svc.accent,
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                            }}
                        >
                            {svc.subtitle}
                        </p>

                        {/* Title */}
                        <h3
                            style={{
                                color: '#F0F0F0',
                                fontSize: '1.65rem',
                                fontWeight: '800',
                                margin: '0 0 1rem 0',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            {svc.title}
                        </h3>

                        {/* Description */}
                        <p
                            style={{
                                color: '#8D95A0',
                                fontSize: '0.95rem',
                                lineHeight: '1.75',
                                marginBottom: '2rem',
                            }}
                        >
                            {svc.description}
                        </p>

                        {/* Divider */}
                        <div
                            style={{
                                height: '1px',
                                background: `linear-gradient(90deg, ${svc.accent}33, transparent)`,
                                marginBottom: '1.5rem',
                            }}
                        />

                        {/* Features */}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0' }}>
                            {svc.features.map((feat, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.06 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        color: '#C0C8D4',
                                        fontSize: '0.9rem',
                                        padding: '0.45rem 0',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: svc.accent,
                                            flexShrink: 0,
                                            boxShadow: `0 0 6px ${svc.accent}88`,
                                        }}
                                    />
                                    {feat}
                                </motion.li>
                            ))}
                        </ul>


                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default ServicesSection;
