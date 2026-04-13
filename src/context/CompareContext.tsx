import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Vehicle } from '../types';
import { useInventory } from './InventoryContext';

interface CompareContextType {
    selectedCars: Vehicle[];
    addToCompare: (car: Vehicle) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { cars } = useInventory();
    const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        localStorage.removeItem('compare_cars'); // Clear legacy 5MB quota bloat

        const saved = localStorage.getItem('compare_cars_ids');
        if (saved) {
            try {
                setSelectedCarIds(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse compare_cars_ids from localStorage');
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('compare_cars_ids', JSON.stringify(selectedCarIds));
    }, [selectedCarIds]);

    const addToCompare = (car: Vehicle) => {
        if (selectedCarIds.length >= 4) {
            alert('You can only compare up to 4 cars at a time.');
            return;
        }
        if (!selectedCarIds.includes(car.id)) {
            setSelectedCarIds(prev => [...prev, car.id]);
        }
    };

    const removeFromCompare = (id: string) => {
        setSelectedCarIds(prev => prev.filter(carId => carId !== id));
    };

    const clearCompare = () => {
        setSelectedCarIds([]);
    };

    const isInCompare = (id: string) => {
        return selectedCarIds.includes(id);
    };

    // Hydrate vehicles securely from RAM
    const selectedCars = selectedCarIds.map(id => cars[id]).filter(c => !!c);

    return (
        <CompareContext.Provider value={{ selectedCars, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
