import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const SupportSection: React.FC = () => {
    const { addReport } = useInventory();
    const location = useLocation();
    const [isReportOpen, setIsReportOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('report') === 'true') {
            setIsReportOpen(true);
            // Optional: Scroll to section if hash exists
            if (location.hash === '#support') {
                const element = document.getElementById('support');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [location]);

    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [issue, setIssue] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoError, setPhotoError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhotoError('');
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setPhotoError('Photo must be less than 5MB');
                setPhoto(null);
                e.target.value = '';
            } else {
                setPhoto(file);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let photoData = '';
        if (photo) {
            try {
                photoData = await readFileAsDataURL(photo);
            } catch (err) {
                console.error("Failed to read photo", err);
            }
        }

        const newReport = {
            id: 'rep_' + Date.now(),
            userName: email.split('@')[0],
            userEmail: email,
            reason: reason,
            description: issue,
            photoData: photoData || undefined,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'PENDING' as const
        };

        await addReport(newReport);
        setIsSubmitting(false);
        setIsReportOpen(false);
        setEmail('');
        setReason('');
        setIssue('');
        setPhoto(null);
        setShowSuccess(true);
    };

    return (
        <section className="support-section" id="support">
            <div className="support-container">
                <div className="section-title">
                    <h2>Help & Support</h2>
                    <p>Everything you need to know about buying and selling with Racs Auto Deal.</p>
                </div>

                <div className="support-grid">
                    <div className="faq-accordion">
                        <h3>Frequently Asked Questions</h3>
                        {[
                            { q: 'How do I book a test drive?', a: 'You can book a test drive by clicking the "Inquire" button on any vehicle page or calling us directly at 0917 110 6548.' },
                            { q: 'Do you offer car financing?', a: 'Yes! We partner with various banks to provide competitive financing options tailored to your budget.' },
                            { q: 'What documents are needed to sell my car?', a: "To sell your car, you'll need the Original OR/CR, valid IDs, and a duly signed Deed of Sale." },
                            { q: 'Are the vehicles in your inventory inspected?', a: 'Absolutely. Every vehicle undergoes a thorough multi-point inspection and detailed reconditioning.' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            >
                                <div className="faq-question">
                                    <span>{item.q}</span>
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                                <div className="faq-answer">
                                    <p>{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="support-actions-side">
                        <button className="report-trigger-btn" onClick={() => setIsReportOpen(true)}>
                            <i className="fa-solid fa-flag"></i>
                            <span>Submit A Report</span>
                        </button>
                        <p className="support-footer-note">Send Report if you have any issues.</p>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {isReportOpen && (
                <>
                    <div className="report-modal-overlay active" onClick={() => setIsReportOpen(false)}></div>
                    <div className="report-modal active" style={{ display: 'block' }}>
                        <div className="report-modal-content">
                            <span className="close-report-btn" onClick={() => setIsReportOpen(false)}><i className="fa-solid fa-xmark"></i></span>
                            <h2>Send Report</h2>

                            <form id="reportForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
                                </div>

                                <div className="form-group">
                                    <label>Reason *</label>
                                    <div className="select-wrapper">
                                        <select value={reason} onChange={e => setReason(e.target.value)} required>
                                            <option value="" disabled>Select Reason</option>
                                            <option value="Inquiry Not Responding">Inquiry Not Responding</option>
                                            <option value="Duplicate Listing">Duplicate Listing</option>
                                            <option value="Sold Vehicle Still Listed">Sold Vehicle Still Listed</option>
                                            <option value="Price Discrepancy">Price Discrepancy</option>
                                            <option value="Technical Issue">Technical Issue</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Describe the issue</label>
                                    <textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="Enter details here..." rows={4}></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Attach Evidence (Photo, Max 5MB)</label>
                                    <div className="file-upload-wrapper" style={{ position: 'relative' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
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
                                            background: 'var(--input-bg)',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            border: '2px dashed var(--border)',
                                            color: 'var(--text-secondary)',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'border-color 0.3s ease',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: photo ? '#10b981' : 'var(--primary)' }}></i>
                                            <span style={{ fontWeight: 500, color: 'white' }}>
                                                {photo ? photo.name : 'Click to Browse Image'}
                                            </span>
                                            {!photo && <span style={{ fontSize: '0.85rem' }}>PNG, JPG up to 5MB</span>}
                                            {photo && <span style={{ fontSize: '0.85rem', color: '#10b981' }}>File selected</span>}
                                        </div>
                                    </div>
                                    {photoError && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '5px' }}>{photoError}</p>}
                                </div>

                                <button type="submit" className="report-submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <>
                    <div className="report-modal-overlay active" onClick={() => setShowSuccess(false)}></div>
                    <div className="report-modal active" style={{ display: 'block', maxWidth: '400px', textAlign: 'center' }}>
                        <div className="report-modal-content" style={{ padding: '3rem 2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h2 style={{ marginBottom: '1rem' }}>Report Submitted</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Thank you for letting us know. Our team will review your report and get back to you shortly.
                            </p>
                            <button
                                type="button"
                                className="report-submit-btn"
                                onClick={() => setShowSuccess(false)}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default SupportSection;
