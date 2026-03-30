import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Vehicle, type UserReport, type AppSettings, type AdminNotification, type StaffMember } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

interface InventoryContextType {
    cars: Record<string, Vehicle>;
    reports: UserReport[];
    settings: AppSettings;
    staff: StaffMember[];
    currentUser: StaffMember | null;
    notifications: AdminNotification[];
    isLoading: boolean;
    loginStaff: (username: string, password: string) => Promise<boolean>;
    logoutStaff: () => void;
    addVehicle: (vehicle: Vehicle) => Promise<void>;
    updateVehicle: (vehicle: Vehicle) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
    resolveSale: (id: string, action: 'approve' | 'reject') => Promise<void>;
    addStaff: (staff: Partial<StaffMember>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    addReport: (report: UserReport) => Promise<void>;
    resolveReport: (id: string) => Promise<void>;
    deleteReport: (id: string) => Promise<void>;
    updateSettings: (settings: AppSettings) => Promise<void>;
    addNotification: (title: string, message: string, type: AdminNotification['type'], sender: string) => void;
    clearNotifications: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cars, setCars] = useState<Record<string, Vehicle>>({});
    const [reports, setReports] = useState<UserReport[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
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
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const storedUser = localStorage.getItem('racs_staff_member');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));

        const fetchData = async () => {
            try {
                // Fetch admin cars if logged in, otherwise fetch public cars
                const carsUrl = storedUser ? `${API_BASE_URL}/admin/cars` : `${API_BASE_URL}/cars`;
                const [carsRes, reportsRes, settingsRes, staffRes] = await Promise.all([
                    fetch(carsUrl),
                    fetch(`${API_BASE_URL}/reports`),
                    fetch(`${API_BASE_URL}/settings`),
                    storedUser ? fetch(`${API_BASE_URL}/staff`) : Promise.resolve({ json: () => [] })
                ]);

                const carsData: Vehicle[] = await carsRes.json();
                const reportsData: UserReport[] = await reportsRes.json();
                const settingsData: AppSettings = await settingsRes.json();
                const staffData: StaffMember[] = await (staffRes as any).json();

                const carsMap: Record<string, Vehicle> = {};
                if (Array.isArray(carsData)) carsData.forEach(c => carsMap[c.id] = c);

                setCars(carsMap);
                setReports(reportsData);
                setSettings(settingsData);
                setStaff(staffData);
            } catch (error) {
                console.error('Failed to fetch data from backend', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const loginStaff = async (username: string, password: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
                localStorage.setItem('racs_staff_member', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logoutStaff = () => {
        setCurrentUser(null);
        localStorage.removeItem('racs_staff_member');
        window.location.href = '/login';
    };

    const addVehicle = async (vehicle: Vehicle) => {
        try {
            const res = await fetch(`${API_BASE_URL}/cars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicle)
            });
            const newCar = await res.json();
            setCars(prev => ({ ...prev, [newCar.id]: newCar }));
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const updateVehicle = async (vehicle: Vehicle) => {
        try {
            const res = await fetch(`${API_BASE_URL}/cars/${vehicle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicle)
            });
            const updatedCar = await res.json();
            setCars(prev => ({ ...prev, [updatedCar.id]: updatedCar }));
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    const deleteVehicle = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/cars/${id}`, { method: 'DELETE' });
            setCars(prev => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const resolveSale = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`${API_BASE_URL}/cars/${id}/resolve-sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const updatedCar = await res.json();
            setCars(prev => ({ ...prev, [updatedCar.id]: updatedCar }));
            
            addNotification(
                action === 'approve' ? 'Sale Approved' : 'Sale Rejected',
                `Deal for ${updatedCar.name} has been ${action === 'approve' ? 'archived' : 'rejected'}.`,
                action === 'approve' ? 'success' : 'warning',
                'Super Admin'
            );
        } catch (error) {
            console.error('Error resolving sale:', error);
        }
    };

    const addStaff = async (data: Partial<StaffMember>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const newStaff = await res.json();
            setStaff(prev => [newStaff, ...prev]);
        } catch (error) {
            console.error('Error adding staff:', error);
        }
    };

    const deleteStaff = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/staff/${id}`, { method: 'DELETE' });
            setStaff(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

    const addReport = async (report: UserReport) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
            const newReport = await res.json();
            setReports(prev => [...prev, newReport]);
        } catch (error) {
            console.error('Error adding report:', error);
        }
    };

    const resolveReport = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'RESOLVED' })
            });
            const updatedReport = await res.json();
            setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    const deleteReport = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/reports/${id}`, { method: 'DELETE' }); // You'll need to add this endpoint to index.ts
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    const updateSettings = async (newSettings: AppSettings) => {
        try {
            const res = await fetch(`${API_BASE_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            const savedSettings = await res.json();
            setSettings(savedSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const addNotification = (title: string, message: string, type: AdminNotification['type'], sender: string) => {
        const newNotif: AdminNotification = {
            id: 'notif_' + Date.now(),
            title, message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false, type, sender
        };
        setNotifications(prev => {
            const updated = [newNotif, ...prev].slice(0, 20);
            localStorage.setItem('racs_admin_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.setItem('racs_admin_notifications', JSON.stringify([]));
    };

    return (
        <InventoryContext.Provider value={{
            cars, reports, settings, staff, currentUser, notifications, isLoading,
            loginStaff, logoutStaff,
            addVehicle, updateVehicle, deleteVehicle, resolveSale,
            addStaff, deleteStaff,
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

