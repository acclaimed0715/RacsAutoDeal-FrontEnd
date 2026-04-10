import React from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const Footer: React.FC = () => {
    const { settings } = useInventory();

    return (
        <footer className="site-footer">
            <div className="footer-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem' }}>
                <div className="footer-logo" style={{ flex: '1', minWidth: '250px' }}>
                    <img src="/assets/logo.png" alt={`${settings.businessName} Logo`} className="logo-img" style={{ maxWidth: '180px' }} />
                    <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Premium automotive solutions. Providing the best deals and quality service for your next journey.
                    </p>
                </div>

                <div className="footer-contact" style={{ flex: '1', minWidth: '250px' }}>
                    <h4 className="footer-heading" style={{ textAlign: 'left', marginBottom: '1.5rem', color: 'white' }}>Quick Contact</h4>
                    <ul className="contact-list" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', color: '#c4c4c4' }}>
                            <i className="fa-solid fa-phone contact-icon" style={{ color: 'var(--accent)', width: '20px' }}></i>
                            <span>{settings.phone}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', color: '#c4c4c4' }}>
                            <i className="fa-solid fa-envelope contact-icon" style={{ color: 'var(--accent)', width: '20px' }}></i>
                            <span style={{ wordBreak: 'break-all' }}>{settings.contactEmail}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.2rem', color: '#c4c4c4' }}>
                            <i className="fa-solid fa-location-dot contact-icon" style={{ color: 'var(--accent)', width: '20px', marginTop: '4px' }}></i>
                            <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{settings.address}</span>
                        </li>
                    </ul>
                </div>

                <div className="footer-social" style={{ flex: '1', minWidth: '200px' }}>
                    <h4 className="footer-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Follow Us</h4>
                    <div className="social-icons" style={{ justifyContent: 'flex-start' }}>
                        <a href="#"><i className="fa-brands fa-facebook-messenger"></i></a>
                        <a href="#"><i className="fa-brands fa-twitter"></i></a>
                        <a href="https://www.facebook.com/profile.php?id=61560596447465" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom" style={{ justifyContent: 'center' }}>
                <div className="footer-links" style={{ justifyContent: 'center', width: '100%', gap: '2rem' }}>
                    <Link to="/terms#privacy">Privacy Policy</Link>
                    <Link to="/terms#terms">Terms & Conditions</Link>
                    <span className="copyright">All Rights Reserved &copy; {new Date().getFullYear()} {settings.businessName}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
