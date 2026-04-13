import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';

const CompareBar: React.FC = () => {
    const { selectedCars, removeFromCompare } = useCompare();
    const navigate = useNavigate();
    const location = useLocation();

    if (selectedCars.length === 0 || location.pathname === '/compare') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="compare-bar-container"
            >
                <div className="compare-bar-content">
                    <div className="compare-bar-info">
                        <span className="compare-count">{selectedCars.length}</span>
                        <span className="compare-text">Cars to Compare</span>
                    </div>

                    <div className="compare-items-list">
                        {selectedCars.map((car) => (
                            <div key={car.id} className="compare-item-pill">
                                <img src={(car.images && car.images.length > 0) ? car.images[0] : ''} alt={car.name} className="pill-img" />
                                <span className="pill-name">{car.name}</span>
                                <button 
                                    className="pill-remove" 
                                    onClick={() => removeFromCompare(car.id)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="compare-bar-actions">
                        <button className="clear-btn" onClick={() => navigate('/cars')}>Back to Listings</button>
                        <button 
                            className="compare-now-btn" 
                            disabled={selectedCars.length < 2}
                            onClick={() => navigate('/compare')}
                        >
                            Compare Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompareBar;
