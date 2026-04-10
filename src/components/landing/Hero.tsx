import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
    
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        const autoPlayTimer = setInterval(nextSlide, SLIDE_DURATION);
        return () => clearInterval(autoPlayTimer);
    }, [nextSlide]);

    // Mouse tracking for parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
    const parallaxX = useTransform(springX, [-500, 500], [15, -15]);
    const parallaxY = useTransform(springY, [-500, 500], [10, -10]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const moveX = e.clientX - window.innerWidth / 2;
            const moveY = e.clientY - window.innerHeight / 2;
            mouseX.set(moveX);
            mouseY.set(moveY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Calculate indices for the stack
    const getPosition = (index: number) => {
        const diff = (index - currentSlide + slides.length) % slides.length;
        if (diff === 0) return "center";
        if (diff === 1) return "right";
        if (diff === slides.length - 1) return "left";
        return "hidden";
    };

    const variants = {
        center: { 
            x: 0, 
            scale: 1, 
            zIndex: 10, 
            opacity: 1,
            rotateY: 0,
            filter: 'brightness(1)'
        },
        right: { 
            x: '45%', 
            y: -40, // Move a little up when behind
            scale: 0.8, 
            zIndex: 5, 
            opacity: 0.4,
            rotateY: -15,
            filter: 'brightness(0.5) blur(1px)'
        },
        left: { 
            x: '-45%', 
            y: -40, // Move a little up when behind
            scale: 0.8, 
            zIndex: 5, 
            opacity: 0.4,
            rotateY: 15,
            filter: 'brightness(0.5) blur(1px)'
        },
        hidden: { 
            scale: 0.5, 
            opacity: 0, 
            zIndex: 0,
            x: 0,
            y: 0
        }
    };


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
                            fit every lifestyle.
                        </p>
                        
                        <div className="hero-action-group">
                            <Link to="/cars" className="hero-primary-btn">
                                <span>Browse Inventory</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>

                            <Link to="/about" className="hero-secondary-btn">
                                <span>Learn Our Story</span>
                                <i className="fa-solid fa-circle-info"></i>
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
                            <div className="stat-pill">
                                <span className="stat-val">24/7</span>
                                <span className="stat-lbl">Support</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-right-visual" style={{ perspective: '1000px' }}>
                    <div className="hero-stack-container" style={{ position: 'relative', width: '100%', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {slides.map((s, index) => {
                            const pos = getPosition(index);
                            return (
                                <motion.div
                                    key={s.id}
                                    variants={variants}
                                    animate={pos}
                                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        maxWidth: '600px',
                                        cursor: pos !== 'center' ? 'pointer' : 'default'
                                    }}
                                    onClick={() => {
                                        if (pos === 'right') nextSlide();
                                        if (pos === 'left') prevSlide();
                                    }}
                                >
                                    <motion.div 
                                        style={{ 
                                            x: pos === 'center' ? parallaxX : 0, 
                                            y: pos === 'center' ? parallaxY : 0 
                                        }}
                                    >
                                        <img 
                                            src={s.image} 
                                            alt={s.tagline} 
                                            style={{ 
                                                width: '100%', 
                                                height: 'auto', 
                                                filter: pos === 'center' ? 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' : 'none' 
                                            }} 
                                        />
                                        
                                        {pos === 'center' && (
                                            <>
                                                <motion.div 
                                                    className="floating-badge badge-top"
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    <i className="fa-solid fa-shield-check"></i>
                                                    <span>{s.tagline}</span>
                                                </motion.div>
                                                
                                                <motion.div 
                                                    className="floating-badge badge-bottom"
                                                    animate={{ y: [0, 10, 0] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                >
                                                    <i className="fa-solid fa-tag"></i>
                                                    <span>Racs Exclusive</span>
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                    
                </div>
            </div>



        </main>
    );
};


export default Hero;
