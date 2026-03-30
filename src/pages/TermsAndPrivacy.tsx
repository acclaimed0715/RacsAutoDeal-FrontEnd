import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const TermsAndPrivacy: React.FC = () => {
    return (
        <div className="landing-page" style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
            <Navbar />
            
            <div className="legal-hero" style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center', background: 'var(--bg-footer)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>
                    Legal <span style={{ color: 'var(--primary)' }}>Hub</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
                    Our Commitment to Transparency, Security, and Your Rights at RACS AUTO DEAL.
                </p>
            </div>

            <div className="legal-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 2rem', color: '#ccc', lineHeight: '1.8' }}>
                
                {/* Terms & Conditions */}
                <section id="terms" style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fa-solid fa-file-contract" style={{ color: 'var(--primary)', fontSize: '2rem' }}></i>
                        Terms & Conditions
                    </h2>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ marginBottom: '1.5rem' }}>Welcome to RACS AUTO DEAL. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h4>
                        <p>Your access to and use of this website is subject to these terms and conditions. If you do not agree to these terms, please do not use the service.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>2. Vehicle Information</h4>
                        <p>While we strive to provide accurate vehicle descriptions and pricing, technical inaccuracies or typographical errors may occur. We reserve the right to correct any errors and change information without prior notice.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>3. User Conduct</h4>
                        <p>Users are expected to use the website for its intended purpose and refrain from any activity that interferes with its functional operation or compromises its security.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h4>
                        <p>All content, including logos, designs, and text, are the exclusive property of RACS AUTO DEAL and are protected by international copyright laws.</p>
                    </div>
                </section>

                {/* Privacy Policy */}
                <section id="privacy">
                    <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="fa-solid fa-user-shield" style={{ color: 'var(--primary)', fontSize: '2rem' }}></i>
                        Privacy Policy
                    </h2>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ marginBottom: '1.5rem' }}>We value your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>1. Information Collection</h4>
                        <p>We may collect personal details such as your name, email address, and phone number when you inquire about a vehicle or contact us through our platform.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Information</h4>
                        <p>Your information is used solely to provide services, process inquiries, and improve your user experience with RACS AUTO DEAL.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h4>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your information to outside parties.</p>
                        
                        <h4 style={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>4. Cookies</h4>
                        <p>Our website may use cookies to enhance navigation and record display preferences. You can disable cookies in your browser settings if preferred.</p>
                    </div>
                </section>

            </div>

            <Footer />
        </div>
    );
};

export default TermsAndPrivacy;
