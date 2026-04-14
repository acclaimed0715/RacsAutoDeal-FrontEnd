import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import FilterSidebar from './FilterSidebar';
import CarCard from './CarCard';

const ITEMS_PER_PAGE = 10;

const Inventory: React.FC = () => {
    const { cars } = useInventory();
    
    // Filter State
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [brandSearch, setBrandSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeTypes, setActiveTypes] = useState<string[]>([]);
    const [activeCategories, setActiveCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCars = useMemo(() => {
        // Only hide confirmed-sold (archived) cars.
        // Pending-sold (status=sold but not yet archived = awaiting super admin approval) stays visible.
        let list = Object.values(cars).filter(c => !c.isArchived);

        if (brandSearch) {
            const s = brandSearch.toLowerCase();
            list = list.filter(c => 
                c.brand.toLowerCase().includes(s) || 
                c.name.toLowerCase().includes(s) || 
                c.type?.toLowerCase().includes(s) ||
                c.modelYear?.toLowerCase().includes(s)
            );
        }

        if (minPrice) {
            const min = parseInt(minPrice);
            list = list.filter(c => (parseInt(c.price.replace(/[^0-9]/g, '')) || 0) >= min);
        }

        if (maxPrice) {
            const max = parseInt(maxPrice);
            list = list.filter(c => (parseInt(c.price.replace(/[^0-9]/g, '')) || 0) <= max);
        }

        if (activeTypes.length > 0) {
            list = list.filter(c => activeTypes.includes((c.type || '').toLowerCase()));
        }

        if (activeCategories.length > 0) {
            list = list.filter(car => {
                const badges: string[] = [];
                
                // New logic: New if < 5 days
                if (car.createdAt) {
                    const created = new Date(car.createdAt);
                    const now = new Date();
                    const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
                    if (diffDays < 5) badges.push('new');
                }

                // Best Deal logic: from backend
                if (car.isBestDeal) badges.push('best deal');

                // Legacy hardcoded fallback if needed (though it should be dynamic now)
                if (car.id === 'escape2012_titanium') badges.push('most clicked');

                return activeCategories.some(cat => badges.includes(cat.toLowerCase()));
            });
        }

        return list;
    }, [cars, view, brandSearch, minPrice, maxPrice, activeTypes, activeCategories]);

    const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
    const paginatedCars = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const resetFilters = () => {
        setBrandSearch('');
        setMinPrice('');
        setMaxPrice('');
        setActiveTypes([]);
        setActiveCategories([]);
    };

    const toggleType = (t: string) => setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    const toggleCategory = (c: string) => setActiveCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

    return (
        <section id="inventory" className="inventory-section">
            <div className="inventory-content">
                <FilterSidebar 
                    brandSearch={brandSearch} setBrandSearch={setBrandSearch}
                    minPrice={minPrice} setMinPrice={setMinPrice}
                    maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                    activeTypes={activeTypes} toggleType={toggleType}
                    activeCategories={activeCategories} toggleCategory={toggleCategory}
                    resetFilters={resetFilters}
                />

                <div className="inventory-main">
                    <div className="inventory-header">
                        <h2 className="category-title">
                            All Vehicles
                        </h2>
                        <div className="view-toggles">
                            <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => { setView('grid'); setCurrentPage(1); }} title="Grid View">
                                <i className="fa-solid fa-grip"></i>
                            </button>
                            <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => { setView('list'); setCurrentPage(1); }} title="List View">
                                <i className="fa-solid fa-list"></i>
                            </button>
                        </div>
                    </div>

                    <div className={`car-grid ${view !== 'list' ? 'grid-view' : ''}`}>
                        {paginatedCars.length === 0 ? (
                            <div className="empty-fav-message" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#666', fontStyle: 'italic', fontSize: '1.2rem' }}>
                                No vehicles found matching your filters.
                            </div>
                        ) : (
                            paginatedCars.map(car => (
                                <CarCard 
                                    key={car.id} 
                                    car={car}
                                    viewMode={view}
                                />
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button className="page-btn prev-page" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <div className="page-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <div key={p} className={`page-num ${p === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>
                                        {p}
                                    </div>
                                ))}
                            </div>
                            <button className="page-btn next-page" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Inventory;
