import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const SupportSection: React.FC = () => {
    const { addReport } = useInventory();
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [issue, setIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newReport = {
            id: 'rep_' + Date.now(),
            userName: email.split('@')[0],
            userEmail: email,
            reason: reason,
            description: issue,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'PENDING' as const
        };

        setTimeout(() => {
            addReport(newReport);
            setIsSubmitting(false);
            setIsReportOpen(false);
            setEmail('');
            setReason('');
            setIssue('');
            alert('Report submitted successfully!');
        }, 1000);
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
                                    <textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="Enter details here..." rows={5}></textarea>
                                </div>

                                <button type="submit" className="report-submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default SupportSection;
