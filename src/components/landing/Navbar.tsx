import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const Navbar: React.FC = () => {
    const { settings } = useInventory();
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className={`navbar smart-nav pill-style ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* Left: Brand Branding */}
                <div className="brand-section">
                    <NavLink to="/" className="logo-link">
                        <img src="/assets/logo.png" alt="Racs Auto Deal Logo" className="logo-img" />
                        <span className="navbar-brand-name">
                            {settings.businessName}
                        </span>
                    </NavLink>
                </div>
                
                {/* Right: Floating Pill Menu */}
                <div className="menu-pill-wrapper">
                    <nav className={`menu-pill ${isMobileMenuOpen ? 'open' : ''}`}>
                        <div className="pill-links">
                            <a 
                                href="#footer" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                                }} 
                                className="pill-link"
                            >
                                Contact Us
                            </a>
                            <NavLink to="/about" className={({ isActive }) => isActive ? 'pill-link active' : 'pill-link'}>
                                About Us
                            </NavLink>
                        </div>
                        
                        <div className="pill-action">
                            <NavLink to="/cars" className="pill-cta-btn">
                                Inventory
                            </NavLink>
                        </div>
                    </nav>
                    
                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
