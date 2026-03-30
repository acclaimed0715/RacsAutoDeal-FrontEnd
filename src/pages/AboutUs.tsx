import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useInventory } from '../context/InventoryContext';

const AboutUs: React.FC = () => {
    const { settings } = useInventory();

    return (
        <div className="landing-page">
            <Navbar />
            
            <div className="about-hero" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', background: 'var(--bg-footer)' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem', color: 'white' }}>
                    About <span style={{ color: 'var(--primary)' }}>{settings.businessName}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
                    We specialize in giving you the premium vehicle experience. Redefining quality, performance, and trust on the road.
                </p>
            </div>

            <div className="about-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="about-text">
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', color: 'white' }}>Our Mission</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc', marginBottom: '1.5rem' }}>
                            At <strong>{settings.businessName}</strong>, our mission is simple: to connect drivers with the finest selection of premium vehicles, backed by transparent pricing and uncompromising quality.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc' }}>
                            Whether you're looking for an agile sports car, a reliable SUV for the family, or the latest electric innovation, we curate an inventory that meets rigorous standards.
                        </p>
                    </div>
                    <div className="about-image" style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', backgroundColor: '#222' }}>
                        <img src="/assets/hero_bg.png" alt="Dealership" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                    <div style={{ background: 'var(--bg-dark)', padding: '3rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className="fa-solid fa-handshake" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>Trust & Transparency</h3>
                        <p style={{ color: '#aaa', lineHeight: '1.6' }}>Every vehicle undergoes extensive checks, and we present full history and pricing clearly up front. No hidden fees.</p>
                    </div>
                    <div style={{ background: 'var(--bg-dark)', padding: '3rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className="fa-solid fa-gem" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>Premium Selection</h3>
                        <p style={{ color: '#aaa', lineHeight: '1.6' }}>We specialize in curated inventories, ranging from everyday luxury sedans to state-of-the-art sports cars.</p>
                    </div>
                    <div style={{ background: 'var(--bg-dark)', padding: '3rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className="fa-solid fa-user-shield" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1rem' }}>Expert Support</h3>
                        <p style={{ color: '#aaa', lineHeight: '1.6' }}>Our staff includes auto experts dedicated to helping you make the most informed decision possible.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
