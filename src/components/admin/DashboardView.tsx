import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useInventory } from '../../context/InventoryContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardView: React.FC = () => {
    const { cars, reports } = useInventory();
    const inventory = Object.values(cars);

    const totalValue = inventory.reduce((sum, car) => sum + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0), 0);
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;

    const dataMap: Record<string, number> = {};
    inventory.forEach(car => {
        const type = car.type || 'N/A';
        dataMap[type] = (dataMap[type] || 0) + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0);
    });

    const chartDataBase = {
        labels: Object.keys(dataMap),
        datasets: [{
            label: 'Total Value (₱)',
            data: Object.values(dataMap),
            backgroundColor: 'rgba(231, 76, 60, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderRadius: 8
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.5)' }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.8)' }
            }
        }
    };

    return (
        <div className="dashboard-view">
            <div className="page-header">
                <h1>Dashboard Overview</h1>
                <button className="add-btn"><i className="fa-solid fa-plus"></i> Add Vehicle</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60' }}><i className="fa-solid fa-car"></i></div>
                    <div className="stat-info">
                        <h3>Total Vehicles</h3>
                        <p>{inventory.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12' }}><i className="fa-solid fa-money-bill-trend-up"></i></div>
                    <div className="stat-info">
                        <h3>Total Inventory Value</h3>
                        <p>₱{totalValue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(139, 41, 29, 0.2)', color: '#8B291D' }}><i className="fa-solid fa-clipboard-list"></i></div>
                    <div className="stat-info">
                        <h3>Pending Reports</h3>
                        <p>{pendingReports}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-table-card">
                <div className="table-header">
                    <h2>Analytics Dashboard</h2>
                    <div className="chart-controls">
                        <select className="chart-dropdown">
                            <option value="category">Value by Type</option>
                        </select>
                    </div>
                </div>
                <div className="chart-container-row" style={{ minHeight: '300px' }}>
                    <Bar data={chartDataBase} options={chartOptions as any} />
                    <div className="chart-stats-mini">
                        {Object.keys(dataMap).map((label, i) => (
                            <div key={label} className="mini-stat-item">
                                <span className="dot" style={{ background: `hsl(${i * 60}, 70%, 50%)` }}></span>
                                <span className="label">{label}</span>
                                <span className="value">₱{dataMap[label].toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
