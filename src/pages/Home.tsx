import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import BrandHighlights from '../components/landing/BrandHighlights';
import StatsAndServices from '../components/landing/StatsAndServices';
import SupportSection from '../components/landing/SupportSection';
import Footer from '../components/landing/Footer';
import CustomerReviews from '../components/landing/CustomerReviews';

import CompareHighlight from '../components/landing/CompareHighlight';
import ServicesSection from '../components/landing/ServicesSection';

const Home: React.FC = () => {
    return (
        <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
            {/* Ambient Background Glows */}
            <div className="ambient-glow-wrapper">
                <div className="glow-orb glow-orb-red floating-glow" style={{ width: '600px', height: '600px', top: '-10%', left: '-10%', animationDelay: '0s' }}></div>
                <div className="glow-orb glow-orb-blue floating-glow" style={{ width: '800px', height: '800px', bottom: '10%', right: '-20%', animationDelay: '-5s' }}></div>
                <div className="glow-orb glow-orb-red floating-glow" style={{ width: '500px', height: '500px', top: '40%', left: '30%', opacity: 0.08, animationDelay: '-10s' }}></div>
            </div>

            <Navbar />
            <Hero />
            <BrandHighlights />
            <StatsAndServices />
            <ServicesSection />
            <CompareHighlight />
            <CustomerReviews />
            <SupportSection />
            <Footer />
        </div>
    );
};

export default Home;
