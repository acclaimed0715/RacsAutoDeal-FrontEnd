import React from 'react';
import { useInventory } from '../../context/InventoryContext';

const ReportsView: React.FC = () => {
    const { reports, resolveReport, deleteReport } = useInventory();

    const pending = reports.filter(r => r.status === 'PENDING');
    const resolved = reports.filter(r => r.status === 'RESOLVED');

    return (
        <div className="reports-view">
            <div className="page-header">
                <h1>User Reports</h1>
                <p className="stats-text">{pending.length} pending, {resolved.length} resolved</p>
            </div>

            <div className="table-container">
                <table className="reports-table premium-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Reason</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
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
                                            <button className="resolve-btn" onClick={() => resolveReport(report.id)}>Resolve</button>
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
