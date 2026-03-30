import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    return (
        <main className="hero">
            <div className="hero-bg"></div>
            <div className="hero-overlay"></div>

            <div className="hero-container">
                <div className="hero-content">
                    <motion.h2
                        className="subtitle reveal-up active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Racs Auto Deal
                    </motion.h2>
                    <motion.h1
                        className="title reveal-up active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Your Next Journey<br />Starts Here.
                    </motion.h1>
                    <motion.p
                        className="description reveal-up active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        Welcome to <strong>Racs Auto Deal</strong>, your premier destination for quality
                        vehicles where we offer a curated selection of cars designed to
                        fit every lifestyle. Explore our inventory and discover the
                        exceptional service and unbeatable value that make us stand
                        out from the rest!
                    </motion.p>
                    <motion.div
                        className="hero-actions reveal-up active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link to="/cars" className="cta-btn primary-cta">
                            <span>Explore Car Listings</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="scroll-indicator" id="scrollBtn" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
                <span className="scroll-text">Scroll down below to see more</span>
                <div className="arrow-container">
                    <i className="fa-solid fa-arrow-down arrow-down"></i>
                </div>
            </div>
        </main>
    );
};

export default Hero;
