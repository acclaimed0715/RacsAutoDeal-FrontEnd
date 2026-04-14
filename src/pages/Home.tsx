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
        <div className="landing-page">
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
