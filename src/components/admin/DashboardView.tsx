import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useInventory } from '../../context/InventoryContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardView: React.FC = () => {
    const { cars, reports, currentUser, resolveSale } = useInventory();
    const inventory = Object.values(cars);

    const totalValue = inventory.reduce((sum, car) => sum + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0), 0);
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;
    const pendingSales = inventory.filter(car => car.status === 'sold' && !car.isArchived);

    // 1. Data by Type
    const typeMap: Record<string, number> = {};
    inventory.forEach(car => {
        const type = car.type || 'N/A';
        typeMap[type] = (typeMap[type] || 0) + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0);
    });

    // 2. Data by Brand
    const brandMap: Record<string, number> = {};
    inventory.forEach(car => {
        const brand = car.brand || 'N/A';
        brandMap[brand] = (brandMap[brand] || 0) + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0);
    });

    // 3. Data by Status
    const statusMap: Record<string, number> = {};
    inventory.forEach(car => {
        const status = car.status.toUpperCase().replace('_', ' ');
        statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                display: false,
                labels: { color: 'rgba(255,255,255,0.7)', font: { size: 10 } }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.8)', font: { size: 10 } }
            }
        }
    };

    const typeChartData = {
        labels: Object.keys(typeMap),
        datasets: [{
            label: 'Value (₱)',
            data: Object.values(typeMap),
            backgroundColor: 'rgba(225, 29, 72, 0.7)',
            borderRadius: 6
        }]
    };

    const brandChartData = {
        labels: Object.keys(brandMap),
        datasets: [{
            label: 'Value (₱)',
            data: Object.values(brandMap),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6
        }]
    };

    const statusChartData = {
        labels: Object.keys(statusMap),
        datasets: [{
            data: Object.values(statusMap),
            backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(99, 102, 241, 0.7)',
                'rgba(168, 85, 247, 0.7)'
            ],
            borderWidth: 0
        }]
    };

    return (
        <div className="dashboard-view" style={{ paddingBottom: '2rem' }}>
            <div className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {currentUser?.name || 'Admin'}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60' }}><i className="fa-solid fa-car"></i></div>
                    <div className="stat-info">
                        <h3>Total Vehicles</h3>
                        <p>{inventory.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12' }}><i className="fa-solid fa-money-bill-trend-up"></i></div>
                    <div className="stat-info">
                        <h3>Inventory Value</h3>
                        <p>₱{totalValue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48' }}><i className="fa-solid fa-clipboard-list"></i></div>
                    <div className="stat-info">
                        <h3>Pending Reports</h3>
                        <p>{pendingReports}</p>
                    </div>
                </div>
            </div>

            <div className="charts-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {/* 1. Value by Type */}
                <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                    <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem' }}>Value by Vehicle Type</h2>
                    </div>
                    <div style={{ height: '250px' }}>
                        <Bar data={typeChartData} options={chartOptions as any} />
                    </div>
                </div>

                {/* 2. Value by Brand */}
                <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                    <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem' }}>Value by Brand</h2>
                    </div>
                    <div style={{ height: '250px' }}>
                        <Bar data={brandChartData} options={chartOptions as any} />
                    </div>
                </div>

                {/* 3. Status Distribution */}
                <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                    <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem' }}>Inventory Status</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: '250px' }}>
                        <div style={{ flex: 1, height: '100%' }}>
                            <Doughnut 
                                data={statusChartData} 
                                options={{ 
                                    ...chartOptions, 
                                    scales: undefined,
                                    plugins: { ...chartOptions.plugins, legend: { display: false } }
                                } as any} 
                            />
                        </div>
                        <div style={{ flex: 1, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {Object.entries(statusMap).map(([label, count], i) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusChartData.datasets[0].backgroundColor[i] }}></span>
                                        {label}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {currentUser?.role === 'SUPER_ADMIN' && pendingSales.length > 0 && (
                <div className="dashboard-table-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                    <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', color: '#f39c12' }}>
                            <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px' }}></i>
                            Sales Pending Approval
                        </h2>
                    </div>
                    <div className="table-container">
                        <table className="premium-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '12px 15px', color: 'var(--text-secondary)' }}>Vehicle</th>
                                    <th style={{ padding: '12px 15px', color: 'var(--text-secondary)' }}>Reported By</th>
                                    <th style={{ padding: '12px 15px', color: 'var(--text-secondary)' }}>Price</th>
                                    <th style={{ padding: '12px 15px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingSales.map(car => (
                                    <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={car.images[0] || '/assets/placeholder.jpg'} alt={car.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{car.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: {car.status.toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>{car.saleReportedBy || 'Unknown'}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{car.price}</td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button 
                                                    onClick={() => resolveSale(car.id, 'approve')}
                                                    style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#2ecc71', border: '1px solid rgba(46, 204, 113, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                                                ><i className="fa-solid fa-check"></i> Accept & Archive</button>
                                                <button 
                                                    onClick={() => resolveSale(car.id, 'reject')}
                                                    style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                                                ><i className="fa-solid fa-xmark"></i> Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardView;
