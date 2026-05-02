import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useInventory } from '../context/InventoryContext';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
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
                        About <span className="text-primary">Us</span>
                    </h1>
                    <p className="inventory-hero-desc">
                        Redefining the premium vehicle experience. Quality, performance, and trust on every road.
                    </p>
                </motion.div>
            </section>

            <div className="about-container">
                <div className="about-row">
                    <div className="about-text">
                        <h2 className="about-subtitle-main">Our Mission</h2>
                        <p className="about-para">
                            At <strong>{settings.businessName}</strong>, our mission is simple: to connect drivers with the finest selection of premium vehicles, backed by transparent pricing and uncompromising quality.
                        </p>
                        <p className="about-para">
                            Whether you're looking for an agile sports car, a reliable SUV for the family, or the latest electric innovation, we curate an inventory that meets rigorous standards.
                        </p>
                    </div>
                    <div className="about-image-box">
                        <img src="/assets/hero_bg.png" alt="Dealership" className="about-img" />
                    </div>
                </div>

                <div className="about-card-grid">
                    <div className="about-feature-card">
                        <i className="fa-solid fa-handshake"></i>
                        <h3>Trust & Transparency</h3>
                        <p>Every vehicle undergoes extensive checks, and we present full history and pricing clearly up front. No hidden fees.</p>
                    </div>
                    <div className="about-feature-card">
                        <i className="fa-solid fa-gem"></i>
                        <h3>Premium Selection</h3>
                        <p>We specialize in curated inventories, ranging from everyday luxury sedans to state-of-the-art sports cars.</p>
                    </div>
                    <div className="about-feature-card">
                        <i className="fa-solid fa-user-shield"></i>
                        <h3>Expert Support</h3>
                        <p>Our staff includes auto experts dedicated to helping you make the most informed decision possible.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
