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
            href: '#',
            icon: 'fa-brands fa-facebook-messenger',
            label: 'Messenger',
            color: '#00B2FF',
        },
        {
            href: '#',
            icon: 'fa-brands fa-twitter',
            label: 'Twitter / X',
            color: '#1DA1F2',
        },
    ];

    return (
        <footer
            id="footer"
            style={{
                backgroundColor: '#080809',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative top gradient line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #E63946 30%, #E63946 70%, transparent 100%)',
                    opacity: 0.7,
                }}
            />

            {/* Background glow */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px',
                    height: '300px',
                    background: 'radial-gradient(ellipse, rgba(230,57,70,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Main footer body */}
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '5rem 2rem 3rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '3rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Brand Column */}
                <div style={{ gridColumn: 'span 1' }}>
                    <img
                        src="/assets/logo.png"
                        alt={`${settings.businessName} Logo`}
                        style={{ maxWidth: '160px', marginBottom: '1.25rem' }}
                    />
                    <p
                        style={{
                            color: '#6B7280',
                            fontSize: '0.88rem',
                            lineHeight: '1.75',
                            marginBottom: '2rem',
                            maxWidth: '260px',
                        }}
                    >
                        Premium automotive solutions. Providing the best deals and quality service for your next journey.
                    </p>

                    {/* Social Icons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {socialLinks.map((s) => (
                            <motion.a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.label}
                                whileHover={{ scale: 1.12, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#aaa',
                                    fontSize: '0.85rem',
                                    textDecoration: 'none',
                                    transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = s.color + '22';
                                    e.currentTarget.style.borderColor = s.color + '66';
                                    e.currentTarget.style.color = s.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = '#aaa';
                                }}
                            >
                                <i className={s.icon} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Quick Links Column */}
                <div>
                    <h4
                        style={{
                            color: '#F0F0F0',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Quick Links
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {quickLinks.map((link) => (
                            <li key={link.label} style={{ marginBottom: '0.75rem' }}>
                                <Link
                                    to={link.to}
                                    style={{
                                        color: '#6B7280',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'color 0.25s ease, gap 0.25s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#E63946';
                                        e.currentTarget.style.gap = '0.75rem';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#6B7280';
                                        e.currentTarget.style.gap = '0.5rem';
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '5px',
                                            height: '5px',
                                            borderRadius: '50%',
                                            backgroundColor: '#E63946',
                                            flexShrink: 0,
                                        }}
                                    />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Column */}
                <div>
                    <h4
                        style={{
                            color: '#F0F0F0',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Contact Us
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                            { icon: 'fa-solid fa-phone', text: settings.phone },
                            { icon: 'fa-solid fa-envelope', text: settings.contactEmail },
                            { icon: 'fa-solid fa-location-dot', text: settings.address },
                        ].map((item, i) => (
                            <li
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.9rem',
                                    marginBottom: '1.1rem',
                                    color: '#6B7280',
                                    fontSize: '0.88rem',
                                    lineHeight: '1.6',
                                }}
                            >
                                <span
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: 'rgba(230,57,70,0.1)',
                                        border: '1px solid rgba(230,57,70,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: '#E63946',
                                        fontSize: '0.75rem',
                                        marginTop: '2px',
                                    }}
                                >
                                    <i className={item.icon} />
                                </span>
                                <span style={{ wordBreak: 'break-word' }}>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Business Hours Column */}
                <div>
                    <h4
                        style={{
                            color: '#F0F0F0',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Business Hours
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                            { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
                            { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
                            { day: 'Sunday', time: 'Closed' },
                        ].map((row) => (
                            <li
                                key={row.day}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.6rem 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <span style={{ color: '#6B7280' }}>{row.day}</span>
                                <span
                                    style={{
                                        color: row.time === 'Closed' ? '#E63946' : '#C0C8D4',
                                        fontWeight: '600',
                                        fontSize: '0.82rem',
                                    }}
                                >
                                    {row.time}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                    }}
                />
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <span style={{ color: '#3D3D44', fontSize: '0.82rem' }}>
                    © {new Date().getFullYear()} {settings.businessName}. All Rights Reserved.
                </span>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {[
                        { label: 'Privacy Policy', to: '/terms#privacy' },
                        { label: 'Terms & Conditions', to: '/terms#terms' },
                    ].map((l) => (
                        <Link
                            key={l.label}
                            to={l.to}
                            style={{
                                color: '#3D3D44',
                                fontSize: '0.82rem',
                                textDecoration: 'none',
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#E63946')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#3D3D44')}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
