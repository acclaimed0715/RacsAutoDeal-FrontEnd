import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type Inquiry } from '../../types';

const InquiriesView: React.FC = () => {
    const { inquiries, sendReply } = useInventory();
    const [activeTab, setActiveTab] = useState<'PENDING' | 'REPLIED'>('PENDING');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Keep the opened modal fresh using the global context heartbeat (live updates)
    useEffect(() => {
        if (selectedInquiry) {
            const fresh = inquiries.find(i => i.id === selectedInquiry.id);
            if (fresh && (fresh.replyMessage !== selectedInquiry.replyMessage || fresh.status !== selectedInquiry.status)) {
                setSelectedInquiry(fresh);
            }
        }
    }, [inquiries, selectedInquiry]);

    const pending = inquiries.filter(i => (i.status || 'PENDING') === 'PENDING');
    const replied = inquiries.filter(i => i.status === 'REPLIED');

    const visible = activeTab === 'PENDING' ? pending : replied;

    const handleSendReply = async () => {
        if (!selectedInquiry || !replyText.trim()) return;
        
        setIsSubmitting(true);
        try {
            await sendReply(selectedInquiry.id, replyText);
            setReplyText('');
            setSelectedInquiry(null);
            setActiveTab('REPLIED');
        } catch (error: any) {
            console.error('Send Reply Error:', error);
            const msg = error.response?.data?.details || error.response?.data?.error || error.message || 'Unknown error';
            alert(`Failed to send reply: ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="reports-view inquiries-admin-view">
            <div className="page-header">
                <h1>Customer Inquiries</h1>
                <p className="stats-text">{pending.length} new inquiries, {replied.length} replied</p>
            </div>

            <div className="report-tabs">
                <button
                    type="button"
                    className={`report-tab${activeTab === 'PENDING' ? ' active' : ''}`}
                    onClick={() => setActiveTab('PENDING')}
                >
                    Pending <span className="report-tab-count">{pending.length}</span>
                </button>
                <button
                    type="button"
                    className={`report-tab${activeTab === 'REPLIED' ? ' active' : ''}`}
                    onClick={() => setActiveTab('REPLIED')}
                >
                    Replied <span className="report-tab-count">{replied.length}</span>
                </button>
            </div>

            <div className="table-container">
                <table className="reports-table premium-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Vehicle</th>
                            <th>Received At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                    No inquiries found in this category.
                                </td>
                            </tr>
                        ) : visible.map(inquiry => (
                            <tr key={inquiry.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar">{inquiry.userEmail[0].toUpperCase()}</div>
                                        <div className="user-info-text">
                                            <span className="fullname">{inquiry.userEmail}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{inquiry.carName}</span>
                                </td>
                                <td>{formatDate(inquiry.createdAt)}</td>
                                <td>
                                    <span className={`status-badge ${inquiry.status === 'PENDING' ? 'pending' : 'resolved'}`}>
                                        {inquiry.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-row">
                                        <button
                                            className="icon-btn"
                                            title={inquiry.status === 'PENDING' ? "Reply" : "View History"}
                                            onClick={() => {
                                                setSelectedInquiry(inquiry);
                                                setReplyText(''); // Always start with blank reply box
                                            }}
                                        >
                                            <i className={`fa-solid ${inquiry.status === 'PENDING' ? 'fa-reply' : 'fa-clock-rotate-left'}`}></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedInquiry && (
                <>
                    <div className="admin-modal-overlay active" onClick={() => setSelectedInquiry(null)}></div>
                    <div className="user-modal active" style={{ display: 'block', maxWidth: '1000px', width: '95%' }}>
                        <div className="user-modal-header">
                            <h3>{selectedInquiry.status === 'PENDING' ? 'Reply to Inquiry' : 'Inquiry History'}</h3>
                            <span className="close-user-modal" onClick={() => setSelectedInquiry(null)}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <div className="user-modal-body" style={{ color: 'var(--text-secondary)' }}>
                            <div className="inquiry-thread" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Customer Message */}
                                <div className="inquiry-message customer" style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                        <strong style={{ color: 'white' }}>{selectedInquiry.userEmail}</strong>
                                        <span>{formatDate(selectedInquiry.createdAt)}</span>
                                    </div>
                                    <div style={{ background: 'var(--border)', padding: '15px', borderRadius: '12px 12px 12px 0', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {selectedInquiry.message}
                                    </div>
                                </div>

                                {/* Conversation History */}
                                {selectedInquiry.replyMessage && (
                                    <div className="history-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {(() => {
                                            const history = selectedInquiry.replyMessage;
                                            
                                            // Ensure there's a delimiter match, otherwise fallback to simple text block
                                            if (!history.includes('] Admin:') && !history.includes('] Customer:')) {
                                                return (
                                                    <div className="inquiry-message admin" style={{ alignSelf: 'flex-end', maxWidth: '90%' }}>
                                                        <div style={{ background: 'var(--primary)', color: 'white', padding: '15px', borderRadius: '12px 12px 0 12px', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                                                            {history}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Split text block by timestamps and parse
                                            const segments = history.split(/(?=\[[A-Z][a-z]{2,8} \d{1,2}, \d{2}:\d{2} [AP]M\] (?:Admin|Customer):)/);
                                            
                                            return segments.map((seg, idx) => {
                                                const text = seg.trim();
                                                if (!text) return null;
                                                
                                                const metaMatch = text.match(/\[(.*?)\] (Admin|Customer):\n([\s\S]*)/);
                                                if (metaMatch) {
                                                    const date = metaMatch[1];
                                                    const isCustomer = metaMatch[2] === 'Customer';
                                                    const body = metaMatch[3];
                                                    
                                                    return (
                                                        <div key={idx} className={`inquiry-message ${isCustomer ? 'customer' : 'admin'}`} style={{ alignSelf: isCustomer ? 'flex-start' : 'flex-end', maxWidth: '90%' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', opacity: 0.8 }}>
                                                                {!isCustomer && <span style={{ color: 'var(--text-secondary)' }}>{date}</span>}
                                                                <strong style={{ color: isCustomer ? 'white' : 'var(--primary)', marginLeft: isCustomer ? 0 : '10px' }}>
                                                                    {isCustomer ? 'Customer' : 'You (Admin)'}
                                                                </strong>
                                                                {isCustomer && <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>{date}</span>}
                                                            </div>
                                                            <div style={{ 
                                                                background: isCustomer ? 'var(--border)' : 'var(--primary)', 
                                                                color: isCustomer ? 'var(--text-secondary)' : 'white', 
                                                                padding: '15px', 
                                                                borderRadius: isCustomer ? '12px 12px 12px 0' : '12px 12px 0 12px', 
                                                                border: isCustomer ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                                opacity: 0.9, 
                                                                whiteSpace: 'pre-wrap' 
                                                            }}>
                                                                {body.trim()}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return <div key={idx}>{text}</div>;
                                            });
                                        })()}
                                    </div>
                                )}

                                {/* Writing Reply (Always available now) */}
                                <div className="reply-editor" style={{ marginTop: '20px' }}>
                                    <label style={{ color: 'white', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                                        {selectedInquiry.status === 'REPLIED' ? 'Send another email:' : 'Your Response:'}
                                    </label>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your professional response here..."
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            padding: '15px',
                                            color: 'white',
                                            outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="user-modal-footer">
                            <button type="button" className="user-cancel-btn" onClick={() => setSelectedInquiry(null)}>
                                Close
                            </button>
                            <button 
                                type="button" 
                                className="resolve-btn" 
                                onClick={handleSendReply}
                                disabled={isSubmitting || !replyText.trim()}
                            >
                                {isSubmitting ? 'Sending...' : (selectedInquiry.status === 'REPLIED' ? 'Send Follow-up' : 'Send Reply')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InquiriesView;
