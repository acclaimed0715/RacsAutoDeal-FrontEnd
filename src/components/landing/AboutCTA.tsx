import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutCTA: React.FC = () => {
    return (
        <section className="about-cta-section">
            <div className="about-cta-container">
                <motion.div 
                    className="about-cta-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="about-cta-title">Discover the Racs Auto Deal Story</h2>
                    <p className="about-cta-description">
                        Learn about our commitment to quality, our history, and why we are 
                        the most trusted name in premium vehicles.
                    </p>
                    <Link to="/about" className="about-cta-btn">
                        <span>About Us</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutCTA;
