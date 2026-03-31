import React, { useState } from 'react';
import { type Vehicle } from '../../types';

interface CarPreviewModalProps {
    car: Vehicle;
    isOpen: boolean;
    onClose: () => void;
}

const CarPreviewModal: React.FC<CarPreviewModalProps> = ({ car, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'otherFeatures'>('description');
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [emailFrom, setEmailFrom] = useState('');
    const [emailMsg, setEmailMsg] = useState('');

    if (!isOpen) return null;

    const nextImg = () => setCurrentImgIdx((currentImgIdx + 1) % car.images.length);
    const prevImg = () => setCurrentImgIdx((currentImgIdx - 1 + car.images.length) % car.images.length);

    const handleInquire = () => {
        setIsEmailOpen(true);
        const carUrl = `${window.location.origin}/cars?carId=${car.id}`;
        const details = `
-----------------------------------------
VEHICLE INTEREST: ${car.name.toUpperCase()}
-----------------------------------------
Price: ${car.price}
Model Year: ${car.modelYear}
Mileage: ${car.mileage || 'N/A'}
Transmission: ${car.transmission}
Fuel Type: ${car.fuelType}
Engine: ${car.engine || 'Standard'}
-----------------------------------------
Vehicle Link: ${carUrl}
-----------------------------------------

Hi, I'm interested in this ${car.name}. Is it still available for viewing?`;
        setEmailMsg(details.trim());
    };

    const sendInquiry = () => {
        if (!emailFrom) {
            alert('Please provide your email address.');
            return;
        }
        alert(`Inquiry for ${car.name} sent to dealer!`);
        setIsEmailOpen(false);
        setEmailFrom('');
    };

    return (
        <>
            <div className="preview-overlay active" onClick={onClose}></div>
            <div className="preview-modal active">
                <div className="preview-modal-content">
                    <span className="close-preview-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></span>

                    <div className="preview-container">
                        <div className="preview-left">
                            <div className="preview-image-wrapper">
                                <div className="carousel-container">
                                    <button className="carousel-btn prev-btn" onClick={prevImg} disabled={car.images.length <= 1}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <img 
                                        src={car.images[currentImgIdx]} 
                                        alt={car.name} 
                                        style={{ transition: 'opacity 0.3s' }} 
                                    />
                                    <button className="carousel-btn next-btn" onClick={nextImg} disabled={car.images.length <= 1}>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div className="carousel-dots">
                                    {car.images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`dot ${idx === currentImgIdx ? 'active' : ''}`}
                                            onClick={() => setCurrentImgIdx(idx)}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="preview-car-info">
                                <div className="title-price-row">
                                    <h1>{car.name}</h1>
                                    <span className="modal-price">{car.price}</span>
                                </div>
                                <span>{car.posted || 'Recently Added'}</span>
                            </div>
                        </div>

                        <div className="preview-right">
                            <div className="main-features-grid">
                                <div className="feature-block">
                                    <i className="fa-solid fa-car"></i>
                                    <span>{car.modelYear} Model</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gauge"></i>
                                    <span>{car.mileage || 'N/A'}</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gears"></i>
                                    <span>{car.transmission}</span>
                                </div>
                                <div className="feature-block">
                                    <i className="fa-solid fa-gas-pump"></i>
                                    <span>{car.fuelType}</span>
                                </div>
                            </div>

                            <div className="tabs-header">
                                <div className={`tab-item ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
                                    Description <div className="tab-underline"></div>
                                </div>
                                <div className={`tab-item ${activeTab === 'otherFeatures' ? 'active' : ''}`} onClick={() => setActiveTab('otherFeatures')}>
                                    Other Features <div className="tab-underline"></div>
                                </div>
                            </div>

                            <div className={`tab-content ${activeTab === 'description' ? 'active' : ''}`}>
                                <div className="description-wrapper">
                                    <p className="modal-description">{car.description}</p>
                                </div>
                            </div>

                            <div className={`tab-content ${activeTab === 'otherFeatures' ? 'active' : ''}`}>
                                <ul className="car-specs-list other-features-list">
                                    <li><strong>Engine:</strong> <span>{car.engine || 'Standard'}</span></li>
                                    <li><strong>HP:</strong> <span>{car.hp || 'Standard'}</span></li>
                                    <li><strong>Torque:</strong> <span>{car.torque || 'Standard'}</span></li>
                                    <li><strong>Safety:</strong> <span>{car.safety || 'Standard'}</span></li>
                                    <li><strong>Seating:</strong> <span>{car.seating || 'Standard'}</span></li>
                                </ul>
                            </div>

                            <div className="dealer-action">
                                <button className="message-dealer-btn" onClick={handleInquire}>Inquire</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            <textarea 
                                className="composer-textarea" 
                                value={emailMsg} 
                                onChange={e => setEmailMsg(e.target.value)}
                                style={{ flex: 1, paddingBottom: '80px' }}
                            ></textarea>

                            {/* ATTACHMENT CHIP */}
                            <div className="attachment-chip" style={{
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
                                maxWidth: '300px'
                            }}>
                                <img src={car.images[0]} alt="" style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <i className="fa-solid fa-link" style={{ marginRight: '5px' }}></i> Vehicle Details Link
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Click to view original listing</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="composer-footer">
                        <button className="compose-send-btn" onClick={sendInquiry}>Send</button>
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
        </>
    );
};

export default CarPreviewModal;
