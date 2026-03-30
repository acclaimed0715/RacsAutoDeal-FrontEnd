import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                <div className="footer-logo" style={{ flex: '1', minWidth: '200px' }}>
                    <img src="/assets/logo.png" alt="Racs Auto Deal Logo" className="logo-img" style={{ maxWidth: '180px' }} />
                </div>
                
                <div className="footer-contact" style={{ flex: '1', minWidth: '200px' }}>
                    <h4 className="footer-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Contact Us</h4>
                    <ul className="contact-list" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#c4c4c4' }}>
                            <i className="fa-solid fa-phone contact-icon" style={{ color: 'var(--accent)' }}></i> 
                            <span>+123 456 789</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#c4c4c4' }}>
                            <i className="fa-solid fa-envelope contact-icon" style={{ color: 'var(--accent)' }}></i> 
                            <span>racsautodeal@gmail.com</span>
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
                    <span className="copyright">All Rights Reserved &copy; 2026</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
