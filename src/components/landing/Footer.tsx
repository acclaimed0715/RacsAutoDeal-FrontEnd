import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInventory } from '../../context/InventoryContext';

const Footer: React.FC = () => {
    const { settings } = useInventory();

    const quickLinks = [
        { label: 'Home', to: '/' },
        { label: 'Browse Cars', to: '/cars' },
        { label: 'About Us', to: '/about' },
        { label: 'Terms & Conditions', to: '/terms#terms' },
        { label: 'Privacy Policy', to: '/terms#privacy' },
    ];

    const socialLinks = [
        {
            href: 'https://www.facebook.com/profile.php?id=61560596447465',
            icon: 'fa-brands fa-facebook-f',
            label: 'Facebook',
            color: '#1877F2',
        },
        {
            href: 'https://www.facebook.com/profile.php?id=61560596447465',
            icon: 'fa-brands fa-facebook-messenger',
            label: 'Messenger',
            color: '#00B2FF',
        },
    ];

    return (
        <footer id="footer" className="footer-main">
            {/* Decorative top gradient line */}
            <div className="footer-top-line" />

            {/* Background glow */}
            <div className="footer-bg-glow" />

            {/* Main footer body */}
            <div className="footer-grid">
                {/* Brand Column */}
                <div className="footer-col">
                    <img
                        src="/assets/logo.png"
                        alt={`${settings.businessName} Logo`}
                        className="footer-logo"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    />
                    <p className="footer-brand-desc">
                        Premium automotive solutions. Providing the best deals and quality service for your next journey.
                    </p>

                    <div className="footer-socials">
                        {socialLinks.map((s) => (
                            <motion.a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.label}
                                whileHover={{ scale: 1.12, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="social-icon-btn"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = s.color + '22';
                                    e.currentTarget.style.borderColor = s.color + '66';
                                    e.currentTarget.style.color = s.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '';
                                    e.currentTarget.style.borderColor = '';
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                <i className={s.icon} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Quick Links Column */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Quick Links</h4>
                    <ul className="footer-links-list">
                        {quickLinks.map((link) => (
                            <li key={link.label}>
                                <Link to={link.to}>
                                    <span className="dot" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Column */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Contact Us</h4>
                    <ul className="footer-contact-list">
                        {[
                            { icon: 'fa-solid fa-phone', text: settings.phone },
                            { icon: 'fa-solid fa-envelope', text: settings.contactEmail },
                            { icon: 'fa-solid fa-location-dot', text: settings.address },
                        ].map((item, i) => (
                            <li key={i}>
                                <span className="icon-box">
                                    <i className={item.icon} />
                                </span>
                                <span className="contact-text">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Business Hours Column */}
                <div className="footer-col">
                    <h4 className="footer-col-title">Business Hours</h4>
                    <ul className="footer-hours-list">
                        {[
                            { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
                            { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
                            { day: 'Sunday', time: 'Closed' },
                        ].map((row) => (
                            <li key={row.day}>
                                <span className="day-name">{row.day}</span>
                                <span className={`hour-val ${row.time === 'Closed' ? 'closed' : ''}`}>
                                    {row.time}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom-bar">
                <div className="footer-bottom-flex">
                    <span className="copyright-text">
                        © {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.
                    </span>
                    <div className="footer-bottom-links">
                        {[
                            { label: 'Privacy Policy', to: '/terms#privacy' },
                            { label: 'Terms & Conditions', to: '/terms#terms' },
                        ].map((l) => (
                            <Link key={l.label} to={l.to}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
