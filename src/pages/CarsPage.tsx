import React from 'react';
import Navbar from '../components/landing/Navbar';
import Inventory from '../components/landing/Inventory';
import Footer from '../components/landing/Footer';

const CarsPage: React.FC = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <div className="inventory-page-wrapper">
                <Inventory />
            </div>
            <Footer />
        </div>
    );
};

export default CarsPage;
