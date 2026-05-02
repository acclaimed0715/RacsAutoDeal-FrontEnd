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
        <section className="services-section">
            <div className="service-blob-1" />
            <div className="service-blob-2" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="services-container"
            >
                {services.map((svc) => (
                    <motion.div
                        key={svc.id}
                        variants={cardVariants}
                        onHoverStart={() => setHoveredId(svc.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        whileHover={{ y: -8, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className={`service-card ${hoveredId === svc.id ? 'hovered' : ''}`}
                        style={{
                            background: hoveredId === svc.id ? svc.gradient : 'rgba(255,255,255,0.03)',
                            borderColor: hoveredId === svc.id ? svc.border : 'rgba(255,255,255,0.07)',
                            boxShadow: hoveredId === svc.id ? `0 0 40px ${svc.accent}22` : '0 0 20px rgba(255,255,255,0.04)',
                        } as any}
                    >
                        <div
                            className="service-tag"
                            style={{
                                backgroundColor: svc.accent + '22',
                                color: svc.accent,
                                borderColor: svc.accent + '44',
                            }}
                        >
                            {svc.tag}
                        </div>

                        <motion.div
                            animate={hoveredId === svc.id ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="service-icon-box"
                            style={{
                                background: svc.accent + '1A',
                                borderColor: svc.accent + '33',
                            }}
                        >
                            {svc.icon}
                        </motion.div>

                        <p className="service-subtitle" style={{ color: svc.accent }}>
                            {svc.subtitle}
                        </p>

                        <h3 className="service-title">
                            {svc.title}
                        </h3>

                        <p className="service-desc">
                            {svc.description}
                        </p>

                        <div
                            className="service-divider"
                            style={{
                                background: `linear-gradient(90deg, ${svc.accent}33, transparent)`,
                            }}
                        />

                        <ul className="service-features-list">
                            {svc.features.map((feat, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.06 }}
                                    className="service-feature-item"
                                >
                                    <span
                                        className="feature-dot"
                                        style={{
                                            backgroundColor: svc.accent,
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
