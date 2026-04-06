import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SLIDE_DURATION = 6000; // 6 seconds

const slides = [
    { 
        id: 1, 
        image: '/assets/images/hero-car.png', 
        badge: 'Racs Auto Deal', 
        tagline: 'Premium Performance',
        highlight: 'Starts Here.'
    },
    { 
        id: 2, 
        image: '/assets/images/hero-car-2.png', 
        badge: 'Racs Auto Deal', 
        tagline: 'Elegance & Comfort',
        highlight: 'Luxury Redefined.'
    },
    { 
        id: 3, 
        image: '/assets/images/hero-car-3.png', 
        badge: 'Racs Auto Deal', 
        tagline: 'Speed & Passion',
        highlight: 'Unmatched Value.'
    }
];

const Hero: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Mouse tracking for parallax (Applied to active slide car)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
    const carX = useTransform(springX, [-500, 500], [20, -20]);
    const carY = useTransform(springY, [-500, 500], [15, -15]);
    const glowX = useTransform(springX, [-500, 500], [-30, 30]);
    const glowY = useTransform(springY, [-500, 500], [-20, 20]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const moveX = clientX - window.innerWidth / 2;
            const moveY = clientY - window.innerHeight / 2;
            mouseX.set(moveX);
            mouseY.set(moveY);
        };

        const autoPlayTimer = setInterval(nextSlide, SLIDE_DURATION);

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(autoPlayTimer);
        };
    }, [mouseX, mouseY, nextSlide]);

    const slide = slides[currentSlide];

    return (
        <main className="hero-section">
            <div className="hero-bg-accent"></div>
            
            <div className="hero-main-container">
                <div className="hero-left-content">
                    <motion.div
                        key={`content-${slide.id}`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="hero-badge">{slide.badge}</span>
                        <h1 className="hero-main-title">
                            Your Next Journey <span className="highlight">{slide.highlight}</span>
                        </h1>
                        <p className="hero-sub-description">
                            Welcome to <strong>Racs Auto Deal</strong>, your premier destination for quality
                            vehicles. Explore our curated selection of cars designed to
                            fit every lifestyle, from luxury sedans to powerful SUVs.
                        </p>
                        
                        <div className="hero-action-group">
                            <Link to="/cars" className="hero-primary-btn">
                                <span>Browse Inventory</span>
                                <i className="fa-solid fa-car-side"></i>
                            </Link>
                        </div>

                        <div className="hero-stats-row">
                            <div className="stat-pill">
                                <span className="stat-val">500+</span>
                                <span className="stat-lbl">Units Sold</span>
                            </div>
                            <div className="stat-pill">
                                <span className="stat-val">100%</span>
                                <span className="stat-lbl">Reliable</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-right-visual">
                    <motion.div 
                        className="hero-glow-back"
                        style={{ x: glowX, y: glowY }}
                    ></motion.div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={`slide-${slide.id}`}
                            className="hero-car-wrapper"
                            style={{ x: carX, y: carY }}
                            initial={{ opacity: 0, scale: 0.95, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -50 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <img src={slide.image} alt={slide.tagline} className="hero-parallax-img" />
                            
                            <motion.div 
                                className="floating-badge badge-top"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <i className="fa-solid fa-shield-check"></i>
                                <span>{slide.tagline}</span>
                            </motion.div>
                            
                            <motion.div 
                                className="floating-badge badge-bottom"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                <i className="fa-solid fa-tag"></i>
                                <span>Racs Exclusive</span>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="hero-scroll-indicator" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
                <div className="mouse-icon">
                    <div className="wheel"></div>
                </div>
                <span>Discover More</span>
            </div>
        </main>
    );
};

export default Hero;
