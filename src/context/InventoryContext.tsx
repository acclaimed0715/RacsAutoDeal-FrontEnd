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
    requestDeletionVehicle: (id: string, requestedBy: string, remarks: string) => Promise<void>;
    resolveDeletion: (id: string, action: 'approve' | 'reject') => Promise<void>;
    resolveSale: (id: string, action: 'approve' | 'reject') => Promise<void>;
    addStaff: (staff: Partial<StaffMember>) => Promise<void>;
    updateStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
    changePassword: (id: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    deleteStaff: (id: string) => Promise<void>;
    addReport: (report: UserReport) => Promise<void>;
    resolveReport: (id: string) => Promise<void>;
    deleteReport: (id: string) => Promise<void>;
    updateSettings: (settings: AppSettings) => Promise<void>;
    addNotification: (title: string, message: string, type: AdminNotification['type'], sender: string) => void;
    markAllNotificationsRead: () => Promise<void>;
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

                // Load notifications from backend if logged in as SUPER_ADMIN
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.role === 'SUPER_ADMIN') {
                        try {
                            const notifRes = await fetch(`${API_BASE_URL}/notifications`);
                            const notifData: AdminNotification[] = await notifRes.json();
                            if (Array.isArray(notifData)) setNotifications(notifData);
                        } catch { /* non-critical */ }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data from backend', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Keep super admin reports / notifications in sync without requiring a manual refresh.
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'SUPER_ADMIN') return;

        let cancelled = false;
        const interval = window.setInterval(async () => {
            try {
                const [reportsRes, notifRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/reports`),
                    fetch(`${API_BASE_URL}/notifications`),
                ]);

                const [reportsData, notifData]: [UserReport[], AdminNotification[]] = await Promise.all([
                    reportsRes.json(),
                    notifRes.json(),
                ]);

                if (!cancelled) {
                    if (Array.isArray(reportsData)) setReports(reportsData);
                    if (Array.isArray(notifData)) setNotifications(notifData);
                }
            } catch (e) {
                // Non-critical: polling failures should not break the admin UI.
            }
        }, 7000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [currentUser?.role]);

    // Session timeout (in seconds) based on settings.sessionTimeout
    useEffect(() => {
        if (!currentUser) return;
        const timeoutSeconds = settings.sessionTimeout || 0;
        if (timeoutSeconds <= 0) return;

        let lastActivity = Date.now();
        const markActivity = () => {
            lastActivity = Date.now();
        };

        const events: Array<keyof WindowEventMap> = ['click', 'mousemove', 'keydown', 'scroll'];
        events.forEach(ev => window.addEventListener(ev, markActivity));

        const intervalId = window.setInterval(() => {
            const diff = Date.now() - lastActivity;
            if (diff > timeoutSeconds * 1000) {
                window.clearInterval(intervalId);
                events.forEach(ev => window.removeEventListener(ev, markActivity));
                logoutStaff();
                alert('Your admin session has expired due to inactivity.');
            }
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
            events.forEach(ev => window.removeEventListener(ev, markActivity));
        };
    }, [currentUser?.id, settings.sessionTimeout]);

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

    const requestDeletionVehicle = async (id: string, requestedBy: string, remarks: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/cars/${id}/request-deletion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestedBy, remarks }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error((err as { error?: string }).error || 'Request failed');
            }
            const updated = await res.json();
            setCars(prev => ({ ...prev, [updated.id]: updated }));
            try {
                const notifRes = await fetch(`${API_BASE_URL}/notifications`);
                const notifData: AdminNotification[] = await notifRes.json();
                if (Array.isArray(notifData)) setNotifications(notifData);
            } catch { /* non-critical */ }
        } catch (error) {
            console.error('Error requesting deletion:', error);
            throw error;
        }
    };

    const resolveDeletion = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`${API_BASE_URL}/cars/${id}/resolve-deletion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (action === 'approve' && res.status === 204) {
                setCars(prev => {
                    const { [id]: _, ...rest } = prev;
                    return rest;
                });
            } else if (action === 'reject' && res.ok) {
                const updated = await res.json();
                setCars(prev => ({ ...prev, [updated.id]: updated }));
            }
            try {
                const notifRes = await fetch(`${API_BASE_URL}/notifications`);
                const notifData: AdminNotification[] = await notifRes.json();
                if (Array.isArray(notifData)) setNotifications(notifData);
            } catch { /* non-critical */ }
        } catch (error) {
            console.error('Error resolving deletion:', error);
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

            // Refresh notifications from backend after resolving
            try {
                const notifRes = await fetch(`${API_BASE_URL}/notifications`);
                const notifData: AdminNotification[] = await notifRes.json();
                if (Array.isArray(notifData)) setNotifications(notifData);
            } catch { /* non-critical */ }
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

    const updateStaff = async (id: string, data: Partial<StaffMember>) => {
        try {
            const res = await fetch(`${API_BASE_URL}/staff/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const updated = await res.json();
            setStaff(prev => prev.map(s => s.id === id ? updated : s));
        } catch (error) {
            console.error('Error updating staff:', error);
        }
    };

    const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/staff/${id}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, error: data.error || 'Failed to change password' };
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
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

    const markAllNotificationsRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'PATCH' });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking notifications read:', error);
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <InventoryContext.Provider value={{
            cars, reports, settings, staff, currentUser, notifications, isLoading,
            loginStaff, logoutStaff,
            addVehicle, updateVehicle, deleteVehicle, requestDeletionVehicle, resolveDeletion, resolveSale,
            addStaff, updateStaff, changePassword, deleteStaff,
            addReport, resolveReport, deleteReport,
            updateSettings, addNotification, markAllNotificationsRead, clearNotifications
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

