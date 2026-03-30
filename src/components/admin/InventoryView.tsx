import React, { useState, useRef } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type Vehicle } from '../../types';

const InventoryView: React.FC = () => {
    const { cars, deleteVehicle, addVehicle, updateVehicle, currentUser } = useInventory();
    const inventory = Object.values(cars);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Vehicle | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<Partial<Vehicle>>({});
    const [images, setImages] = useState<string[]>([]);
    
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    const openAdd = () => {
        setEditingCar(null);
        setForm({
            name: '', price: '', modelYear: '', mileage: '', brand: '',
            transmission: '', fuelType: '', engine: '', hp: '', torque: '',
            safety: '', seating: '', description: '', status: 'open', type: 'SUV',
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
        const newImages = [...images];
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        setImages([...newImages]);
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
        
        if (images.length === 0) {
            alert('Please provide at least one image.');
            return;
        }

        const { promoPrice, posted, ...validForm } = form as any;

        const carData = {
            ...validForm,
            id: editingCar ? editingCar.id : 'car_' + Date.now(),
            price: form.price?.startsWith('₱') ? form.price : '₱' + form.price,
            images: images
        } as Vehicle;

        if (form.status === 'sold' && editingCar?.status !== 'sold') {
            carData.saleReportedBy = currentUser?.name || 'Unknown';
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
                    <p className="stats-text">Total: {inventory.length} deals</p>
                </div>
                <div className="header-right">
                    <button className="add-car-btn" onClick={openAdd}><i className="fa-solid fa-plus"></i> Add car</button>
                </div>
            </div>

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
                                            <div style={{ fontWeight: 'bold' }}>{car.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{car.type} • {car.modelYear}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{car.brand}</td>
                                <td>{car.price}</td>
                                <td>
                                    {car.status === 'sold' && !car.isArchived ? (
                                        <span className="badge pending" style={{ background: 'rgba(243, 156, 18, 0.2)', color: '#f39c12', border: '1px solid rgba(243, 156, 18, 0.3)' }}>PENDING APPROVAL</span>
                                    ) : (
                                        <span className={`badge ${car.status === 'open' ? 'in-progress' : (car.status === 'pending_deal' ? 'pending' : (car.status === 'sold' ? 'closed' : ''))}`}>{car.status.toUpperCase().replace('_', ' ')}</span>
                                    )}
                                </td>
                                <td>
                                    <button className="icon-btn" onClick={() => openEdit(car)}><i className="fa-solid fa-pen"></i></button>
                                    {(isSuperAdmin || car.status !== 'pending_deal') && (
                                        <button className="icon-btn" onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${car.name}?`)) {
                                                deleteVehicle(car.id);
                                            }
                                        }}><i className="fa-solid fa-trash"></i></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Include multiple angles for a premium feel (Interior, exterior, etc.)</p>
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
                                        <input type="text" placeholder="Car Name" className="deal-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Price (e.g. 1,200,000)" className="deal-input" value={form.price?.replace('₱', '')} onChange={e => setForm({...form, price: e.target.value})} required />
                                        <select className="deal-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ background: 'var(--input-bg)', color: 'white' }}>
                                            <option value="SUV">SUV</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="Electric Car">Electric Car</option>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Van">Van</option>
                                            <option value="Sports Car">Sports Car</option>
                                            <option value="Coupe">Coupe</option>
                                        </select>
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Model Year (e.g. 2024)" className="deal-input" value={form.modelYear} onChange={e => setForm({...form, modelYear: e.target.value})} />
                                        <input type="text" placeholder="Brand (e.g. Toyota)" className="deal-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Mileage (e.g. 15,000 KM)" className="deal-input" value={form.mileage} onChange={e => setForm({...form, mileage: e.target.value})} />
                                        <input type="text" placeholder="Seating (e.g. 5 Seater)" className="deal-input" value={form.seating} onChange={e => setForm({...form, seating: e.target.value})} />
                                    </div>
                                    <div className="deal-form-group">
                                        <textarea placeholder="Vehicle Overview / Description" className="deal-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ height: '100px' }}></textarea>
                                    </div>
                                </div>

                                <div className="deal-section">
                                    <label className="section-label">Technical Specification</label>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Transmission (MT/AT)" className="deal-input" value={form.transmission} onChange={e => setForm({...form, transmission: e.target.value})} />
                                        <input type="text" placeholder="Fuel Type" className="deal-input" value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value})} />
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Engine (e.g. 2.0L V6)" className="deal-input" value={form.engine} onChange={e => setForm({...form, engine: e.target.value})} />
                                        <input type="text" placeholder="Horsepower" className="deal-input" value={form.hp} onChange={e => setForm({...form, hp: e.target.value})} />
                                    </div>
                                    <div className="deal-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="text" placeholder="Torque" className="deal-input" value={form.torque} onChange={e => setForm({...form, torque: e.target.value})} />
                                        <input type="text" placeholder="Safety Features" className="deal-input" value={form.safety} onChange={e => setForm({...form, safety: e.target.value})} />
                                    </div>
                                    <label className="section-label" style={{ marginTop: '1rem' }}>Additional Features & Info</label>
                                    <div className="deal-form-group">
                                        <textarea placeholder="List other features (GPS, Sunroof, Leather Seats, etc.)" className="deal-textarea" value={form.promoPrice} onChange={e => setForm({...form, promoPrice: e.target.value})} style={{ height: '80px' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="user-modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                                <div className="status-selector">
                                    <label>Vehicle Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="status-select">
                                        <option value="open">Open Availability</option>
                                        <option value="in-progress">In Negotiation / Reserved</option>
                                        <option value="pending_deal">Pending Final Approval</option>
                                        <option value="sold">{isSuperAdmin ? 'Archive Directly' : 'Report as Sold'}</option>
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
