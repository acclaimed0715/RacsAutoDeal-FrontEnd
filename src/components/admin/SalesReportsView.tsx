import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';

const SalesReportsView: React.FC = () => {
    const { cars, settings } = useInventory();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

    const soldCars = useMemo(() => {
        return Object.values(cars).filter(car => car.status === 'sold');
    }, [cars]);

    // Aggregate statistics
    const stats = useMemo(() => {
        const yearSales = soldCars.filter(car => {
            const date = new Date(car.updatedAt || car.date);
            return date.getFullYear() === selectedYear;
        });

        const monthSales = yearSales.filter(car => {
            const date = new Date(car.updatedAt || car.date);
            return date.getMonth() === selectedMonth;
        });

        const totalYearRevenue = yearSales.reduce((acc, car) => acc + (parseFloat(car.price.replace(/[^0-9.]/g, '')) || 0), 0);
        const totalMonthRevenue = monthSales.reduce((acc, car) => acc + (parseFloat(car.price.replace(/[^0-9.]/g, '')) || 0), 0);

        return {
            yearSalesCount: yearSales.length,
            yearRevenue: totalYearRevenue,
            monthSalesCount: monthSales.length,
            monthRevenue: totalMonthRevenue,
            monthSales: monthSales,
            yearSales: yearSales
        };
    }, [soldCars, selectedYear, selectedMonth]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = useMemo(() => {
        const startYear = 2024;
        const currentYear = new Date().getFullYear();
        const arr = [];
        for (let y = currentYear; y >= startYear; y--) arr.push(y);
        return arr;
    }, []);

    const formatCurrency = (amount: number) => {
        return `${settings.currency}${amount.toLocaleString()}`;
    };

    return (
        <div className="reports-view sales-reports-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Sales & Revenue Reports</h1>
                    <p className="stats-text">Comprehensive overview of sold inventory and performance</p>
                </div>
                <div className="header-right sales-filters">
                    <div className="filter-group">
                        <label>Year</label>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="dash-select"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Month</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="dash-select"
                        >
                            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="sales-stats-grid">
                <div className="sales-stat-card">
                    <div className="stat-icon revenue"><i className="fa-solid fa-money-bill-trend-up"></i></div>
                    <div className="stat-info">
                        <h3>{months[selectedMonth]} Revenue</h3>
                        <p className="stat-value">{formatCurrency(stats.monthRevenue)}</p>
                        <span className="stat-sub">{stats.monthSalesCount} cars sold this month</span>
                    </div>
                </div>
                <div className="sales-stat-card">
                    <div className="stat-icon volume"><i className="fa-solid fa-car-side"></i></div>
                    <div className="stat-info">
                        <h3>Annual Revenue ({selectedYear})</h3>
                        <p className="stat-value">{formatCurrency(stats.yearRevenue)}</p>
                        <span className="stat-sub">{stats.yearSalesCount} total units sold</span>
                    </div>
                </div>
                <div className="sales-stat-card">
                    <div className="stat-icon average"><i className="fa-solid fa-chart-line"></i></div>
                    <div className="stat-info">
                        <h3>Avg. Sale Price</h3>
                        <p className="stat-value">
                            {formatCurrency(stats.yearSalesCount > 0 ? stats.yearRevenue / stats.yearSalesCount : 0)}
                        </p>
                        <span className="stat-sub">Based on {selectedYear} data</span>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h2>Monthly Sales Breakdown ({months[selectedMonth]} {selectedYear})</h2>
                    <button className="add-user-btn export-btn" onClick={() => window.print()}>
                        <i className="fa-solid fa-file-export"></i> Print Report
                    </button>
                </div>
                <table className="reports-table premium-table">
                    <thead>
                        <tr>
                            <th>Vehicle Details</th>
                            <th>Brand/Type</th>
                            <th>Sold Price</th>
                            <th>Sold Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.monthSales.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                    No sales recorded for this month.
                                </td>
                            </tr>
                        ) : stats.monthSales.map(car => (
                            <tr key={car.id}>
                                <td>
                                    <div className="user-profile">
                                        <div className="user-avatar" style={{ borderRadius: '8px' }}>
                                            <img src={car.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="user-info-text">
                                            <span className="username">{car.name}</span>
                                            <span className="fullname">{car.modelYear} • {car.transmission}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{car.brand}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{car.type || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{car.price}</span>
                                </td>
                                <td>{new Date(car.updatedAt || car.date).toLocaleDateString()}</td>
                                <td>
                                    <span className="status-badge resolved">SOLD</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReportsView;
