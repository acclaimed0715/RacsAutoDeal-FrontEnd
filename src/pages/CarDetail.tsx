import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { type Vehicle } from '../types';
import { formatListingPosted } from '../utils/listingTime';
import { formatPrice } from '../utils/format';

const CarDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { cars, isLoading, addInquiry } = useInventory();
    
    const [car, setCar] = useState<Vehicle | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'otherFeatures'>('description');
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailFrom, setEmailFrom] = useState('');
    const [isSending, setIsSending] = useState(false);


    useEffect(() => {
        if (id && cars[id]) {
            setCar(cars[id]);
        }
    }, [id, cars]);

    if (isLoading) return <div className="loading-screen">Loading vehicle details...</div>;
    if (!car) return (
        <div className="error-page" style={{ padding: '100px', textAlign: 'center' }}>
            <h2>Vehicle Not Found</h2>
            <button onClick={() => navigate('/cars')} className="message-dealer-btn" style={{ marginTop: '20px' }}>Back to Inventory</button>
        </div>
    );
    if (car.isArchived) return (
        <div className="landing-page">
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
                <i className="fa-solid fa-circle-xmark" style={{ fontSize: '4rem', color: 'var(--primary)' }}></i>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>This car has been sold</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>This listing is no longer available. Browse our current inventory for similar vehicles.</p>
                <button onClick={() => navigate('/cars')} className="message-dealer-btn">Browse Inventory</button>
            </div>
            <Footer />
        </div>
    );

    const nextImg = () => setCurrentImgIdx((currentImgIdx + 1) % car.images.length);
    const prevImg = () => setCurrentImgIdx((currentImgIdx - 1 + car.images.length) % car.images.length);

    const handleInquire = () => {
        setIsEmailOpen(true);
    };

    const sendInquiry = async () => {
        if (!emailFrom) {
            alert('Please provide your email address.');
            return;
        }
        if (!car) return;

        setIsSending(true);
        try {
            const message = `Hi, I'm interested in this ${car.name}. Is it still available for viewing?`;
            await addInquiry(car.id, car.name, emailFrom, message);
            alert(`Inquiry for ${car.name} sent! Please check your email for confirmation.`);
            setIsEmailOpen(false);
            setEmailFrom('');
        } catch (error) {
            alert('Failed to send inquiry. Please try again later.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="landing-page dark-mode">
            <Navbar />
            
            <main className="car-detail-page" style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '100vh', background: 'var(--surface)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    
                    <button onClick={() => navigate(-1)} className="back-link" style={{ 
                        background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1rem'
                    }}>
                        <i className="fa-solid fa-arrow-left"></i> Back to Listing
                    </button>

                    <div className="car-detail-header" style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
                            <div>
                                <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, color: 'white' }}>{car.name} {car.modelYear}</h1>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span><i className="fa-regular fa-clock" style={{ marginRight: '6px' }}></i> {formatListingPosted(car)}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2.8rem', color: 'var(--primary)', fontWeight: '900', lineHeight: 1 }}>{formatPrice(car.price)}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Excluding Registration & Fees</div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '30px', alignItems: 'start' }}>
                        <div className="detail-media-section">
                            <div className="preview-image-wrapper" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', background: '#1a1a1a', border: '1px solid var(--border)' }}>
                                <div className="carousel-container" style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <button className="carousel-btn prev-btn" onClick={prevImg} disabled={car.images.length <= 1} style={{ position: 'absolute', left: '20px', zIndex: 10 }}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <img 
                                        src={car.images[currentImgIdx]} 
                                        alt={car.name} 
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '20px' }} 
                                    />
                                    <button className="carousel-btn next-btn" onClick={nextImg} disabled={car.images.length <= 1} style={{ position: 'absolute', right: '20px', zIndex: 10 }}>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div className="carousel-dots" style={{ position: 'absolute', bottom: '25px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                    {car.images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`dot ${idx === currentImgIdx ? 'active' : ''}`}
                                            onClick={() => setCurrentImgIdx(idx)}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="detail-info-section" style={{ background: 'var(--card-bg)', padding: '35px', borderRadius: '24px', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ height: '2px', width: '20px', background: 'var(--primary)' }}></div>
                                Specifications
                            </div>
                            <div className="main-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '35px' }}>
                                <div className="feature-block">
                                    <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary)' }}></i>
                                    <span>{car.modelYear} Model</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gauge-high" style={{ color: 'var(--primary)' }}></i>
                                    <span>{car.mileage || 'N/A' }</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gear" style={{ color: 'var(--primary)' }}></i>
                                    <span>{car.transmission}</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gas-pump" style={{ color: 'var(--primary)' }}></i>
                                    <span>{car.fuelType}</span>
                                </div>
                            </div>

                            <div className="tabs-header" style={{ marginBottom: '25px' }}>
                                <div className={`tab-item ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
                                    Overview
                                    <div className="tab-underline"></div>
                                </div>
                                <div className={`tab-item ${activeTab === 'otherFeatures' ? 'active' : ''}`} onClick={() => setActiveTab('otherFeatures')}>
                                    Technical Specs
                                    <div className="tab-underline"></div>
                                </div>
                            </div>

                            <div className="detail-tab-content" style={{ minHeight: '200px' }}>
                                <div className={`tab-content ${activeTab === 'description' ? 'active' : ''}`}>
                                    <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                                        {car.description || 'No description available for this vehicle.'}
                                    </p>
                                </div>

                                <div className={`tab-content ${activeTab === 'otherFeatures' ? 'active' : ''}`}>
                                    <ul className="car-specs-list" style={{ margin: 0 }}>
                                        <li><strong>Engine</strong> <span>{car.engine || 'Standard'}</span></li>
                                        <li><strong>Horsepower</strong> <span>{car.hp || 'Standard'}</span></li>
                                        <li><strong>Torque</strong> <span>{car.torque || 'Standard'}</span></li>
                                        <li><strong>Transmission</strong> <span>{car.transmission}</span></li>
                                        <li><strong>Seating</strong> <span>{car.seating || 'Standard'}</span></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="inquiry-card" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
                                <button className="message-dealer-btn" onClick={handleInquire} style={{ width: '100%', height: '65px', borderRadius: '15px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                    <i className="fa-solid fa-envelope"></i> Inquire Now
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-shield-check" style={{ color: '#22c55e' }}></i>
                                    <span>Verified Dealer • Racs Auto Deal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Email Composer Modal */}
            {isEmailOpen && (
                <div className="email-composer active" id="emailComposer" style={{ display: 'flex' }}>
                    <div className="composer-header">
                        <span>New Message</span>
                        <div className="composer-actions">
                            <i className="fa-solid fa-minus"></i>
                            <i className="fa-solid fa-expand"></i>
                            <i className="fa-solid fa-xmark" onClick={() => setIsEmailOpen(false)}></i>
                        </div>
                    </div>
                    <div className="composer-body">
                        <div className="composer-field">
                            <span>From</span>
                            <input type="email" value={emailFrom} onChange={e => setEmailFrom(e.target.value)} placeholder="Your Email" />
                        </div>
                        <div className="composer-field">
                            <span>To</span>
                            <input type="text" value="sales@racsautodeal.com" readOnly />
                        </div>
                        <div className="composer-field">
                            <span>Subject</span>
                            <input type="text" value={`Inquiry: ${car.name}`} readOnly />
                        </div>
                        
                        <div className="composer-content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div 
                                className="composer-textarea" 
                                contentEditable={true}
                                onInput={() => {
                                }}
                                style={{ 
                                    flex: 1, 
                                    padding: '20px',
                                    paddingBottom: '100px',
                                    outline: 'none',
                                    color: '#333',
                                    whiteSpace: 'pre-wrap',
                                    overflowY: 'auto',
                                    fontSize: '15px',
                                    lineHeight: '1.6',
                                    background: '#fff',
                                    textAlign: 'left',
                                    display: 'block'
                                }}
                            >
                                <b>{car.name.toUpperCase()}</b> Inquiry
                                <br/><br/>
                                <b>Details:</b>
                                <br/>
                                • Price: {formatPrice(car.price)}
                                <br/>
                                • Model Year: {car.modelYear}
                                <br/>
                                • Mileage: {car.mileage || 'N/A'}
                                <br/>
                                • Transmission: {car.transmission}
                                <br/><br/>
                                <b>Vehicle Link:</b> <a href={window.location.href} style={{ color: '#0b57d0', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{window.location.href}</a>
                                <br/><br/>
                                Hi, I'm interested in this {car.name}. Is it still available for viewing?
                            </div>

                            {/* ATTACHMENT CHIP */}
                            <a 
                                href={window.location.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="attachment-chip" 
                                style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(56, 189, 248, 0.3)',
                                    maxWidth: '300px',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s, transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
                            >
                                <img src={car.images[0]} alt="" style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <i className="fa-solid fa-link" style={{ marginRight: '5px' }}></i> Vehicle Details Link
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Click to view original listing</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="composer-footer">
                        <button className="compose-send-btn" onClick={sendInquiry} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                        <div className="footer-icons">
                            <i className="fa-solid fa-font"></i>
                            <i className="fa-solid fa-link" style={{ color: '#38bdf8' }}></i>
                            <i className="fa-solid fa-paperclip"></i>
                            <i className="fa-solid fa-face-smile"></i>
                            <i className="fa-solid fa-image"></i>
                        </div>
                        <i className="fa-solid fa-trash-can composer-delete" onClick={() => setIsEmailOpen(false)}></i>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default CarDetail;
