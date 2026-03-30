import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Inventory from '../components/landing/Inventory';
import Footer from '../components/landing/Footer';
import CarPreviewModal from '../components/landing/CarPreviewModal';
import { useInventory } from '../context/InventoryContext';

const CarsPage: React.FC = () => {
    const { cars } = useInventory();
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

    const selectedCar = selectedCarId ? cars[selectedCarId] : null;

    return (
        <div className="landing-page">
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <Inventory onViewCar={setSelectedCarId} />
            </div>
            <Footer />

            {selectedCar && (
                <CarPreviewModal 
                    car={selectedCar} 
                    isOpen={!!selectedCarId} 
                    onClose={() => setSelectedCarId(null)} 
                />
            )}
        </div>
    );
};

export default CarsPage;
