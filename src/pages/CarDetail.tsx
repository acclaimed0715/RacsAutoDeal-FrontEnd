import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useInquiry } from '../context/InquiryContext';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { type Vehicle } from '../types';
import { formatListingPosted } from '../utils/listingTime';
import { formatPrice } from '../utils/format';

const CarDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { cars, isLoading, addReport } = useInventory();
    const { openInquiry } = useInquiry();
    
    const [car, setCar] = useState<Vehicle | null>(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);

    // Swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Report States
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportEmail, setReportEmail] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [reportIssue, setReportIssue] = useState('');
    const [reportPhoto, setReportPhoto] = useState<File | null>(null);
    const [reportPhotoError, setReportPhotoError] = useState('');
    const [isReportSubmitting, setIsReportSubmitting] = useState(false);
    const [showReportSuccess, setShowReportSuccess] = useState(false);


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

    const nextImg = () => setCurrentImgIdx((prev) => (prev + 1) % car.images.length);
    const prevImg = () => setCurrentImgIdx((prev) => (prev - 1 + car.images.length) % car.images.length);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEndAction = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) nextImg();
        if (distance < -50) prevImg();
    };

    const navBtnStyle = {
        position: 'absolute' as const,
        zIndex: 10,
        background: 'transparent',
        color: 'rgba(255,255,255,0.6)',
        border: 'none',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'color 0.3s',
        fontSize: '1.8rem',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
    };

    const handleInquire = () => {
        if (car) openInquiry(car);
    };

    const handleReportPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReportPhotoError('');
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setReportPhotoError('Photo must be less than 5MB');
                setReportPhoto(null);
                e.target.value = '';
            } else {
                setReportPhoto(file);
            }
        }
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!car) return;
        setIsReportSubmitting(true);
        
        let photoData = '';
        if (reportPhoto) {
            try {
                photoData = await readFileAsDataURL(reportPhoto);
            } catch (err) {
                console.error("Failed to read photo", err);
            }
        }

        const newReport = {
            id: 'rep_' + Date.now(),
            userName: reportEmail.split('@')[0],
            userEmail: reportEmail,
            reason: reportReason,
            description: `[CAR: ${car.name} (${car.id})] ${reportIssue}`,
            photoData: photoData || undefined,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'PENDING' as const
        };

        await addReport(newReport);
        setIsReportSubmitting(false);
        setIsReportOpen(false);
        setReportEmail('');
        setReportReason('');
        setReportIssue('');
        setReportPhoto(null);
        setShowReportSuccess(true);
    };

    return (
        <div className="landing-page dark-mode">
            <Navbar />
            
            <main className="car-detail-main">
                <div className="detail-container">
                    
                    <button onClick={() => navigate('/cars')} className="back-link-btn">
                        <i className="fa-solid fa-arrow-left"></i> Back to Listing
                    </button>



                    <div className="detail-title-section">
                        <div className="detail-header-flex">
                            <h1>{car.name}</h1>
                            <div className="detail-price">{formatPrice(car.price)}</div>
                        </div>
                        <div className="detail-subtitle-row">
                            <div className="detail-verified">
                                <i className="fa-solid fa-shield-check"></i> 
                                Verified Listing • <span className="text-white">Racs Auto Deal</span>
                            </div>
                            <div className="detail-meta-info">
                                <div className="meta-item"><i className="fa-regular fa-clock"></i> Listed {formatListingPosted(car)}</div>
                                <div className="meta-item">Excluding Registration & Fees</div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div className="media-wrapper">
                            <div className="carousel-wrapper">
                                <div 
                                    className="carousel-view" 
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEndAction}
                                >
                                    {car.images.length > 1 && (
                                        <button className="carousel-nav-btn prev" onClick={prevImg}>
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                    )}
                                    <img 
                                        src={car.images[currentImgIdx]} 
                                        alt={car.name} 
                                        className="carousel-img"
                                    />
                                    {car.images.length > 1 && (
                                        <button className="carousel-nav-btn next" onClick={nextImg}>
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="carousel-dots-container">
                                    {car.images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`dot ${idx === currentImgIdx ? 'active' : ''}`}
                                            onClick={() => setCurrentImgIdx(idx)}
                                        ></div>
                                    ))}
                                </div>
                            </div>



                            <div className="desc-section">
                                <div className="section-title-premium">
                                    <div className="title-dash"></div>
                                    Vehicle Overview
                                </div>
                                <div className={`description-wrapper ${isDescriptionExpanded ? 'expanded' : ''}`}>
                                    <p className="description-text">
                                        {car.description || 'No description available for this vehicle.'}
                                    </p>
                                    {!isDescriptionExpanded && car.description && car.description.length > 450 && (
                                        <div className="description-fade"></div>
                                    )}
                                </div>
                                {car.description && car.description.length > 450 && (
                                    <button 
                                        className="read-more-btn" 
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    >
                                        {isDescriptionExpanded ? (
                                            <>Show less <i className="fa-solid fa-chevron-up"></i></>
                                        ) : (
                                            <>Read more <i className="fa-solid fa-chevron-down"></i></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="info-section">
                            <div className="inquiry-box">
                                <button className="message-dealer-btn" onClick={handleInquire}>
                                    <i className="fa-solid fa-envelope"></i> Inquire Now
                                </button>
                                <button className="report-listing-link" onClick={() => setIsReportOpen(true)}>
                                    <i className="fa-solid fa-flag"></i> Submit Report / Report Listing
                                </button>
                            </div>

                            <div className="section-title-premium">
                                <div className="title-dash"></div>
                                Quick Specifications
                            </div>
                            <div className="main-features-grid">
                                <div className="feature-card-premium">
                                    <div className="feature-icon"><i className="fa-solid fa-calendar-days"></i></div>
                                    <div className="feature-info">
                                        <span className="feature-label">Model Year</span>
                                        <span className="feature-value">{car.modelYear}</span>
                                    </div>
                                </div>
                                <div className="feature-card-premium">
                                    <div className="feature-icon"><i className="fa-solid fa-gauge-high"></i></div>
                                    <div className="feature-info">
                                        <span className="feature-label">Mileage</span>
                                        <span className="feature-value">{car.mileage || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="feature-card-premium">
                                    <div className="feature-icon"><i className="fa-solid fa-gear"></i></div>
                                    <div className="feature-info">
                                        <span className="feature-label">Transmission</span>
                                        <span className="feature-value">{car.transmission}</span>
                                    </div>
                                </div>
                                <div className="feature-card-premium">
                                    <div className="feature-icon"><i className="fa-solid fa-gas-pump"></i></div>
                                    <div className="feature-info">
                                        <span className="feature-label">Fuel Type</span>
                                        <span className="feature-value">{car.fuelType}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="section-title-premium secondary">
                                <div className="title-dash"></div>
                                Technical Detail
                            </div>
                            <ul className="car-specs-list">
                                <li><strong>Engine</strong> <span>{car.engine || 'Standard'}</span></li>
                                <li><strong>Horsepower</strong> <span>{car.hp || 'Standard'}</span></li>
                                <li><strong>Torque</strong> <span>{car.torque || 'Standard'}</span></li>
                                <li><strong>Seat</strong> <span>{car.seating || 'Standard'}</span></li>
                                <li><strong>Safety Features</strong> <span>{car.safety || 'Standard'}</span></li>
                                <li><strong>Other Features</strong> <span>{car.otherFeatures?.join(', ') || 'Standard'}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Report Modal */}
            {isReportOpen && (
                <>
                    <div className="report-modal-overlay active" onClick={() => setIsReportOpen(false)}></div>
                    <div className="report-modal active premium-variant" style={{ display: 'block' }}>
                        <div className="report-modal-content">
                            <span className="close-report-btn" onClick={() => setIsReportOpen(false)}><i className="fa-solid fa-xmark"></i></span>
                            <h2>Report Listing</h2>
                            <span className="modal-subtitle">
                                Helping us maintain high quality listings. Please describe the issue with <strong>{car.name}</strong>.
                            </span>
                            <form id="reportForm" onSubmit={handleSubmitReport}>
                                <div className="form-row-premium" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Email Address *</label>
                                        <input type="email" value={reportEmail} onChange={e => setReportEmail(e.target.value)} placeholder="Your email" required />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Reason *</label>
                                        <div className="select-wrapper">
                                            <select value={reportReason} onChange={e => setReportReason(e.target.value)} required>
                                                <option value="" disabled>Select Reason</option>
                                                <option value="Sold Vehicle Still Listed">Sold Vehicle</option>
                                                <option value="Price Discrepancy">Price Issue</option>
                                                <option value="Incorrect Specifications">Spec Error</option>
                                                <option value="Suspicious/Fake Listing">Fake/Scam</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Briefly describe the issue</label>
                                    <textarea value={reportIssue} onChange={e => setReportIssue(e.target.value)} placeholder="What's wrong?" rows={2}></textarea>
                                </div>

                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                    <label>Add Photo (Optional)</label>
                                    <div className="file-upload-wrapper" style={{ position: 'relative' }}>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleReportPhotoChange} 
                                            style={{ 
                                                opacity: 0,
                                                position: 'absolute',
                                                top: 0, left: 0, bottom: 0, right: 0, 
                                                width: '100%', 
                                                cursor: 'pointer',
                                                zIndex: 2
                                            }}
                                        />
                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.02)', 
                                            padding: '0.8rem 1rem', 
                                            borderRadius: '10px', 
                                            border: '1px dashed rgba(255, 255, 255, 0.1)', 
                                            color: 'rgba(255,255,255,0.4)',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            transition: 'border-color 0.3s ease',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            <i className="fa-solid fa-image" style={{ fontSize: '1.2rem', color: reportPhoto ? '#10b981' : 'var(--primary)' }}></i>
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                {reportPhoto ? reportPhoto.name : 'Upload Proof'}
                                            </span>
                                        </div>
                                    </div>
                                    {reportPhotoError && <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '5px' }}>{reportPhotoError}</p>}
                                </div>

                                <button type="submit" className="report-submit-btn" disabled={isReportSubmitting}>
                                    {isReportSubmitting ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {/* Success Modal */}
            {showReportSuccess && (
                <>
                    <div className="report-modal-overlay active" onClick={() => setShowReportSuccess(false)}></div>
                    <div className="report-modal active" style={{ display: 'block', maxWidth: '400px', textAlign: 'center' }}>
                        <div className="report-modal-content" style={{ padding: '3rem 2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>Report Submitted</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Thank you for letting us know. Our team will review your report for <strong>{car.name}</strong> and get back to you shortly.
                            </p>
                            <button 
                                type="button" 
                                className="report-submit-btn" 
                                onClick={() => setShowReportSuccess(false)}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
};

export default CarDetail;
