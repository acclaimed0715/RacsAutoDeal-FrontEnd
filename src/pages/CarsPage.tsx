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
            
            <section className="inventory-hero-section">
                <div className="hero-bg-accent" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inventory-hero-content"
                >
                    <span className="hero-badge">
                        {settings.businessName || 'Racs Auto Deal'}
                    </span>
                    <h1 className="inventory-hero-title">
                        Our <span className="text-primary">Inventory</span>
                    </h1>
                    <p className="inventory-hero-desc">
                        Explore our curated selection of premium vehicles. From luxury sedans to powerful SUVs, find your perfect match today.
                    </p>
                </motion.div>
            </section>

            <div className="inventory-page-wrapper">
                <Inventory />
            </div>
            <Footer />
        </div>
    );
};

export default CarsPage;
