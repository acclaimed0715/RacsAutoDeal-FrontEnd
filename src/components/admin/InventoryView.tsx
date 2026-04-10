import React, { useState, useRef, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type Vehicle, type CarStatus } from '../../types';
import { formatPrice, formatNumberWithCommas } from '../../utils/format';

const DEFAULT_VEHICLE_TYPES = ['SUV', 'Sedan', 'Electric Car', 'Hatchback', 'Van', 'Sports Car', 'Coupe'] as const;

const InventoryView: React.FC = () => {
    const { cars, deleteVehicle, requestDeletionVehicle, resolveDeletion, addVehicle, updateVehicle, currentUser, resolveSale, settings, updateSettings } = useInventory();
    const allCars = Object.values(cars);
    const inventory = allCars.filter(c => !c.isArchived);
    const pendingApproval = allCars.filter(c => c.status === 'sold' && !c.isArchived);
    const pendingDeletionReqs = inventory.filter(c => c.pendingDeletion);
    const soldArchived = allCars.filter(c => c.isArchived && c.status === 'sold');
    const totalSoldValue = soldArchived.reduce((sum, c) => sum + (parseInt(c.price.replace(/[^0-9]/g, '')) || 0), 0);

    const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Vehicle | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<Partial<Vehicle>>({});
    const [images, setImages] = useState<string[]>([]);
    const [removalModalCar, setRemovalModalCar] = useState<Vehicle | null>(null);
    const [removalRemark, setRemovalRemark] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        const current = settings.vehicleTypes || [];
        if (current.includes(newCategory.trim())) return;
        await updateSettings({ ...settings, vehicleTypes: [...current, newCategory.trim()] });
        setNewCategory('');
    };

    const handleRemoveCategory = async (cat: string) => {
        const current = settings.vehicleTypes || [];
        await updateSettings({ ...settings, vehicleTypes: current.filter(c => c !== cat) });
    };

    const vehicleTypeOptions = useMemo(() => {
        const fromSettings =
            settings.vehicleTypes && settings.vehicleTypes.length > 0
                ? settings.vehicleTypes
                : [...DEFAULT_VEHICLE_TYPES];
        const current = form.type;
        if (current && !fromSettings.includes(current)) {
            return [...fromSettings, current];
        }
        return fromSettings;
    }, [settings.vehicleTypes, form.type]);

    const defaultVehicleType =
        settings.vehicleTypes && settings.vehicleTypes.length > 0
            ? settings.vehicleTypes[0]
            : DEFAULT_VEHICLE_TYPES[0];

    const openAdd = () => {
        setEditingCar(null);
        setForm({
            name: '', price: '', modelYear: '', mileage: '', brand: '',
            transmission: '', fuelType: '', engine: '', hp: '', torque: '',
            safety: '', seating: '', description: '', status: 'open' as CarStatus, type: defaultVehicleType,
            color: '',
            otherFeatures: [],
            date: new Date().toLocaleDateString()
        });
        setImages([]);
        setIsModalOpen(true);
    };

    const openEdit = (car: Vehicle) => {
        setEditingCar(car);
        setForm(car);
        setImages(car.images || []);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        
        Array.from(files).forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                alert(`File "${file.name}" exceeds the 10MB size limit.`);
                return;
            }

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 1200;
                            const MAX_HEIGHT = 1200;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height = Math.round((height * MAX_WIDTH) / width);
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width = Math.round((width * MAX_HEIGHT) / height);
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, width, height);

                            // Compress aggressively to keep base64 strings very small
                            const compressed = canvas.toDataURL('image/jpeg', 0.8);
                            setImages(prev => [...prev, compressed]);
                        };
                        img.src = e.target.result as string;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (images.length < 5) {
            alert('A minimum of 5 images is required for a premium listing.');
            return;
        }
        if (images.length > 10) {
            alert('Maximum 10 images allowed per vehicle.');
            return;
        }

        const { posted, createdAt, updatedAt, images: _img, id: _id, ...validForm } = form as any;

        const carData = {
            ...validForm,
            id: editingCar ? editingCar.id : 'car_' + Date.now(),
            price: form.price?.startsWith('₱') ? form.price : '₱' + form.price,
            images: images
        } as Vehicle;

        const isReportingSale = form.status === 'sold' && editingCar?.status !== 'sold';

        if (isReportingSale) {
            carData.saleReportedBy = currentUser?.name || 'Unknown';
            if (!isSuperAdmin) {
                if (!window.confirm(`Report "${carData.name}" as sold?\n\nThis will notify the Super Admin for approval before the car is archived.`)) {
                    return;
                }
            }
        }

        if (editingCar) updateVehicle(carData);
        else addVehicle(carData);

        setIsModalOpen(false);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    return (
        <div className="inventory-view">
            <div className="page-header">
                <div className="header-left">
                    <h1>Car Inventory</h1>
                    <p className="stats-text">
                        {activeTab === 'active'
                            ? `${inventory.length} active listing${inventory.length !== 1 ? 's' : ''}`
                            : `${soldArchived.length} sold • ₱${totalSoldValue.toLocaleString()} total`}
                    </p>
                </div>
                <div className="header-right">
                    {activeTab === 'active' && (
                        <button className="add-car-btn" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add car</button>
                    )}
                </div>
            </div>

            {isSuperAdmin && (
                <div
                    className="inventory-categories-card"
                    style={{
                        marginBottom: '1.5rem',
                        padding: '1.25rem 1.5rem',
                        background: 'var(--card-bg)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Vehicle categories</h2>
                    <p className="stats-text" style={{ marginBottom: '1rem' }}>
                        Types available when adding or editing cars and in dashboard charts.
                    </p>
                    <div className="inventory-categories-add-row">
                        <div className="form-group" style={{ flex: '1 1 220px', minWidth: 0, marginBottom: 0 }}>
                            <input
                                type="text"
                                placeholder="Add category (e.g. Truck)"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                            />
                        </div>
                        <button type="button" className="user-add-btn inventory-categories-add-btn" onClick={() => void handleAddCategory()}>
                            Add
                        </button>
                    </div>
                    <div className="categories-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {(settings.vehicleTypes || []).map(cat => (
                            <div
                                key={cat}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    background: 'var(--surface)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '50px',
                                    gap: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <span>{cat}</span>
                                <i
                                    className="fa-solid fa-xmark"
                                    style={{ cursor: 'pointer', color: 'var(--accent)' }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Remove ${cat}`}
                                    onClick={() => void handleRemoveCategory(cat)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            void handleRemoveCategory(cat);
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="inv-tabs">
                <button
                    className={`inv-tab${activeTab === 'active' ? ' active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    <i className="fa-solid fa-car"></i> Active Listings
                    {isSuperAdmin && pendingDeletionReqs.length > 0 && (
                        <span className="inv-tab-badge">{pendingDeletionReqs.length}</span>
                    )}
                </button>
                <button
                    className={`inv-tab${activeTab === 'sold' ? ' active' : ''}`}
                    onClick={() => setActiveTab('sold')}
                >
                    <i className="fa-solid fa-box-archive"></i> Sold Cars
                    {pendingApproval.length > 0 && (
                        <span className="inv-tab-badge">{pendingApproval.length}</span>
                    )}
                </button>
            </div>

            {/* ── Active Listings Tab ── */}
            {activeTab === 'active' && (
                <div className="table-container">
                    <table className="inventory-table premium-table">
                        <thead>
                            <tr>
                                <th>Car Info</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(car => (
                                <tr key={car.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={car.images?.[0]} alt="" style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{car.name || 'Unnamed Vehicle'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{car.type || 'No Type'} • {car.modelYear || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{car.brand || '—'}</td>
                                    <td>{car.price && car.price !== '₱' ? formatPrice(car.price) : 'No Price Set'}</td>
                                    <td>
                                    {car.pendingDeletion ? (
                                        <div className="status-pending-removal-wrap">
                                            <span className="status-pill pill-pending-removal">
                                                <i className="fa-solid fa-trash"></i> Removal pending
                                            </span>
                                            <div className="removal-requestor">
                                                <i className="fa-solid fa-user" aria-hidden></i>
                                                <span>
                                                    Requested by{' '}
                                                    <strong>{car.deletionRequestedBy?.trim() || 'Unknown'}</strong>
                                                </span>
                                            </div>
                                            {car.deletionRemark?.trim() && (
                                                <div className="removal-remark-block">
                                                    <span className="removal-remark-label">
                                                        <i className="fa-solid fa-message"></i> Reason
                                                    </span>
                                                    <p className="removal-remark-text">{car.deletionRemark.trim()}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : car.status === 'sold' && !car.isArchived ? (
                                        <span className="status-pill pill-pending-approval">
                                            <i className="fa-solid fa-clock"></i> Pending Approval
                                        </span>
                                    ) : car.status === 'open' ? (
                                        <span className="status-pill pill-open">
                                            <i className="fa-solid fa-circle-dot"></i> Open
                                        </span>
                                    ) : car.status === 'negotiating' ? (
                                        <span className="status-pill pill-negotiating">
                                            <i className="fa-solid fa-handshake"></i> Negotiating
                                        </span>
                                    ) : car.status === 'sold' ? (
                                        <span className="status-pill pill-sold">
                                            <i className="fa-solid fa-circle-check"></i> Sold
                                        </span>
                                    ) : (
                                        <span className="status-pill pill-open">{(String(car.status || 'open')).toUpperCase().replace('_', ' ')}</span>
                                    )}
                                    </td>
                                    <td>
                                        <div className="inv-actions-cell">
                                            <button className="icon-btn" title="Edit" onClick={() => openEdit(car)}><i className="fa-solid fa-pen"></i></button>
                                            {car.pendingDeletion && isSuperAdmin && (
                                                <>
                                                    <button
                                                        className="sold-approve-btn inv-inline-btn"
                                                        type="button"
                                                        title="Delete listing"
                                                        onClick={() => {
                                                            const who = car.deletionRequestedBy?.trim() || 'Unknown';
                                                            const reason = car.deletionRemark?.trim();
                                                            const reasonLine = reason
                                                                ? `\n\nReason:\n${reason.length > 400 ? `${reason.slice(0, 400)}…` : reason}`
                                                                : '';
                                                            if (window.confirm(`Permanently delete "${car.name}"?\n\nRequested by ${who}.${reasonLine}`)) resolveDeletion(car.id, 'approve');
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-check"></i> Approve
                                                    </button>
                                                    <button
                                                        className="sold-reject-btn inv-inline-btn"
                                                        type="button"
                                                        title="Keep listing"
                                                        onClick={() => resolveDeletion(car.id, 'reject')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {car.pendingDeletion && !isSuperAdmin && (
                                                <span className="inv-pending-note">
                                                    <i className="fa-solid fa-hourglass-half"></i> Awaiting Super Admin
                                                </span>
                                            )}
                                            {!car.pendingDeletion && isSuperAdmin && !(car.status === 'sold' && !car.isArchived) && (
                                                <button
                                                    className="icon-btn"
                                                    title="Remove listing"
                                                    onClick={() => {
                                                        setRemovalModalCar(car);
                                                        setRemovalRemark('');
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                            {!car.pendingDeletion && !isSuperAdmin && car.status !== 'sold' && (
                                                <button
                                                    className="icon-btn"
                                                    title="Request removal"
                                                    type="button"
                                                    onClick={() => {
                                                        setRemovalModalCar(car);
                                                        setRemovalRemark('');
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Sold Cars Tab ── */}
            {activeTab === 'sold' && (
                <div>
                    {/* Pending approval — only visible to Super Admin */}
                    {isSuperAdmin && pendingApproval.length > 0 && (
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
                                                <td className="price-cell">{formatPrice(car.price)}</td>
                                                <td>{car.saleReportedBy || 'Unknown'}</td>
                                                <td>
                                                    <div className="action-row">
                                                        <button className="sold-approve-btn" onClick={() => resolveSale(car.id, 'approve')}>
                                                            <i className="fa-solid fa-check"></i> Accept
                                                        </button>
                                                        <button className="sold-reject-btn" onClick={() => resolveSale(car.id, 'reject')}>
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

                    {/* Archived sold cars */}
                    <div className="sold-section-title archived" style={{ marginTop: pendingApproval.length > 0 && isSuperAdmin ? '1.5rem' : '0' }}>
                        <i className="fa-solid fa-box-archive"></i>
                        Sold &amp; Archived ({soldArchived.length})
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
                                            <td className="price-cell">{formatPrice(car.price)}</td>
                                            <td>{car.saleReportedBy || 'Unknown'}</td>
                                            <td><span className="sold-archived-badge"><i className="fa-solid fa-circle-check"></i> Sold &amp; Archived</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {removalModalCar && (
                <>
                    <div
                        className="admin-modal-overlay active removal-modal-overlay"
                        onClick={() => {
                            setRemovalModalCar(null);
                            setRemovalRemark('');
                        }}
                    />
                    <div className="user-modal active removal-request-modal" style={{ display: 'block', maxWidth: '480px', width: '95%' }}>
                        <div className="user-modal-header">
                            <h3>{isSuperAdmin ? 'Confirm listing removal' : 'Request listing removal'}</h3>
                            <span
                                className="close-user-modal"
                                onClick={() => {
                                    setRemovalModalCar(null);
                                    setRemovalRemark('');
                                }}
                            >
                                <i className="fa-solid fa-circle-xmark"></i>
                            </span>
                        </div>
                        <form
                            className="user-modal-body"
                            onSubmit={async e => {
                                e.preventDefault();
                                const r = removalRemark.trim();
                                if (r.length < 5) {
                                    alert('Please enter a reason with at least 5 characters.');
                                    return;
                                }
                                try {
                                    if (isSuperAdmin) {
                                        if (window.confirm(`Permanently delete "${removalModalCar.name}"?\n\nThis cannot be undone.`)) {
                                            await deleteVehicle(removalModalCar.id);
                                            setRemovalModalCar(null);
                                            setRemovalRemark('');
                                        }
                                    } else {
                                        await requestDeletionVehicle(removalModalCar.id, currentUser?.name || 'Staff', r);
                                        setRemovalModalCar(null);
                                        setRemovalRemark('');
                                    }
                                } catch (err) {
                                    alert(err instanceof Error ? err.message : 'Could not submit removal request');
                                }
                            }}
                        >
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                {isSuperAdmin 
                                    ? `Please specify the reason for removing `
                                    : `A Super Admin must approve before `
                                }
                                <strong>{removalModalCar.name}</strong> is removed from the system.
                            </p>
                            <div className="user-form-row" style={{ marginBottom: 0 }}>
                                <label htmlFor="removal-remark">Reason / remarks</label>
                                <textarea
                                    id="removal-remark"
                                    className="removal-remark-textarea"
                                    rows={4}
                                    placeholder="e.g. Duplicate listing, vehicle no longer available, wrong specs…"
                                    value={removalRemark}
                                    onChange={e => setRemovalRemark(e.target.value)}
                                    required
                                    minLength={5}
                                    maxLength={2000}
                                />
                                <span className="temp-password-hint" style={{ marginTop: '0.35rem' }}>
                                    Minimum 5 characters. {isSuperAdmin ? 'This will be recorded for audit purposes.' : 'This will be visible to the Super Admin.'}
                                </span>
                            </div>
                            <div className="user-modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="user-cancel-btn"
                                    onClick={() => {
                                        setRemovalModalCar(null);
                                        setRemovalRemark('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="user-add-btn">
                                    <i className={isSuperAdmin ? "fa-solid fa-trash-can" : "fa-solid fa-paper-plane"}></i> 
                                    {isSuperAdmin ? " Confirm & Delete" : " Submit request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {isModalOpen && (
                <>
                    <div className="admin-modal-overlay active" onClick={() => setIsModalOpen(false)}></div>
                    <div className="user-modal active" style={{ display: 'block', maxWidth: '900px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="user-modal-header">
                            <h3>{editingCar ? 'Edit Vehicle Deal' : 'Register New Vehicle'}</h3>
                            <span className="close-user-modal" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-circle-xmark"></i></span>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="user-modal-body">
                            {/* IMAGES SECTION AT TOP */}
                            <div className="deal-section" style={{ marginBottom: '2rem' }}>
                                <label className="section-label">Vehicle Media (Drag & Drop or Multi-Select)</label>
                                <div 
                                    className={`image-upload-zone ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        style={{ display: 'none' }} 
                                    />
                                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
                                    <p style={{ fontWeight: '600' }}>Drop your images here or click to browse</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        <strong>Requirements:</strong> Min 5, Max 10 images. Max 10MB per file.
                                    </p>
                                </div>

                                {images.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '1.5rem' }}>
                                        {images.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                                {idx === 0 && <div style={{ position: 'absolute', bottom: '0', width: '100%', background: 'var(--primary)', color: 'white', fontSize: '8px', textAlign: 'center', padding: '2px 0' }}>MAIN COVER</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="deal-section">
                                    <label className="section-label">General Information</label>
                                    <div className="deal-form-group">
                                        <label className="field-label">Car Name</label>
                                        <input type="text" className="deal-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Price</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 1,200,000" 
                                                className="deal-input" 
                                                value={form.price?.replace('₱', '')} 
                                                onChange={e => setForm({...form, price: formatNumberWithCommas(e.target.value)})} 
                                                required 
                                            />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Vehicle Type</label>
                                            <select className="deal-input" value={form.type ?? ''} onChange={e => setForm({ ...form, type: e.target.value })} style={{ background: 'var(--input-bg)', color: 'white' }}>
                                                {vehicleTypeOptions.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Model Year</label>
                                            <input type="text" placeholder="e.g. 2024" className="deal-input" value={form.modelYear} onChange={e => setForm({...form, modelYear: e.target.value})} title="Vehicle model year" />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Brand</label>
                                            <input type="text" placeholder="e.g. Toyota" className="deal-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} title="Vehicle brand" />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Color</label>
                                            <input type="text" placeholder="e.g. Red" className="deal-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} title="Vehicle color" />
                                        </div>
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Mileage</label>
                                            <input type="text" placeholder="e.g. 15,000 KM" className="deal-input" value={form.mileage} onChange={e => setForm({...form, mileage: e.target.value})} />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Seating Capacity</label>
                                            <select className="deal-input" value={form.seating} onChange={e => setForm({...form, seating: e.target.value})} style={{ background: 'var(--input-bg)', color: 'white' }}>
                                                <option value="" disabled>Select</option>
                                                <option value="2 Seater">2 Seater</option>
                                                <option value="4 Seater">4 Seater</option>
                                                <option value="5 Seater">5 Seater</option>
                                                <option value="7 Seater">7 Seater</option>
                                                <option value="8 Seater">8 Seater</option>
                                                <option value="9+ Seater">9+ Seater</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="deal-form-group">
                                        <label className="field-label">Description</label>
                                        <textarea className="deal-textarea" placeholder="Vehicle overview / description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ height: '100px' }}></textarea>
                                    </div>
                                </div>

                                <div className="deal-section">
                                    <label className="section-label">Technical Specification</label>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Transmission</label>
                                            <select className="deal-input" value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})} style={{ background: 'var(--input-bg)', color: 'white' }}>
                                                <option value="" disabled>Select</option>
                                                <option value="Automatic">Automatic</option>
                                                <option value="Manual">Manual</option>
                                                <option value="CVT">CVT</option>
                                            </select>
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Fuel Type</label>
                                            <select className="deal-input" value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value})} style={{ background: 'var(--input-bg)', color: 'white' }}>
                                                <option value="" disabled>Select</option>
                                                <option value="Gasoline">Gasoline</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="Electric">Electric</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Engine</label>
                                            <input type="text" placeholder="e.g. 2.0L V6" className="deal-input" value={form.engine} onChange={e => setForm({...form, engine: e.target.value})} />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Horsepower</label>
                                            <input type="text" placeholder="e.g. 150 HP" className="deal-input" value={form.hp} onChange={e => setForm({...form, hp: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div className="deal-form-group">
                                            <label className="field-label">Torque</label>
                                            <input type="text" placeholder="e.g. 200 Nm" className="deal-input" value={form.torque} onChange={e => setForm({...form, torque: e.target.value})} />
                                        </div>
                                        <div className="deal-form-group">
                                            <label className="field-label">Safety Features</label>
                                            <input type="text" placeholder="e.g. ABS, Airbags" className="deal-input" value={form.safety} onChange={e => setForm({...form, safety: e.target.value})} />
                                        </div>
                                    </div>
                                    <label className="section-label" style={{ marginTop: '1rem' }}>Additional Features & Info</label>
                                    <div className="deal-form-group">
                                        <label className="field-label">Other Features</label>
                                        <textarea 
                                            className="deal-textarea" 
                                            placeholder="GPS, Sunroof, Leather Seats, etc. (Separate with commas)" 
                                            value={Array.isArray(form.otherFeatures) ? form.otherFeatures.join(', ') : form.otherFeatures || ''} 
                                            onChange={e => setForm({...form, otherFeatures: e.target.value.split(',').map(s => s.trim())})} 
                                            style={{ height: '80px' }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="user-modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                <div className="status-selector">
                                    <label>Vehicle Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="status-select">
                                        <option value="open">Open</option>
                                        <option value="negotiating">Negotiating</option>
                                        <option value="sold">{isSuperAdmin ? 'Sold (Archive Directly)' : 'Sold (Report for Approval)'}</option>
                                    </select>
                                </div>
                                <button type="submit" className="user-add-btn" style={{ padding: '0.8rem 2.5rem' }}>{editingCar ? 'Update Inventory' : 'Publish Car Listing'}</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default InventoryView;
