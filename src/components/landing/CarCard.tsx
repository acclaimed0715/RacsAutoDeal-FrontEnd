import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Vehicle } from '../../types';
import { formatListingPosted } from '../../utils/listingTime';
import { formatPrice } from '../../utils/format';
import { useCompare } from '../../context/CompareContext';

interface CarCardProps {
    car: Vehicle;
    viewMode?: 'list' | 'grid';
}

const CarCard: React.FC<CarCardProps> = ({ car, viewMode = 'list' }) => {
    const navigate = useNavigate();
    const { isInCompare, addToCompare, removeFromCompare } = useCompare();
    
    const isSelected = isInCompare(car.id);

    const handleCompareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSelected) {
            removeFromCompare(car.id);
        } else {
            addToCompare(car);
        }
    };

    const getBadges = () => {
        const badges: React.ReactNode[] = [];
// ... (rest of getBadges same)

        // Negotiating status — shown prominently
        if (car.status === 'negotiating') {
            badges.push(
                <span key="negotiating" className="car-badge badge-negotiating">
                    <i className="fa-solid fa-handshake"></i> In Negotiation
                </span>
            );
        }
        
        // 1. New Badge (less than 5 days) — only if not negotiating
        if (car.status !== 'negotiating' && car.createdAt) {
            const created = new Date(car.createdAt);
            const now = new Date();
            const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
            if (diffDays < 5) {
                badges.push(
                    <span key="new" className="car-badge badge-new">
                        <i className="fa-solid fa-arrow-trend-up"></i> New
                    </span>
                );
            }
        }

        // 2. Best Deal Badge (from backend)
        if (car.isBestDeal) {
            badges.push(
                <span key="best-deal" className="car-badge badge-best-deal">
                    <i className="fa-regular fa-star"></i> Best Deal
                </span>
            );
        }

        if (car.id === 'escape2012_titanium')
            badges.push(<span key="most-clicked" className="car-badge badge-most-clicked"><i className="fa-solid fa-hand-pointer"></i> Most Clicked</span>);
        
        if (car.id === 'tesla_plaid' || car.id === 'porsche_taycan' || car.fuelType.toLowerCase().includes('electric'))
            badges.push(<span key="ev" className="car-badge badge-electric" style={{ background: '#00d2ff', color: '#000' }}><i className="fa-solid fa-bolt"></i> EV</span>);

        return badges.length > 0 ? <div className="badges-container">{badges}</div> : null;
    };

    const isAuto = car.transmission.toLowerCase().includes('auto') || car.transmission.toLowerCase().includes('cvt');

    if (viewMode === 'grid') {
        return (
            <div className="car-card car-card--grid" onClick={() => navigate(`/car/${car.id}`)}>  
                {/* Image */}
                <div className="car-image-wrapper">
                    {getBadges()}
                    <button 
                        className={`card-compare-btn ${isSelected ? 'active' : ''} ${!isSelected ? 'pulse-on-idle' : ''}`}
                        onClick={handleCompareClick}
                        title="Compare this vehicle"
                    >
                        {isSelected ? <i className="fa-solid fa-right-left"></i> : <i className="fa-solid fa-chart-simple"></i>}
                    </button>
                    <img src={car.images[0]} alt={car.name} className="car-image" />
                </div>

                {/* Info */}
                <div className="grid-card-body">
                    {/* Name + Color + Price row */}
                    <div className="grid-card-top">
                        <div className="grid-card-name-row">
                            <h3 className="card-name">{car.name}</h3>
                            {car.color && (
                                <div
                                    style={{
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: car.color.toLowerCase(),
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: `0 0 5px ${car.color.toLowerCase()}`,
                                        flexShrink: 0,
                                    }}
                                    title={`Color: ${car.color}`}
                                />
                            )}
                        </div>
                        <div className="grid-card-price">{formatPrice(car.price)}</div>
                    </div>

                    {/* Spec chips */}
                    <div className="grid-spec-row">
                        <span className="grid-spec-chip">
                            <i className="fa-solid fa-gears"></i>
                            {isAuto ? 'Automatic' : 'Manual'}
                        </span>
                        <span className="grid-spec-chip">
                            <i className="fa-solid fa-gas-pump"></i>
                            {car.fuelType.split(' ')[0]}
                        </span>
                        <span className="grid-spec-chip">
                            <i className="fa-regular fa-calendar"></i>
                            {car.modelYear}
                        </span>
                        <span className="grid-spec-chip">
                            <i className="fa-solid fa-gauge"></i>
                            {car.mileage ? car.mileage : 'N/A'}
                        </span>
                    </div>

                    {/* Posted time */}
                    <div className="grid-card-footer">
                        <span className="card-posted-compact">
                            <i className="fa-regular fa-clock"></i>
                            {formatListingPosted(car)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // --- List view (original layout) ---
    return (
<div className="car-card" onClick={() => navigate(`/car/${car.id}`)}>
            <div className="car-image-wrapper">
                {getBadges()}
                <button 
                    className={`card-compare-btn ${isSelected ? 'active' : ''} ${!isSelected ? 'pulse-on-idle' : ''}`}
                    onClick={handleCompareClick}
                    title="Compare this vehicle"
                >
                    {isSelected ? <i className="fa-solid fa-right-left"></i> : <i className="fa-solid fa-chart-simple"></i>}
                </button>
                <img src={car.images[0]} alt={car.name} className="car-image" />
            </div>
            <div className="car-card-middle">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 className="card-name" style={{ margin: 0 }}>{car.name}</h3>
                    {car.color && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`Color: ${car.color}`}>
                            <div style={{ 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                background: car.color.toLowerCase(),
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: `0 0 5px ${car.color.toLowerCase()}`
                            }}></div>
                        </div>
                    )}
                </div>
                <p className="card-description clamped-desc">{car.description}</p>
                <div className="card-features-row">
                    <div className="card-feat-compact">
                        <span><i className="fa-regular fa-calendar"></i> Year</span>
                        <b>{car.modelYear}</b>
                    </div>
                    <div className="card-feat-compact">
                        <span><i className="fa-solid fa-gauge"></i> Mileage</span>
                        <b>{car.mileage || 'N/A'}</b>
                    </div>
                    <div className="card-feat-compact">
                        <span><i className="fa-solid fa-gas-pump"></i> Fuel</span>
                        <b>{car.fuelType.split(' ')[0]}</b>
                    </div>
                    <div className="card-feat-compact">
                        <span><i className="fa-solid fa-gears"></i> Trans</span>
                        <b>{isAuto ? 'Auto' : 'Manual'}</b>
                    </div>
                </div>
            </div>
            <div className="car-card-right">
                <div className="card-price">{formatPrice(car.price)}</div>
                <div className="card-posted-compact"><i className="fa-regular fa-clock"></i> {formatListingPosted(car)}</div>
            </div>
        </div>
    );
};

export default CarCard;
