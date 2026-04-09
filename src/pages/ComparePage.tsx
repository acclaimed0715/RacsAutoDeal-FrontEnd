import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { formatPrice } from '../utils/format';
import { motion } from 'framer-motion';

const ComparePage: React.FC = () => {
    const { selectedCars, removeFromCompare, clearCompare } = useCompare();
    const navigate = useNavigate();

    const specs = [
        { label: 'Price', key: 'price', format: (v: string) => formatPrice(v) },
        { label: 'Model Year', key: 'modelYear' },
        { label: 'Mileage', key: 'mileage' },
        { label: 'Transmission', key: 'transmission' },
        { label: 'Fuel Type', key: 'fuelType' },
        { 
            label: 'Vehicle Type', 
            key: 'type',
            render: (val: string) => val ? <span className="feature-pill-small">{val}</span> : '—'
        },
        { 
            label: 'Color', 
            key: 'color', 
            render: (val: string) => (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                        width: '14px', 
                        height: '14px', 
                        borderRadius: '50%', 
                        background: val?.toLowerCase() || 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}></div>
                    <span>{val || '—'}</span>
                </div>
            )
        },
        { label: 'Engine', key: 'engine' },
    ];

    if (selectedCars.length === 0) {
// ... (rest of component)
        return (
            <div className="compare-empty-state">
                <div className="compare-page-container">
                    <div className="compare-header">
                        <h1 className="compare-title">Vehicle Comparison</h1>
                        <p className="compare-subtitle">No cars selected for comparison. Go back and select some!</p>
                        <button className="compare-now-btn" style={{marginTop: '30px'}} onClick={() => navigate('/cars')}>
                            Browse Inventory
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="compare-page-container">
            <div className="compare-header">
                <motion.h1 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="compare-title"
                >
                    Compare Vehicles
                </motion.h1>
                <motion.p 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="compare-subtitle"
                >
                    Side-by-side analysis of your top picks.
                </motion.p>
            </div>

            <div className="compare-table-wrapper">
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th className="table-label">Features</th>
                            {selectedCars.map((car) => (
                                <th key={car.id} className="table-cell table-cell-header">
                                    <div className="header-car-card">
                                        <img src={car.images[0]} alt={car.name} className="header-car-img" />
                                        <div className="header-car-name">{car.name}</div>
                                        <div className="header-car-price">{formatPrice(car.price)}</div>
                                        <button 
                                            className="remove-car-btn"
                                            onClick={() => removeFromCompare(car.id)}
                                        >
                                            <i className="fa-solid fa-trash-can"></i> Remove
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((spec) => (
                            <tr key={spec.key} className="table-row">
                                <td className="table-label">{spec.label}</td>
                                {selectedCars.map((car) => (
                                    <td key={`${car.id}-${spec.key}`} className="table-cell">
                                        <span className="spec-val">
                                            {spec.render 
                                                ? spec.render((car as any)[spec.key]) 
                                                : (spec.format ? spec.format((car as any)[spec.key]) : (car as any)[spec.key] || '—')}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* Action Row */}
                        <tr>
                            <td className="table-label">Actions</td>
                            {selectedCars.map((car) => (
                                <td key={`action-${car.id}`} className="table-cell">
                                    <button 
                                        className="compare-now-btn" 
                                        onClick={() => navigate(`/car/${car.id}`)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <button className="compare-now-btn" onClick={() => navigate('/cars')}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '10px' }}></i> Add More Cars to Compare
                </button>
                <button className="clear-btn" onClick={clearCompare} style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    Clear All Selection
                </button>
            </div>
        </div>
    );
};

export default ComparePage;
