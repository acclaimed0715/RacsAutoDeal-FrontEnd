import React from 'react';
import { motion } from 'framer-motion';

const brands = [
    { name: 'Isuzu', img: '/assets/featured%20brands/Isuzu.png', color: '#E63946' },
    { name: 'Kia', img: '/assets/featured%20brands/Kia.png', color: '#000000' },
    { name: 'Ford', img: '/assets/featured%20brands/ford.png', color: '#003478' },
    { name: 'Geely', img: '/assets/featured%20brands/geely.png', color: '#005AAA' },
    { name: 'Honda', img: '/assets/featured%20brands/honda.png', color: '#E40521' },
    { name: 'Hyundai', img: '/assets/featured%20brands/hyundai.png', color: '#002C5F' },
    { name: 'Mitsubishi', img: '/assets/featured%20brands/mitsubishi.png', color: '#EE2127' },
    { name: 'Nissan', img: '/assets/featured%20brands/nissan-2.png', color: '#C21E2F' },
    { name: 'Suzuki', img: '/assets/featured%20brands/suzuki.png', color: '#E30613' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { 
        opacity: 0, 
        y: 30,
        scale: 0.9
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

const floatAnimation = {
    y: [0, -6, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
    }
};

const BrandCard: React.FC<{ brand: typeof brands[0] }> = ({ brand }) => {
    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            initial="initial"
            animate={floatAnimation}
            style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                height: '115px', // Slightly taller for better name clearance
                width: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <motion.div
                variants={{
                    hover: { 
                        y: -15, // Lift logo higher on hover
                    }
                }}
                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    width: '100%',
                }}
            >
                <motion.div
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center',
                    }}
                >
                    <motion.img
                        src={brand.img}
                        alt={brand.name}
                        variants={{
                            initial: { filter: 'grayscale(0.8)', scale: 1 },
                            hover: { filter: 'grayscale(0)', scale: 0.85 }
                        }}
                        style={{
                            height: '45px',
                            width: '85%',
                            objectFit: 'contain',
                            mixBlendMode: 'multiply',
                        }}
                    />
                </motion.div>
            </motion.div>
            
            <motion.div
                variants={{
                    initial: { opacity: 0, y: 35 },
                    hover: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                style={{
                    position: 'absolute',
                    bottom: '15px',
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 2
                }}
            >
                <span
                    style={{
                        color: brand.color === '#000000' ? '#2D3436' : brand.color,
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                    }}
                >
                    {brand.name}
                </span>
            </motion.div>
        </motion.div>
    );
};







const BrandHighlights: React.FC = () => {
    return (
        <section
            className="brand-highlights"
            style={{
                backgroundColor: '#0B0B0D',
                padding: '5rem 2rem',
                borderTop: '1px solid #2A2A2E',
                borderBottom: '1px solid #2A2A2E',
                overflow: 'hidden'
            }}
        >
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
                <h4
                    style={{
                        color: '#9499A1',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '5px',
                        margin: '0 0 0.75rem 0',
                        fontWeight: '700',
                    }}
                >
                    Premium Brands We Offer
                </h4>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '60px' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    style={{ 
                        height: '3px', 
                        background: 'linear-gradient(90deg, transparent, #E63946, transparent)', 
                        margin: '0 auto', 
                        borderRadius: '2px' 
                    }} 
                />
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}
            >
                {/* Simplified row layout - more responsive */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '1.5rem', 
                    flexWrap: 'wrap',
                    maxWidth: '900px'
                }}>
                    {brands.map((brand) => (
                        <BrandCard key={brand.name} brand={brand} />
                    ))}
                </div>

            </motion.div>
            
            {/* Subtle background glow decorative element */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(230, 57, 70, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
            }} />
        </section>
    );
};

export default BrandHighlights;

