import React from 'react';
import { useInventory } from '../../context/InventoryContext';

interface FilterSidebarProps {
    brandSearch: string;
    setBrandSearch: (v: string) => void;
    minPrice: string;
    setMinPrice: (v: string) => void;
    maxPrice: string;
    setMaxPrice: (v: string) => void;
    activeTypes: string[];
    toggleType: (type: string) => void;
    activeCategories: string[];
    toggleCategory: (cat: string) => void;
    resetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    brandSearch, setBrandSearch,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    activeTypes, toggleType,
    activeCategories, toggleCategory,
    resetFilters
}) => {
    const { settings } = useInventory();
    const displayMinPrice = minPrice === '0' ? '' : minPrice;

    return (
        <aside className="filter-sidebar persistent-sidebar" id="filterSidebar">
            <div className="filter-header">
                <div className="filter-title">
                    <i className="fa-solid fa-filter"></i>
                    <h2>Filters</h2>
                </div>
            </div>

            <div className="filter-content">
                {/* Search Brand */}
                <div className="filter-group">
                    <div className="filter-group-header">
                        <div className="filter-group-title">
                            <i className="fa-solid fa-magnifying-glass"></i> SEARCH
                        </div>
                        <i className="fa-solid fa-chevron section-toggle"></i>
                    </div>
                    <div className="filter-search-input">
                        <input
                            type="text"
                            id="brandSearchInput"
                            placeholder="Search Here..."
                            value={brandSearch}
                            onChange={(e) => setBrandSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="filter-group">
                    <div className="filter-group-header">
                        <div className="filter-group-title">
                            <i className="fa-solid fa-layer-group"></i> CATEGORY
                        </div>
                        <i className="fa-solid fa-chevron-down section-toggle"></i>
                    </div>
                    <ul className="filter-list">
                        <li className={activeCategories.includes('new') ? 'active' : ''} onClick={() => toggleCategory('new')}><i className="fa-solid fa-arrow-trend-up"></i> New</li>
                        <li className={activeCategories.includes('best deal') ? 'active' : ''} onClick={() => toggleCategory('best deal')}><i className="fa-regular fa-star"></i> Best Deal</li>
                    </ul>
                </div>

                {/* Vehicle Type */}
                <div className="filter-group">
                    <div className="filter-group-header">
                        <div className="filter-group-title">
                            <i className="fa-solid fa-car"></i> VEHICLE TYPE
                        </div>
                        <i className="fa-solid fa-chevron-down section-toggle"></i>
                    </div>
                    <ul className="filter-list text-only">
                        {(settings.vehicleTypes || ['SUV', 'Sedan']).map(type => (
                            <li key={type} className={activeTypes.includes(type.toLowerCase()) ? 'active' : ''} onClick={() => toggleType(type.toLowerCase())}>
                                {type}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price */}
                <div className="filter-group">
                    <div className="filter-group-header">
                        <div className="filter-group-title">
                            <i className="fa-solid fa-tag"></i> PRICE RANGE
                        </div>
                        <i className="fa-solid fa-chevron-down section-toggle"></i>
                    </div>
                    <div className="price-range-inputs">
                        <div className="price-input-wrapper">
                            <span>MIN</span>
                            <input type="number" placeholder="Min Price" value={displayMinPrice} onChange={(e) => setMinPrice(e.target.value === '' ? '0' : e.target.value)} />
                        </div>
                        <div className="price-input-wrapper">
                            <span>MAX</span>
                            <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-footer">
                <button className="filter-reset-btn" onClick={resetFilters}>
                    <i className="fa-solid fa-rotate-left"></i> Reset Filters
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
