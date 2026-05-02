import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CompareHighlight: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(1); // Default to Comparison step

    const steps = [
        { 
            id: 0,
            title: 'Explore Digital Showroom', 
            text: 'Browse our live inventory with real-time availability, high-resolution galleries, and comprehensive technical specifications.', 
            icon: 'fa-magnifying-glass',
            visualTitle: 'Smart Inventory',
            visualDesc: 'Filter through our premium collection using our high-speed digital showroom interface.',
            visualBadge: 'Interactive Showroom'
        },
        { 
            id: 1,
            title: 'Smart Side-by-Side Analysis', 
            text: 'Select and analyze up to 4 vehicles simultaneously. Evaluate performance, features, and pricing with our integrated tool.', 
            icon: 'fa-right-left',
            highlight: true,
            visualTitle: 'Compare Engine',
            visualDesc: 'Our proprietary tool allows for real-time spec comparisons of up to 4 vehicles simultaneously.',
            visualBadge: 'Key Feature'
        },
        { 
            id: 2,
            title: 'Submit Digital Inquiry', 
            text: 'Instantly transmit your inquiry through our secure platform to begin the professional acquisition process.', 
            icon: 'fa-paper-plane',
            visualTitle: 'Secure Inquiry',
            visualDesc: 'Your data is encrypted and sent directly to our experts for immediate consultation.',
            visualBadge: 'Direct Access'
        }
    ];

    return (
        <section className="compare-highlight section-padding">
            <div className="ambient-orb orb-1" />

            <div className="compare-highlight-container">
                {/* Left: Detailed Process Guide */}
                <motion.div
                    className="process-guide"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-subtitle">The Experience</span>
                    <h2 className="section-main-title">
                        Your Journey to <br/>
                        <span className="text-primary">Showroom Perfection</span>
                    </h2>

                    <div className="timeline-wrapper">
                        {/* Timeline Line */}
                        <div className="timeline-line" />

                        {steps.map((step, idx) => (
                            <motion.div 
                                key={idx}
                                onMouseEnter={() => setActiveStep(idx)}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className={`step-item ${activeStep === idx ? 'active' : ''}`}
                            >
                                {/* Dot */}
                                <div className="step-dot" />

                                <div className="step-content-row">
                                    <div className="step-icon-box">
                                        <i className={`fa-solid ${step.icon}`}></i>
                                    </div>
                                    <div className="step-text-box">
                                        <h4>{step.title}</h4>
                                        <p>{step.text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Featured Tool Highlight (Dynamic) */}
                <div className="tool-highlight-wrapper">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="tool-card"
                    >
                        {/* Accent Badge */}
                        <div className="tool-badge">{steps[activeStep].visualBadge}</div>

                        <h3 className="tool-title">
                            {steps[activeStep].visualTitle.split(' ')[0]} <br/>
                            <span className="text-primary">{steps[activeStep].visualTitle.split(' ').slice(1).join(' ')}</span>
                        </h3>

                        {/* Dynamic Visuals */}
                        <div className="tool-visual-container">
                            {activeStep === 0 && (
                                <div className="showroom-visual">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="visual-car-card">
                                            <i className="fa-solid fa-car-side"></i>
                                            <div className="visual-bar" />
                                        </div>
                                    ))}
                                    <div className="visual-search-bar">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                        <div className="visual-search-progress" />
                                    </div>
                                </div>
                            )}
                            
                            {activeStep === 1 && (
                                <div className="compare-visual">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="visual-compare-car">
                                            <i className="fa-solid fa-car"></i>
                                            <div className="visual-bar-long" />
                                            <div className="visual-bar-short" />
                                        </div>
                                    ))}
                                    <div className="visual-vs-badge">VS</div>
                                </div>
                            )}

                            {activeStep === 2 && (
                                <div className="inquiry-visual">
                                    <div className="visual-inquiry-form">
                                        <div className="visual-user-row">
                                            <div className="visual-avatar">
                                                <i className="fa-solid fa-user"></i>
                                            </div>
                                            <div className="visual-user-info">
                                                <div className="visual-bar-md" />
                                                <div className="visual-bar-lg" />
                                            </div>
                                        </div>
                                        <div className="visual-send-btn">
                                            <i className="fa-solid fa-paper-plane"></i>
                                            <span>SEND INQUIRY</span>

                                            {/* Large Click Simulation Cursor */}
                                            <div className="visual-cursor">
                                                <i className="fa-solid fa-hand-pointer"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="tool-divider" />

                        <p className="tool-description">
                            {steps[activeStep].visualDesc}
                        </p>

                        <button 
                            onClick={() => navigate('/cars')}
                            className="hero-primary-btn tool-btn"
                        >
                            {activeStep === 0 ? 'View Inventory' : activeStep === 1 ? 'Open Comparison' : 'Inquire Now'}
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Background Pulsing Icon */}
            <div className="bg-pulsing-icon">
                <i className="fa-solid fa-right-left"></i>
            </div>
        </section>
    );
};

export default CompareHighlight;
