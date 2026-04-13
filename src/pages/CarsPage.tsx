import React from 'react';
import Navbar from '../components/landing/Navbar';
import Inventory from '../components/landing/Inventory';
import Footer from '../components/landing/Footer';
import { useInventory } from '../context/InventoryContext';
import { motion } from 'framer-motion';

const CarsPage: React.FC = () => {
    const { settings } = useInventory();

    return (
        <div className="landing-page">
            <Navbar />
            
            {/* Standard Page Hero to match the Landing Hero experience */}
            <div className="about-hero" style={{ 
                paddingTop: '160px', 
                paddingBottom: '80px', 
                textAlign: 'center', 
                background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="hero-bg-accent" style={{ opacity: 0.1 }}></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="hero-badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                        {settings.businessName || 'Racs Auto Deal'}
                    </span>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Our <span style={{ color: 'var(--primary)' }}>Inventory</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', padding: '0 2rem' }}>
                        Explore our curated selection of premium vehicles. From luxury sedans to powerful SUVs, find your perfect match today.
                    </p>
                </motion.div>
            </div>

            <div className="inventory-page-wrapper">
                <Inventory />
            </div>
            <Footer />
        </div>
    );
};

export default CarsPage;
