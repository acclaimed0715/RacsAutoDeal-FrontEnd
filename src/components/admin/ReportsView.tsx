import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type UserReport } from '../../types';

const ReportsView: React.FC = () => {
    const { reports, resolveReport, reopenReport, deleteReport } = useInventory();

    const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED' | 'REOPENED'>('PENDING');
    const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
    const pending = reports.filter(r => r.status === 'PENDING');
    const resolved = reports.filter(r => r.status === 'RESOLVED');
    const reopened = reports.filter(r => r.status === 'REOPENED');

    const visible = activeTab === 'PENDING' ? pending : activeTab === 'RESOLVED' ? resolved : reopened;

    return (
        <div className="reports-view">
            <div className="page-header">
                <h1>User Reports</h1>
                <p className="stats-text">{pending.length} pending, {resolved.length} resolved, {reopened.length} reopened</p>
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
                    className={`report-tab${activeTab === 'REOPENED' ? ' active' : ''}`}
                    onClick={() => setActiveTab('REOPENED')}
                >
                    Re-opened <span className="report-tab-count">{reopened.length}</span>
                </button>
                <button
                    type="button"
                    className={`report-tab${activeTab === 'RESOLVED' ? ' active' : ''}`}
                    onClick={() => setActiveTab('RESOLVED')}
                >
                    Resolved <span className="report-tab-count">{resolved.length}</span>
                </button>
            </div>

            <div className="table-container">
                <table className="reports-table premium-table">
                    <thead>
                        <tr>
                            <th>Email Address</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map(report => (
                            <tr key={report.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar">{report.userName[0]}</div>
                                        <div className="user-info-text">
                                            <span className="username">{report.userName}</span>
                                            <span className="fullname">{report.userEmail}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{report.reason}</td>
                                <td>{report.date}</td>
                                <td>
                                    <span className={`status-badge ${report.status === 'PENDING' ? 'pending' : report.status === 'REOPENED' ? 'warning' : 'resolved'}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-row">
                                        <button
                                            className="icon-btn"
                                            title="View Details"
                                            onClick={() => setSelectedReport(report)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                        {(report.status === 'PENDING' || report.status === 'REOPENED') && (
                                            <button
                                                className="resolve-btn"
                                                type="button"
                                                onClick={() => {
                                                    resolveReport(report.id);
                                                    setActiveTab('RESOLVED');
                                                }}
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        {report.status === 'RESOLVED' && (
                                            <button
                                                className="resolve-btn"
                                                style={{ background: 'var(--primary)', color: 'white' }}
                                                type="button"
                                                onClick={() => {
                                                    reopenReport(report.id);
                                                    setActiveTab('REOPENED');
                                                }}
                                            >
                                                Re-open
                                            </button>
                                        )}
                                        <button className="icon-btn" title="Delete" onClick={() => deleteReport(report.id)}><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedReport && (
                <>
                    <div className="admin-modal-overlay active"></div>
                    <div className="user-modal active" style={{ display: 'block', maxWidth: '1000px', width: '95%' }}>
                        <div className="user-modal-header">
                            <h3>Report Details</h3>
                            <span className="close-user-modal" onClick={() => setSelectedReport(null)}>
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <div className="user-modal-body" style={{ color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: selectedReport.photoData ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
                            <div className="report-text-side">
                                <p style={{ marginBottom: '1rem' }}><strong>Email:</strong> <span style={{ color: 'white' }}>{selectedReport.userEmail}</span></p>
                                <p style={{ marginBottom: '1rem' }}><strong>Reason:</strong> <span style={{ color: 'white' }}>{selectedReport.reason}</span></p>
                                
                                <div>
                                    <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Description:</strong>
                                    <div style={{ background: 'var(--input-bg)', padding: '1rem', borderRadius: '8px', minHeight: '150px', whiteSpace: 'pre-wrap', color: 'white', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {selectedReport.description || 'No description provided.'}
                                    </div>
                                </div>
                            </div>

                            {selectedReport.photoData && (
                                <div className="report-photo-side" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Attached Photo:</strong>
                                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={selectedReport.photoData} alt="Report Attachment" style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="user-modal-footer">
                            <button type="button" className="user-cancel-btn" onClick={() => setSelectedReport(null)}>Close</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsView;
