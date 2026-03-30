import React from 'react';
import { type Vehicle } from '../../types';

interface CarCardProps {
    car: Vehicle;
    onView: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onView }) => {
    const getBadge = () => {
        const id = car.id;
        if (id === 'escape2012')
            return <span className="car-badge badge-best-deal"><i className="fa-regular fa-star"></i> Best Deal</span>;
        if (id === 'escape2012_titanium')
            return <span className="car-badge badge-most-clicked"><i className="fa-solid fa-hand-pointer"></i> Most Clicked</span>;
        if (id === 'livina2023')
            return <span className="car-badge badge-new"><i className="fa-solid fa-arrow-trend-up"></i> New</span>;
        if (id === 'tesla_plaid' || id === 'porsche_taycan')
            return <span className="car-badge badge-electric" style={{ background: '#00d2ff', color: '#000' }}><i className="fa-solid fa-bolt"></i> EV</span>;
        return null;
    };

    const isAuto = car.transmission.toLowerCase().includes('auto') || car.transmission.toLowerCase().includes('cvt');

    return (
        <div className="car-card" onClick={() => onView(car.id)}>
            <div className="car-image-wrapper">
                {getBadge()}
                <img src={car.images[0]} alt={car.name} className="car-image" />
            </div>
            <div className="car-card-middle">
                <h3 className="card-name">{car.name} {car.modelYear}</h3>
                <p className="card-description clamped-desc">{car.description}</p>
                <div className="card-features-row">
                    <div className="card-feat-compact"><span>Year</span><b>{car.modelYear}</b></div>
                    <div className="card-feat-compact"><span>Mileage</span><b>{car.mileage || 'N/A'}</b></div>
                    <div className="card-feat-compact"><span>Fuel</span><b>{car.fuelType.split(' ')[0]}</b></div>
                    <div className="card-feat-compact"><span>Trans</span><b>{isAuto ? 'Auto' : 'Manual'}</b></div>
                </div>
            </div>
            <div className="car-card-right">
                <div className="card-price">{car.price}</div>
                <div className="card-posted-compact"><i className="fa-regular fa-clock"></i> {car.posted || 'Recent'}</div>
            </div>
        </div>
    );
};

export default CarCard;
