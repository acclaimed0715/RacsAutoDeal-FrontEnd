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
        <section className="stats-services-wrapper">
            {/* Stats Row */}
            <div className="stats-section">
                <div className="stats-grid-container">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="stat-card-item"
                        >
                            <div className="stat-icon-circle">
                                <i className={`fa-solid ${stat.icon}`}></i>
                            </div>
                            <h3 className="stat-number-text">
                                {stat.number}
                            </h3>
                            <p className="stat-label-text">
                                {stat.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Services Intro */}
            <div className="services-intro-section">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="services-intro-content"
                >
                    <div className="premium-pill">
                        <i className="fa-solid fa-gem"></i> PREMIUM SOLUTIONS
                    </div>

                    <h2 className="section-title">
                        Our Automotive Services
                    </h2>

                    <p className="section-desc">
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
