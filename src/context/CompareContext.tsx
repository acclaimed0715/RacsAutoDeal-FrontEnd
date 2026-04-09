import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Vehicle } from '../types';

interface CompareContextType {
    selectedCars: Vehicle[];
    addToCompare: (car: Vehicle) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCars, setSelectedCars] = useState<Vehicle[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('compare_cars');
        if (saved) {
            try {
                setSelectedCars(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse compare_cars from localStorage');
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('compare_cars', JSON.stringify(selectedCars));
    }, [selectedCars]);

    const addToCompare = (car: Vehicle) => {
        if (selectedCars.length >= 4) {
            alert('You can only compare up to 4 cars at a time.');
            return;
        }
        if (!selectedCars.find(c => c.id === car.id)) {
            setSelectedCars(prev => [...prev, car]);
        }
    };

    const removeFromCompare = (id: string) => {
        setSelectedCars(prev => prev.filter(c => c.id !== id));
    };

    const clearCompare = () => {
        setSelectedCars([]);
    };

    const isInCompare = (id: string) => {
        return !!selectedCars.find(c => c.id === id);
    };

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
