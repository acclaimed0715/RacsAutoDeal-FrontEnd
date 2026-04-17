import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type Inquiry } from '../../types';

const InquiriesView: React.FC = () => {
    const { inquiries, sendReply, archiveInquiry, deleteInquiry } = useInventory();
    const [activeTab, setActiveTab] = useState<'PENDING' | 'REPLIED' | 'ARCHIVED'>('PENDING');
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const threadEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Keep the opened modal fresh using the global context heartbeat (live updates)
    useEffect(() => {
        if (selectedInquiry) {
            const fresh = inquiries.find(i => i.id === selectedInquiry.id);
            if (fresh) {
                if (fresh.replyMessage !== selectedInquiry.replyMessage || fresh.status !== selectedInquiry.status) {
                    setSelectedInquiry(fresh);
                    // Scroll to bottom when new message arrives in open modal
                    setTimeout(scrollToBottom, 100);
                }
            }
        }
    }, [inquiries, selectedInquiry]);

    // Initial scroll when opening
    useEffect(() => {
        if (selectedInquiry) {
            setTimeout(scrollToBottom, 200);
        }
    }, [selectedInquiry?.id]);

    const pending = inquiries.filter(i => (i.status || 'PENDING') === 'PENDING');
    const replied = inquiries.filter(i => i.status === 'REPLIED');
    const archived = inquiries.filter(i => i.status === 'ARCHIVED');

    const visible = activeTab === 'PENDING' ? pending : activeTab === 'REPLIED' ? replied : archived;

    const handleSendReply = async () => {
        if (!selectedInquiry || !replyText.trim()) return;
        
        setIsSubmitting(true);
        try {
            await sendReply(selectedInquiry.id, replyText);
            setReplyText('');
            // We no longer close the modal (setSelectedInquiry(null))
            // This allows for follow-up messages instantly
            if (activeTab === 'PENDING') {
                setActiveTab('REPLIED');
            }
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
                <button
                    type="button"
                    className={`report-tab${activeTab === 'ARCHIVED' ? ' active' : ''}`}
                    onClick={() => setActiveTab('ARCHIVED')}
                >
                    Archived <span className="report-tab-count">{archived.length}</span>
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
                                        <div className="user-avatar">{(inquiry.userEmail?.[0] || 'U').toUpperCase()}</div>
                                        <div className="user-info-text">
                                            <span className="fullname">{inquiry.userEmail || 'Unknown User'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{inquiry.carName}</span>
                                </td>
                                <td>{formatDate(inquiry.createdAt)}</td>
                                <td>
                                    <span className={`status-badge ${inquiry.status === 'PENDING' ? 'pending' : inquiry.status === 'ARCHIVED' ? 'archived' : 'resolved'}`}>
                                        {inquiry.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-row" style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            className="icon-btn"
                                            title={inquiry.status === 'PENDING' ? "Reply" : "View History"}
                                            onClick={() => {
                                                setSelectedInquiry(inquiry);
                                                setReplyText(''); 
                                            }}
                                            style={{ 
                                                color: inquiry.status === 'PENDING' ? 'var(--primary)' : 'var(--text-secondary)',
                                                background: inquiry.status === 'PENDING' ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                                                borderRadius: '8px',
                                                padding: '6px 10px'
                                            }}
                                        >
                                            <i className={`fa-solid ${inquiry.status === 'PENDING' ? 'fa-reply' : 'fa-comment-dots'}`}></i>
                                        </button>
                                        {inquiry.status !== 'ARCHIVED' && (
                                            <button
                                                className="icon-btn"
                                                title="Archive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Archive this inquiry?')) {
                                                        archiveInquiry(inquiry.id);
                                                    }
                                                }}
                                                style={{ color: 'var(--text-secondary)', borderRadius: '8px', padding: '6px 10px' }}
                                            >
                                                <i className="fa-solid fa-box-archive"></i>
                                            </button>
                                        )}
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
                            <h3>{selectedInquiry.status === 'PENDING' ? 'Reply to Inquiry' : 'Conversation History'}</h3>
                            <span className="close-user-modal" onClick={() => setSelectedInquiry(null)}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <div className="user-modal-body" style={{ color: 'var(--text-secondary)', maxHeight: '65vh', overflowY: 'auto', paddingRight: '10px' }}>
                            <div className="inquiry-thread" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Customer Message */}
                                <div className="inquiry-message customer" style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                        <strong style={{ color: 'white' }}>{selectedInquiry.userEmail}</strong>
                                        <span>{formatDate(selectedInquiry.createdAt)}</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px 15px 15px 0', color: '#eee', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                                        {selectedInquiry.message}
                                    </div>
                                </div>

                                {/* Conversation History */}
                                {selectedInquiry.replyMessage && (
                                    <div className="history-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {(() => {
                                            const history = selectedInquiry.replyMessage;
                                            
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
                                                        <div key={idx} className={`inquiry-message ${isCustomer ? 'customer' : 'admin'}`} style={{ alignSelf: isCustomer ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                                            <div style={{ display: 'flex', justifyContent: isCustomer ? 'space-between' : 'flex-end', marginBottom: '8px', fontSize: '12px', opacity: 0.8, gap: '10px' }}>
                                                                {!isCustomer && <span style={{ color: 'var(--text-secondary)' }}>{date}</span>}
                                                                <strong style={{ color: isCustomer ? 'white' : 'var(--primary)' }}>
                                                                    {isCustomer ? 'Customer' : 'You (Admin)'}
                                                                </strong>
                                                                {isCustomer && <span style={{ color: 'var(--text-secondary)' }}>{date}</span>}
                                                            </div>
                                                            <div style={{ 
                                                                background: isCustomer ? 'rgba(255,255,255,0.05)' : 'var(--primary)', 
                                                                color: 'white', 
                                                                padding: '15px', 
                                                                borderRadius: isCustomer ? '15px 15px 15px 0' : '15px 15px 0 15px', 
                                                                border: isCustomer ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                                                opacity: 0.95, 
                                                                whiteSpace: 'pre-wrap',
                                                                boxShadow: isCustomer ? '0 4px 15px rgba(0,0,0,0.1)' : '0 4px 15px rgba(225, 29, 72, 0.2)' 
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
                                <div ref={threadEndRef} />
                            </div>
                        </div>
                        
                        <div className="user-modal-footer" style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: '25px' }}>
                            <div style={{ width: '100%' }}>
                                <div className="reply-editor" style={{ marginBottom: '20px' }}>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your professional response here..."
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            padding: '15px',
                                            color: 'white',
                                            outline: 'none',
                                            resize: 'none',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" className="user-cancel-btn" onClick={() => setSelectedInquiry(null)} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '10px' }}>
                                        Close
                                    </button>
                                    <button 
                                        type="button" 
                                        className="resolve-btn" 
                                        onClick={handleSendReply}
                                        disabled={isSubmitting || !replyText.trim()}
                                        style={{ 
                                            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px 25px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.2)'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-paper-plane"></i>
                                                {selectedInquiry.status === 'REPLIED' ? 'Send Follow-up' : 'Send Reply'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InquiriesView;
