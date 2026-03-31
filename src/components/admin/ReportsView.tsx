import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const ReportsView: React.FC = () => {
    const { reports, resolveReport, deleteReport } = useInventory();

    const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
    const pending = reports.filter(r => r.status === 'PENDING');
    const resolved = reports.filter(r => r.status === 'RESOLVED');

    const visible = activeTab === 'PENDING' ? pending : resolved;

    return (
        <div className="reports-view">
            <div className="page-header">
                <h1>User Reports</h1>
                <p className="stats-text">{pending.length} pending, {resolved.length} resolved</p>
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
                                    <span className={`status-badge ${report.status === 'PENDING' ? 'pending' : 'resolved'}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-row">
                                        {report.status === 'PENDING' && (
                                            <button
                                                className="resolve-btn"
                                                type="button"
                                                onClick={() => {
                                                    resolveReport(report.id);
                                                    // Switch tab so the resolved inquiry "moves" immediately.
                                                    setActiveTab('RESOLVED');
                                                }}
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        <button className="icon-btn" onClick={() => deleteReport(report.id)}><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsView;
