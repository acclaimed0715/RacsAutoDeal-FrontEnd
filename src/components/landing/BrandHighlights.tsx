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
            className="brand-card-item"
        >
            <motion.div
                variants={{
                    hover: { y: -15 }
                }}
                transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                className="brand-card-content"
            >
                <motion.div className="brand-img-box">
                    <motion.img
                        src={brand.img}
                        alt={brand.name}
                        variants={{
                            initial: { filter: 'grayscale(0.8)', scale: 1 },
                            hover: { filter: 'grayscale(0)', scale: 0.85 }
                        }}
                        className="brand-logo-img"
                    />
                </motion.div>
            </motion.div>
            
            <motion.div
                variants={{
                    initial: { opacity: 0, y: 35 },
                    hover: { opacity: 1, y: 0 }
                }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
                className="brand-name-overlay"
            >
                <span
                    style={{
                        color: brand.color === '#000000' ? '#2D3436' : brand.color,
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
        <section className="brand-highlights-section">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="brand-header"
            >
                <h4 className="section-subtitle">Premium Brands We Offer</h4>
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '60px' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="brand-underline"
                />
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="brand-cards-container"
            >
                <div className="brand-flex-row">
                    {brands.map((brand) => (
                        <BrandCard key={brand.name} brand={brand} />
                    ))}
                </div>
            </motion.div>
            
            <div className="brand-bg-glow" />
        </section>
    );
};

export default BrandHighlights;
