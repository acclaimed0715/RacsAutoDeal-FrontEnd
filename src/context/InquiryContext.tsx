import React, { createContext, useContext, useState, useCallback } from 'react';
import { type Vehicle } from '../types';

export interface ActiveInquiry {
    carId: string;
    carName: string;
    carPrice: number;
    carImage?: string;
    isMinimized: boolean;
    draftMessage: string;
    userEmail: string;
}

interface InquiryContextType {
    inquiries: ActiveInquiry[];
    openInquiry: (car: Vehicle) => void;
    closeInquiry: (carId: string) => void;
    toggleMinimize: (carId: string) => void;
    updateDraft: (carId: string, message: string) => void;
    updateEmail: (carId: string, email: string) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inquiries, setInquiries] = useState<ActiveInquiry[]>([]);

    const openInquiry = useCallback((car: Vehicle) => {
        setInquiries(prev => {
            const existing = prev.find(i => i.carId === car.id);
            if (existing) {
                // Return same list but ensure it's not minimized
                return prev.map(i => i.carId === car.id ? { ...i, isMinimized: false } : i);
            }
            const newInquiry: ActiveInquiry = {
                carId: car.id,
                carName: car.name,
                carPrice: car.price,
                carImage: car.images && car.images[0],
                isMinimized: false,
                draftMessage: '', // Starting empty, logic in composer will set default or it's fine
                userEmail: ''
            };
            return [...prev, newInquiry];
        });
    }, []);

    const closeInquiry = useCallback((carId: string) => {
        setInquiries(prev => prev.filter(i => i.carId !== carId));
    }, []);

    const toggleMinimize = useCallback((carId: string) => {
        setInquiries(prev => prev.map(i => 
            i.carId === carId ? { ...i, isMinimized: !i.isMinimized } : i
        ));
    }, []);

    const updateDraft = useCallback((carId: string, message: string) => {
        setInquiries(prev => prev.map(i => 
            i.carId === carId ? { ...i, draftMessage: message } : i
        ));
    }, []);

    const updateEmail = useCallback((carId: string, email: string) => {
        setInquiries(prev => prev.map(i => 
            i.carId === carId ? { ...i, userEmail: email } : i
        ));
    }, []);

    return (
        <InquiryContext.Provider value={{ 
            inquiries, openInquiry, closeInquiry, toggleMinimize, updateDraft, updateEmail 
        }}>
            {children}
        </InquiryContext.Provider>
    );
};

export const useInquiry = () => {
    const context = useContext(InquiryContext);
    if (!context) throw new Error('useInquiry must be used within an InquiryProvider');
    return context;
};
