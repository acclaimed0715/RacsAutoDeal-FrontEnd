import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useInventory } from '../../context/InventoryContext';
import { getBrandColor, getVehicleTypeColor, sortTypeLabels } from '../../utils/chartColors';
import { formatPrice } from '../../utils/format';
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
    const { cars, reports, currentUser, resolveSale, settings, inquiries } = useInventory();
    const inventory = Object.values(cars);
    const openVehiclesCount = inventory.filter(car => car.status === 'open').length;
    const pendingInquiriesCount = inquiries.filter(i => i.status === 'PENDING').length;
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    const totalValue = inventory.reduce((sum, car) => sum + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0), 0);
    const pendingReports = reports.filter(r => r.status === 'PENDING').length;
    const pendingSales = inventory.filter(car => car.status === 'sold' && !car.isArchived);
    const soldArchived = inventory.filter(car => car.status === 'sold' && car.isArchived);
    const soldValue = soldArchived.reduce(
        (sum, car) => sum + (parseInt(car.price.replace(/[^0-9]/g, '')) || 0),
        0
    );
    const soldChartPendingCount = isSuperAdmin ? pendingSales.length : 0;

    const [valueView, setValueView] = useState<'type' | 'brand'>('type');
    const [statusView, setStatusView] = useState<'status' | 'sold'>('status');

    // Sold-car date view (Year / Month / Day)
    const parseSoldDate = (s?: string): Date | null => {
        if (!s) return null;
        const d = new Date(s);
        if (!isNaN(d.getTime())) return d;
        return null;
    };

    const parsedSoldCars = soldArchived
        .map(car => {
            const d = parseSoldDate((car.updatedAt as string | undefined) || car.date);
            return d ? { ...car, dateObj: d } : null;
        })
        .filter(Boolean) as Array<typeof soldArchived[number] & { dateObj: Date }>;

    const soldYears = Array.from(new Set(parsedSoldCars.map(c => c.dateObj.getFullYear()))).sort((a, b) => a - b);
    const now = new Date();
    const [soldGranularity, setSoldGranularity] = useState<'year' | 'month' | 'day'>('year');
    const [soldYear, setSoldYear] = useState<number>(now.getFullYear());
    const [soldMonth, setSoldMonth] = useState<number>(now.getMonth() + 1); // 1-12
    const [soldDay, setSoldDay] = useState<string>(() => now.toISOString().slice(0, 10)); // YYYY-MM-DD

    const safeSoldYear = soldYears.includes(soldYear) ? soldYear : (soldYears[0] ?? now.getFullYear());

    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysInSelectedMonth = new Date(safeSoldYear, soldMonth, 0).getDate();

    const soldForYear = parsedSoldCars.filter(c => c.dateObj.getFullYear() === safeSoldYear);
    const soldForMonth = soldForYear.filter(c => c.dateObj.getMonth() + 1 === soldMonth);
    const selectedSoldDayObj =
        soldGranularity === 'day' ? parseSoldDate(`${soldDay}T00:00:00`) : null;
    const soldForDay =
        selectedSoldDayObj && !isNaN(selectedSoldDayObj.getTime())
            ? parsedSoldCars.filter(
                  c =>
                      c.dateObj.getFullYear() === selectedSoldDayObj.getFullYear() &&
                      c.dateObj.getMonth() === selectedSoldDayObj.getMonth() &&
                      c.dateObj.getDate() === selectedSoldDayObj.getDate()
              )
            : [];

    const yearSoldCounts = Array(12).fill(0);
    soldForYear.forEach(c => {
        yearSoldCounts[c.dateObj.getMonth()] += 1;
    });

    const monthSoldCounts = Array(daysInSelectedMonth).fill(0);
    soldForMonth.forEach(c => {
        monthSoldCounts[c.dateObj.getDate() - 1] += 1;
    });

    const soldCountTotal =
        soldGranularity === 'year'
            ? yearSoldCounts.reduce((a, b) => a + b, 0)
            : soldGranularity === 'month'
                ? monthSoldCounts.reduce((a, b) => a + b, 0)
                : soldForDay.length;

    const toPriceNumber = (p: string) => parseInt(p.replace(/[^0-9]/g, '')) || 0;

    const soldValueTotal =
        soldGranularity === 'year'
            ? soldForYear.reduce((sum, c) => sum + toPriceNumber(c.price), 0)
            : soldGranularity === 'month'
                ? soldForMonth.reduce((sum, c) => sum + toPriceNumber(c.price), 0)
                : soldForDay.reduce((sum, c) => sum + toPriceNumber(c.price), 0);

    const yearTrendChartData = {
        labels: MONTH_LABELS,
        datasets: [
            {
                label: 'Sold',
                data: yearSoldCounts,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderWidth: 0,
                borderRadius: 6,
            },
        ],
    };

    const monthTrendChartData = {
        labels: Array.from({ length: daysInSelectedMonth }, (_, i) => String(i + 1)),
        datasets: [
            {
                label: 'Sold',
                data: monthSoldCounts,
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderWidth: 0,
                borderRadius: 6,
            },
        ],
    };

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
    const STATUS_LABEL: Record<string, string> = {
        open: 'Open',
        negotiating: 'Negotiating',
        sold: 'Sold',
        // legacy fallbacks
        'in-progress': 'Negotiating',
        pending_deal: 'Negotiating',
        closed: 'Sold',
    };
    const statusMap: Record<string, number> = {};
    inventory.forEach(car => {
        const label = STATUS_LABEL[car.status] || car.status.toUpperCase().replace('_', ' ');
        statusMap[label] = (statusMap[label] || 0) + 1;
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

    const preferredTypes = settings.vehicleTypes || [];
    const typeLabelsSorted = sortTypeLabels(Object.keys(typeMap), preferredTypes);
    const typeColors = typeLabelsSorted.map((label) => getVehicleTypeColor(label, preferredTypes));

    const typeChartData = {
        labels: typeLabelsSorted,
        datasets: [{
            label: 'Value (₱)',
            data: typeLabelsSorted.map((label) => typeMap[label]),
            backgroundColor: typeColors,
            borderRadius: 6
        }]
    };

    const brandLabelsSorted = Object.keys(brandMap).sort((a, b) => a.localeCompare(b));
    const brandColors = brandLabelsSorted.map((label) => getBrandColor(label));

    const brandChartData = {
        labels: brandLabelsSorted,
        datasets: [{
            label: 'Value (₱)',
            data: brandLabelsSorted.map((label) => brandMap[label]),
            backgroundColor: brandColors,
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

    const soldChartData = {
        labels: ['Pending Approval', 'Sold & Archived'],
        datasets: [{
            data: [soldChartPendingCount, soldArchived.length],
            backgroundColor: [
                'rgba(243, 156, 18, 0.7)',
                'rgba(239, 68, 68, 0.7)',
            ],
            borderWidth: 0,
        }]
    };

    return (
        <div className="dashboard-view" style={{ paddingBottom: '2rem' }}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60' }}><i className="fa-solid fa-car"></i></div>
                    <div className="stat-info">
                        <h3>Total Vehicles</h3>
                        <p>{openVehiclesCount}</p>
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
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}><i className="fa-solid fa-envelope-open-text"></i></div>
                    <div className="stat-info">
                        <h3>Pending Inquiries</h3>
                        <p>{pendingInquiriesCount}</p>
                        <p style={{ marginTop: '0.25rem', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            Awaiting Reply
                        </p>
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
                <div className="dashboard-control">
                    <span className="dashboard-control-label">Value Chart</span>
                    <select
                        className="dash-select"
                        value={valueView}
                        onChange={(e) => setValueView(e.target.value as 'type' | 'brand')}
                    >
                        <option value="type">Vehicle Type</option>
                        <option value="brand">Brand</option>
                    </select>
                </div>
                <div className="dashboard-control">
                    <span className="dashboard-control-label">Status / Sold</span>
                    <select
                        className="dash-select"
                        value={statusView}
                        onChange={(e) => setStatusView(e.target.value as 'status' | 'sold')}
                    >
                        <option value="status">Inventory Status</option>
                        <option value="sold">Sold Cars Overview</option>
                    </select>
                </div>
            </div>

            <div className="charts-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
                {/* 1. Value by Type */}
                {valueView === 'type' && (
                    <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                        <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem' }}>Value by Vehicle Type</h2>
                        </div>
                        <div style={{ height: '250px' }}>
                            <Bar data={typeChartData} options={chartOptions as any} />
                        </div>
                        <div
                            style={{
                                marginTop: '1rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px 14px',
                                fontSize: '0.78rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            {typeLabelsSorted.map((label, i) => (
                                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '3px',
                                            background: typeColors[i],
                                            flexShrink: 0,
                                        }}
                                    />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {valueView === 'brand' && (
                    <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                        <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem' }}>Value by Brand</h2>
                        </div>
                        <div style={{ height: '250px' }}>
                            <Bar data={brandChartData} options={chartOptions as any} />
                        </div>
                        <div
                            style={{
                                marginTop: '1rem',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px 14px',
                                fontSize: '0.78rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            {brandLabelsSorted.map((label, i) => (
                                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '3px',
                                            background: brandColors[i],
                                            flexShrink: 0,
                                        }}
                                    />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {statusView === 'status' && (
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
                )}

                {statusView === 'sold' && (
                    <div className="dashboard-table-card" style={{ padding: '1.5rem' }}>
                        <div className="table-header" style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem' }}>Sold Cars Overview</h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', height: '250px' }}>
                            <div style={{ flex: 1, height: '100%' }}>
                                <Doughnut
                                    data={soldChartData}
                                    options={{
                                        ...chartOptions,
                                        scales: undefined,
                                        plugins: { ...chartOptions.plugins, legend: { display: false } }
                                    } as any}
                                />
                            </div>
                            <div style={{ flex: 1, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: soldChartData.datasets[0].backgroundColor[0] }}></span>
                                        Pending Approval
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{soldChartPendingCount}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: soldChartData.datasets[0].backgroundColor[1] }}></span>
                                        Sold & Archived
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{soldArchived.length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <i className="fa-solid fa-peso-sign" aria-hidden style={{ color: '#ef4444' }}></i>
                                        Total Sold Value
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>₱{soldValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sold Cars Date Filter / Chart */}
            <div className="dashboard-table-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <div className="table-header" style={{ marginBottom: '1.2rem' }}>
                    <h2 style={{ fontSize: '1.1rem' }}>Sold Cars by Date</h2>
                    {isSuperAdmin && (
                        <button 
                            className="add-user-btn" 
                            style={{ background: 'var(--primary)', height: '36px', padding: '0 1.2rem', fontSize: '0.85rem' }}
                            onClick={() => window.print()}
                        >
                            <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '8px' }}></i>
                            Generate Sales Report
                        </button>
                    )}
                </div>

                <div className="dashboard-controls" style={{ marginTop: 0, marginBottom: '1rem' }}>
                    <div className="dashboard-control">
                        <span className="dashboard-control-label">View</span>
                        <select
                            className="dash-select"
                            value={soldGranularity}
                            onChange={(e) => setSoldGranularity(e.target.value as 'year' | 'month' | 'day')}
                        >
                            <option value="year">Per Year</option>
                            <option value="month">Per Month</option>
                            <option value="day">Per Day</option>
                        </select>
                    </div>

                    {(soldGranularity === 'year' || soldGranularity === 'month') && (
                        <div className="dashboard-control">
                            <span className="dashboard-control-label">Year</span>
                            <select
                                className="dash-select"
                                value={safeSoldYear}
                                onChange={(e) => setSoldYear(parseInt(e.target.value, 10))}
                            >
                                {soldYears.length > 0
                                    ? soldYears.map(y => (
                                          <option key={y} value={y}>
                                              {y}
                                          </option>
                                      ))
                                    : [now.getFullYear()].map(y => (
                                          <option key={y} value={y}>
                                              {y}
                                          </option>
                                      ))}
                            </select>
                        </div>
                    )}

                    {soldGranularity === 'month' && (
                        <div className="dashboard-control">
                            <span className="dashboard-control-label">Month</span>
                            <select
                                className="dash-select"
                                value={soldMonth}
                                onChange={(e) => setSoldMonth(parseInt(e.target.value, 10))}
                            >
                                {MONTH_LABELS.map((label, idx) => (
                                    <option key={label} value={idx + 1}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {soldGranularity === 'day' && (
                        <div className="dashboard-control">
                            <span className="dashboard-control-label">Date</span>
                            <input
                                type="date"
                                className="dash-select"
                                value={soldDay}
                                onChange={(e) => setSoldDay(e.target.value)}
                                style={{ minWidth: 240 }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: 'rgba(239, 68, 68, 0.9)' }} />
                        Sold: <strong style={{ color: 'var(--text-primary)' }}>{soldCountTotal}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: 999, background: 'rgba(243, 156, 18, 0.9)' }} />
                        Total Value: <strong style={{ color: 'var(--text-primary)' }}>₱{soldValueTotal.toLocaleString()}</strong>
                    </div>
                </div>

                {soldGranularity !== 'day' && (
                    <div style={{ height: 260 }}>
                        <Bar
                            data={soldGranularity === 'year' ? yearTrendChartData : monthTrendChartData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: { display: false },
                                },
                            }}
                        />
                    </div>
                )}

                {soldGranularity === 'day' && (
                    <div>
                        {soldForDay.length === 0 ? (
                            <div className="notif-empty">No sold cars on this date.</div>
                        ) : (
                            <div className="reports-day-list">
                                {soldForDay.map(c => (
                                    <div
                                        key={c.id}
                                        className="reports-day-item"
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'flex-start',
                                            padding: '0.9rem 1rem',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 14,
                                            marginBottom: '0.75rem',
                                            background: 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <div className="user-avatar" style={{ width: 38, height: 38 }}>
                                            {c.brand?.[0] || 'C'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</div>
                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.15)',
                                                        border: '1px solid rgba(239, 68, 68, 0.35)',
                                                        color: '#ef4444',
                                                        padding: '0.25rem 0.7rem',
                                                        borderRadius: 999,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    Sold
                                                </span>
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                                                {c.modelYear} • {c.brand} • {formatPrice(c.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hidden Printable Report */}
            <div className="printable-report-container">
                <div className="report-print-header">
                    <div className="report-print-logo">
                        <img src="/assets/logo.png" alt="Logo" style={{ height: '50px' }} />
                        <div className="report-print-title">
                            <h1>Sales & Revenue Report</h1>
                            <p>{settings.businessName} • {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="report-print-meta">
                        <div className="meta-item">
                            <span className="label">Period:</span>
                            <span className="value">
                                {soldGranularity === 'year' ? `Year ${safeSoldYear}` : 
                                 soldGranularity === 'month' ? `${MONTH_LABELS[soldMonth-1]} ${safeSoldYear}` : 
                                 `Date ${soldDay}`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="report-print-stats">
                    <div className="print-stat">
                        <span className="label">Total Units Sold</span>
                        <span className="value">{soldCountTotal}</span>
                    </div>
                    <div className="print-stat">
                        <span className="label">Total Revenue</span>
                        <span className="value">₱{soldValueTotal.toLocaleString()}</span>
                    </div>
                    <div className="print-stat">
                        <span className="label">Avg. Sale Price</span>
                        <span className="value">₱{(soldCountTotal > 0 ? soldValueTotal / soldCountTotal : 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="report-print-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Vehicle Details</th>
                                <th>Brand</th>
                                <th>Model Year</th>
                                <th>Sold Price</th>
                                <th>Sold Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(soldGranularity === 'year' ? soldForYear : 
                              soldGranularity === 'month' ? soldForMonth : 
                              soldForDay).map(car => (
                                <tr key={car.id}>
                                    <td>{car.name}</td>
                                    <td>{car.brand}</td>
                                    <td>{car.modelYear}</td>
                                    <td style={{ fontWeight: 700 }}>{formatPrice(car.price)}</td>
                                    <td>{new Date(car.updatedAt || car.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="report-print-footer">
                    <p>Generated by {currentUser?.name} (@{currentUser?.username})</p>
                    <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
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
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{formatPrice(car.price)}</td>
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
