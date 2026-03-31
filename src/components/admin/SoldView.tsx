import React from 'react';
import { useInventory } from '../../context/InventoryContext';

const SoldView: React.FC = () => {
    const { cars, resolveSale } = useInventory();

    const allCars = Object.values(cars);
    const soldArchived = allCars.filter(c => c.isArchived && c.status === 'sold');
    const pendingApproval = allCars.filter(c => c.status === 'sold' && !c.isArchived);

    const totalSoldValue = soldArchived.reduce(
        (sum, car) => sum + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0), 0
    );

    return (
        <div className="sold-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Sold Cars</h1>
                    <p className="stats-text">{soldArchived.length} sold • ₱{totalSoldValue.toLocaleString()} total value</p>
                </div>
            </div>

            {/* Pending Approval Section */}
            {pendingApproval.length > 0 && (
                <div className="sold-pending-section">
                    <div className="sold-section-title pending">
                        <i className="fa-solid fa-clock"></i>
                        Pending Your Approval ({pendingApproval.length})
                    </div>
                    <div className="table-container">
                        <table className="users-table premium-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Reported By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingApproval.map(car => (
                                    <tr key={car.id}>
                                        <td>
                                            <div className="car-info-cell">
                                                <img src={car.images?.[0]} alt={car.name} className="car-thumb" />
                                                <div>
                                                    <div className="car-name">{car.name}</div>
                                                    <div className="car-meta">{car.type} • {car.modelYear}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{car.brand}</td>
                                        <td className="price-cell">{car.price}</td>
                                        <td>{car.saleReportedBy || 'Unknown'}</td>
                                        <td>
                                            <div className="action-row">
                                                <button
                                                    className="sold-approve-btn"
                                                    onClick={() => resolveSale(car.id, 'approve')}
                                                    title="Accept & archive"
                                                >
                                                    <i className="fa-solid fa-check"></i> Accept
                                                </button>
                                                <button
                                                    className="sold-reject-btn"
                                                    onClick={() => resolveSale(car.id, 'reject')}
                                                    title="Reject — returns to Open"
                                                >
                                                    <i className="fa-solid fa-xmark"></i> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sold & Archived Section */}
            <div className="sold-section-title archived">
                <i className="fa-solid fa-box-archive"></i>
                Sold & Archived ({soldArchived.length})
            </div>

            {soldArchived.length === 0 ? (
                <div className="sold-empty">
                    <i className="fa-solid fa-car-burst"></i>
                    <p>No archived sold cars yet.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="users-table premium-table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Brand</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>Sold By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {soldArchived.map(car => (
                                <tr key={car.id}>
                                    <td>
                                        <div className="car-info-cell">
                                            <img src={car.images?.[0]} alt={car.name} className="car-thumb" />
                                            <div>
                                                <div className="car-name">{car.name}</div>
                                                <div className="car-meta">{car.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{car.brand}</td>
                                    <td>{car.modelYear}</td>
                                    <td className="price-cell">{car.price}</td>
                                    <td>{car.saleReportedBy || 'Unknown'}</td>
                                    <td>
                                        <span className="sold-archived-badge">
                                            <i className="fa-solid fa-circle-check"></i> Sold &amp; Archived
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SoldView;
