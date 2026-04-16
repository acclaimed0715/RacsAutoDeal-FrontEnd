import React, { useState } from 'react';
import { useInquiry, type ActiveInquiry } from '../context/InquiryContext';
import { useInventory } from '../context/InventoryContext';
import { formatPrice } from '../utils/format';

const EmailComposer: React.FC<{ inquiry: ActiveInquiry }> = ({ inquiry }) => {
    const { closeInquiry, toggleMinimize, updateDraft, updateEmail } = useInquiry();
    const { addInquiry } = useInventory();
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!inquiry.userEmail) {
            alert('Please provide your email address.');
            return;
        }
        setIsSending(true);
        try {
            // Re-construct message if draft is empty
            const finalMessage = inquiry.draftMessage || `Hi, I'm interested in this ${inquiry.carName}. Is it still available for viewing?`;
            await addInquiry(inquiry.carId, inquiry.carName, inquiry.userEmail, finalMessage);
            alert(`Success! Inquiry for ${inquiry.carName} sent.`);
            closeInquiry(inquiry.carId);
        } catch (error: any) {
            console.error('Submit Inquiry Error:', error);
            const msg = error.response?.data?.error || error.message || 'Unknown error';
            alert(`Failed to send inquiry: ${msg}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`email-composer active premium-style ${inquiry.isMinimized ? 'minimized' : ''}`} style={{ position: 'relative', bottom: 0, right: 0 }}>
            <div className="composer-header" onClick={() => inquiry.isMinimized && toggleMinimize(inquiry.carId)} style={{ cursor: inquiry.isMinimized ? 'pointer' : 'default' }}>
                <span>{inquiry.isMinimized ? `Inquiry: ${inquiry.carName}` : 'Vehicle Inquiry'}</span>
                <div className="composer-actions">
                    <i className="fa-solid fa-minus" onClick={(e) => { e.stopPropagation(); toggleMinimize(inquiry.carId); }}></i>
                    <i className="fa-solid fa-xmark" onClick={(e) => { e.stopPropagation(); closeInquiry(inquiry.carId); }}></i>
                </div>
            </div>
            
            {!inquiry.isMinimized && (
                <>
                    <div className="composer-body">
                        <div className="composer-field">
                            <span>From</span>
                            <input 
                                type="email" 
                                value={inquiry.userEmail} 
                                onChange={e => updateEmail(inquiry.carId, e.target.value)} 
                                placeholder="Your Email" 
                            />
                        </div>
                        <div className="composer-field">
                            <span>To</span>
                            <input type="text" value="sales@racsautodeal.com" readOnly />
                        </div>
                        <div className="composer-field">
                            <span>Subject</span>
                            <input type="text" value={`Inquiry: ${inquiry.carName}`} readOnly />
                        </div>
                        
                        <div className="composer-content-area">
                            <div 
                                className="composer-textarea" 
                                contentEditable={true}
                                onInput={(e: any) => updateDraft(inquiry.carId, e.target.innerText)}
                                suppressContentEditableWarning={true}
                            >
                                {!inquiry.draftMessage ? (
                                    <>
                                        <b>{inquiry.carName.toUpperCase()}</b> Inquiry
                                        <br/><br/>
                                        <b>Vehicle Details:</b>
                                        <br/>
                                        • Price: {formatPrice(inquiry.carPrice)}
                                        <br/><br/>
                                        Hi, I'm interested in this {inquiry.carName}. Is it still available for viewing?
                                    </>
                                ) : inquiry.draftMessage}
                            </div>
                        </div>
                    </div>
                    <div className="composer-footer">
                        <button className="compose-send-btn" onClick={handleSend} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                        <i className="fa-solid fa-trash-can composer-delete" onClick={() => closeInquiry(inquiry.carId)}></i>
                    </div>
                </>
            )}
        </div>
    );
};

const GlobalInquiryStack: React.FC = () => {
    const { inquiries } = useInquiry();

    if (inquiries.length === 0) return null;

    return (
        <div className="global-inquiry-stack" style={{ 
            position: 'fixed', 
            bottom: 0, 
            right: 0, 
            zIndex: 5000, 
            display: 'flex', 
            flexDirection: 'row-reverse', 
            alignItems: 'flex-end', 
            gap: '20px', 
            paddingRight: '40px',
            pointerEvents: 'none'
        }}>
            {inquiries.map(inquiry => (
                <div key={inquiry.carId} style={{ pointerEvents: 'auto' }}>
                    <EmailComposer inquiry={inquiry} />
                </div>
            ))}
        </div>
    );
};

export default GlobalInquiryStack;
