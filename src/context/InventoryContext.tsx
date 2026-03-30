import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Vehicle, type UserReport, type AppSettings, type AdminNotification } from '../types';
import { INITIAL_CARS } from '../constants/initialCars';

interface InventoryContextType {
    cars: Record<string, Vehicle>;
    reports: UserReport[];
    settings: AppSettings;
    notifications: AdminNotification[];
    addVehicle: (vehicle: Vehicle) => void;
    updateVehicle: (vehicle: Vehicle) => void;
    deleteVehicle: (id: string) => void;
    addReport: (report: UserReport) => void;
    resolveReport: (id: string) => void;
    deleteReport: (id: string) => void;
    updateSettings: (settings: AppSettings) => void;
    addNotification: (title: string, message: string, type: AdminNotification['type'], sender: string) => void;
    clearNotifications: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INVENTORY_KEY = 'racs_car_inventory';
const REPORTS_KEY = 'racs_reports';
const SETTINGS_KEY = 'racs_settings';
const NOTIF_KEY = 'racs_admin_notifications';

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cars, setCars] = useState<Record<string, Vehicle>>(INITIAL_CARS);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [settings, setSettings] = useState<AppSettings>({
        businessName: 'Racs Auto Deal',
        contactEmail: 'contact@racsautodeal.com',
        phone: '+63 912 345 6789',
        address: 'No. 7 N.I.A. Road, Carsadang Bago 2, Imus, Cavite',
        adminPassword: 'admin123',
        sessionTimeout: 60,
        emailNotif: true,
        stockNotif: true,
        theme: 'dark',
        currency: '₱',
        vehicleTypes: ['SUV', 'Sedan', 'Electric Car', 'Hatchback', 'Van', 'Sports Car', 'Coupe']
    });
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);

    useEffect(() => {
        // Load Inventory
        const storedInventory = localStorage.getItem(INVENTORY_KEY);
        if (storedInventory) {
            try {
                const adminCars = JSON.parse(storedInventory) as Vehicle[];
                setCars(prev => {
                    const newCars = { ...prev };
                    adminCars.forEach(car => {
                        newCars[car.id] = {
                            ...car
                        };
                    });
                    return newCars;
                });
            } catch (e) {
                console.error('Failed to load inventory', e);
            }
        }

        // Load Reports
        const storedReports = localStorage.getItem(REPORTS_KEY);
        if (storedReports) {
            setReports(JSON.parse(storedReports));
        } else {
            const initialReports: UserReport[] = [
                { id: 'rep1', userName: 'Unknown User', userEmail: 'unknown@example.com', reason: 'Technical Issue', description: 'The homepage takes too long to load on my mobile device.', date: 'Mar 26, 2026', status: 'PENDING' },
                { id: 'rep2', userName: 'Alex Lee', userEmail: 'alex.lee@gmail.com', reason: 'Sold Vehicle Still Listed', description: 'I saw the Ford Escape 2012 marked as sold on Facebook but it is still open here.', date: 'Mar 27, 2026', status: 'PENDING' }
            ];
            setReports(initialReports);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(initialReports));
        }

        // Load Settings
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        if (storedSettings) setSettings(JSON.parse(storedSettings));

        // Load Notifications
        const storedNotifs = localStorage.getItem(NOTIF_KEY);
        if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    }, []);

    const addVehicle = (vehicle: Vehicle) => {
        setCars(prev => {
            const newCars = { ...prev, [vehicle.id]: vehicle };
            const adminCars = Object.values(newCars).filter(c => !INITIAL_CARS[c.id] || c.id === 'escape2012_titanium'); // Keep non-static or manual overrides
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(adminCars));
            return newCars;
        });
    };

    const updateVehicle = (vehicle: Vehicle) => addVehicle(vehicle);

    const deleteVehicle = (id: string) => {
        setCars(prev => {
            const { [id]: _, ...rest } = prev;
            const adminCars = Object.values(rest).filter(c => !INITIAL_CARS[c.id]);
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(adminCars));
            return rest;
        });
    };

    const addReport = (report: UserReport) => {
        setReports(prev => {
            const updated = [...prev, report];
            localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const resolveReport = (id: string) => {
        setReports(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, status: 'RESOLVED' } as UserReport : r);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const deleteReport = (id: string) => {
        setReports(prev => {
            const updated = prev.filter(r => r.id !== id);
            localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const updateSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    };

    const addNotification = (title: string, message: string, type: AdminNotification['type'], sender: string) => {
        const newNotif: AdminNotification = {
            id: 'notif_' + Date.now(),
            title,
            message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            type,
            sender
        };
        setNotifications(prev => {
            const updated = [newNotif, ...prev].slice(0, 20);
            localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.setItem(NOTIF_KEY, JSON.stringify([]));
    };

    return (
        <InventoryContext.Provider value={{
            cars, reports, settings, notifications,
            addVehicle, updateVehicle, deleteVehicle,
            addReport, resolveReport, deleteReport,
            updateSettings, addNotification, clearNotifications
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) throw new Error('useInventory must be used within an InventoryProvider');
    return context;
};
