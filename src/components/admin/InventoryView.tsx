import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { type Vehicle } from '../../types';

const InventoryView: React.FC = () => {
    const { cars, deleteVehicle, addVehicle, updateVehicle } = useInventory();
    const inventory = Object.values(cars);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Vehicle | null>(null);

    const [form, setForm] = useState<Partial<Vehicle>>({});
    const [imageUrls, setImageUrls] = useState<string[]>(['']);
    const isSuperAdmin = localStorage.getItem('currentUserRole') === 'Super Admin';

    const openAdd = () => {
        setEditingCar(null);
        setForm({
            name: '', price: '', modelYear: '', mileage: '', brand: '',
            transmission: '', fuelType: '', engine: '', hp: '', torque: '',
            safety: '', seating: '', description: '', status: 'open', type: 'SUV',
            images: [],
            date: new Date().toLocaleDateString()
        });
        setImageUrls(['', '', '']); // Start with 3 empty fields
        setIsModalOpen(true);
    };

    const openEdit = (car: Vehicle) => {
        setEditingCar(car);
        setForm(car);
        // Ensure at least 3 inputs if editing
        const existingImages = [...car.images];
        while (existingImages.length < 3) existingImages.push('');
        setImageUrls(existingImages);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation for images: Min 3, Max 5
        const validImages = imageUrls.filter(url => url.trim() !== '');
        if (validImages.length < 3 || validImages.length > 5) {
            alert('Please provide between 3 and 5 valid image URLs.');
            return;
        }

        const carData = {
            ...form,
            id: editingCar ? editingCar.id : 'car_' + Date.now(),
            price: form.price?.startsWith('₱') ? form.price : '₱' + form.price,
            images: validImages
        } as Vehicle;

        if (editingCar) updateVehicle(carData);
        else addVehicle(carData);

        setIsModalOpen(false);
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
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(car => (
                            <tr key={car.id}>
                                <td>{car.name}</td>
                                <td>{car.type}</td>
                                <td>{car.price}</td>
                                <td><span className={`badge ${car.status === 'open' ? 'in-progress' : (car.status === 'pending_deal' ? 'pending' : 'closed')}`}>{car.status.toUpperCase().replace('_', ' ')}</span></td>
                                <td>
                                    <button className="icon-btn" onClick={() => openEdit(car)}><i className="fa-solid fa-pen"></i></button>
                                    {(isSuperAdmin || car.status !== 'pending_deal') && (
                                        <button className="icon-btn" onClick={() => {
                                            if (window.confirm(`Are you sure you want to completely delete ${car.name}?`)) {
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
                    <div className="user-modal active" style={{ display: 'block', maxWidth: '800px' }}>
                        <div className="user-modal-header">
                            <h3>{editingCar ? 'Edit Deal' : 'Add Deal'}</h3>
                            <span className="close-user-modal" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-circle-xmark"></i></span>
                        </div>
                        <form onSubmit={handleSubmit} className="user-modal-body">
                            <div className="deal-section">
                                <label className="section-label">Car Details</label>
                                <div className="deal-form-group">
                                    <input type="text" placeholder="Car Name" className="deal-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                </div>
                                <div className="deal-form-row">
                                    <input type="text" placeholder="Price" className="deal-input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                                    <select className="deal-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ color: 'white', background: 'var(--input-bg)' }}>
                                        <option value="SUV">SUV</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="Electric Car">Electric Car</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Van">Van</option>
                                        <option value="Sports Car">Sports Car</option>
                                        <option value="Coupe">Coupe</option>
                                    </select>
                                </div>
                                <div className="deal-form-row">
                                    <input type="text" placeholder="Model/Year" className="deal-input" value={form.modelYear} onChange={e => setForm({...form, modelYear: e.target.value})} />
                                    <input type="text" placeholder="Brand" className="deal-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                                </div>
                                <div className="deal-form-group">
                                    <textarea placeholder="Description" className="deal-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                                </div>
                                
                                <label className="section-label" style={{ marginTop: '1.5rem' }}>Vehicle Images (Min 3, Max 5)</label>
                                {imageUrls.map((url, idx) => (
                                    <div className="deal-form-group" key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder={`Image URL ${idx + 1}`} 
                                            className="deal-input" 
                                            value={url} 
                                            onChange={(e) => {
                                                const newUrls = [...imageUrls];
                                                newUrls[idx] = e.target.value;
                                                setImageUrls(newUrls);
                                            }} 
                                            style={{ flex: 1 }}
                                            required={idx < 3} // Require first 3
                                        />
                                        {idx >= 3 && (
                                            <button type="button" className="icon-btn" onClick={() => {
                                                const newUrls = imageUrls.filter((_, i) => i !== idx);
                                                setImageUrls(newUrls);
                                            }} style={{ color: 'var(--primary)', background: 'transparent', border: 'none' }}><i className="fa-solid fa-xmark"></i></button>
                                        )}
                                    </div>
                                ))}
                                {imageUrls.length < 5 && (
                                    <button type="button" onClick={() => setImageUrls([...imageUrls, ''])} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        + Add Another Image
                                    </button>
                                )}
                            </div>
                            <div className="user-modal-footer">
                                <div className="status-selector">
                                    <label>Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})} className="status-select">
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="pending_deal">Done Deal (Pending)</option>
                                        {isSuperAdmin && <option value="sold">Sold / Delist</option>}
                                    </select>
                                </div>
                                <button type="submit" className="user-add-btn">{editingCar ? 'Update Deal' : 'Add Deal'}</button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default InventoryView;
