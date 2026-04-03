import { useNavigate } from 'react-router-dom';
import { type Vehicle } from '../../types';
import { formatListingPosted } from '../../utils/listingTime';

interface CarCardProps {
    car: Vehicle;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
    const navigate = useNavigate();
    const getBadges = () => {
        const badges: React.ReactNode[] = [];

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

    return (
        <div className="car-card" onClick={() => navigate(`/car/${car.id}`)}>
            <div className="car-image-wrapper">
                {getBadges()}
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
                <div className="card-posted-compact"><i className="fa-regular fa-clock"></i> {formatListingPosted(car)}</div>
            </div>
        </div>
    );
};

export default CarCard;
