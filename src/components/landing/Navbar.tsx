import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const Navbar: React.FC = () => {
    const { settings } = useInventory();
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            // Show brand name in navbar after scrolling past hero content
            if (window.scrollY > 180) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar smart-nav ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1400px', padding: '0 2rem' }}>
                <div className="logo-container">
                    <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none' }}>
                        <img src="/assets/logo.png" alt="Racs Auto Deal Logo" className="logo-img" style={{ cursor: 'pointer' }} />
                        <span className="navbar-brand-name" style={{
                            color: 'white',
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            opacity: isScrolled ? 1 : 0,
                            transform: isScrolled ? 'translateX(0)' : 'translateX(-20px)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            pointerEvents: 'none',
                            fontFamily: "'Montserrat', sans-serif",
                            textShadow: '0 0 15px rgba(230, 57, 70, 0.4)'
                        }}>
                            {settings.businessName}
                        </span>
                    </NavLink>
                </div>
                
                <div className="nav-links" style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    alignItems: 'center',
                    opacity: isHome && !isScrolled ? 0 : 1,
                    transform: isHome && !isScrolled ? 'translateY(-10px)' : 'translateY(0)',
                    pointerEvents: isHome && !isScrolled ? 'none' : 'auto',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <NavLink to="/cars" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem', transition: 'color 0.3s' }} className={({ isActive }) => isActive ? 'active-nav-link' : ''}>
                        Car Listing
                    </NavLink>
                    <NavLink to="/about" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '1.1rem', transition: 'color 0.3s' }} className={({ isActive }) => isActive ? 'active-nav-link' : ''}>
                        About Us
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
