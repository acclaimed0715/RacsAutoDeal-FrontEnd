import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Vehicle, type UserReport, type AppSettings, type AdminNotification, type StaffMember } from '../types';
import api from '../utils/api';


interface InventoryContextType {
    cars: Record<string, Vehicle>;
    reports: UserReport[];
    settings: AppSettings;
    staff: StaffMember[];
    currentUser: StaffMember | null;
    notifications: AdminNotification[];
    isLoading: boolean;
    loginStaff: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logoutStaff: () => void;
    addVehicle: (vehicle: Vehicle) => Promise<void>;
    updateVehicle: (vehicle: Vehicle) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
    requestDeletionVehicle: (id: string, requestedBy: string, remarks: string) => Promise<void>;
    resolveDeletion: (id: string, action: 'approve' | 'reject') => Promise<void>;
    resolveSale: (id: string, action: 'approve' | 'reject') => Promise<void>;
    addStaff: (
        staff: Partial<StaffMember>
    ) => Promise<{
        success: boolean;
        welcomeEmailSent?: boolean;
        welcomeEmailError?: string;
        error?: string;
    }>;
    updateStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
    changePassword: (id: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    deleteStaff: (id: string) => Promise<void>;
    addReport: (report: UserReport) => Promise<void>;
    resolveReport: (id: string) => Promise<void>;
    reopenReport: (id: string) => Promise<void>;
    deleteReport: (id: string) => Promise<void>;
    addInquiry: (carId: string, carName: string, userEmail: string, message: string) => Promise<void>;
    sendReply: (inquiryId: string, replyMessage: string) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string; error?: string }>;
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
        const storedUserRaw = localStorage.getItem('racs_staff_member');
        const parsedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
        if (parsedUser) setCurrentUser(parsedUser);

        const fetchData = async () => {
            try {
                // Fetch admin cars if logged in, otherwise fetch public cars
                const carsUrl = parsedUser ? `/cars/admin` : `/cars`;
                const [carsRes, settingsRes, reportsRes, staffRes] = await Promise.all([
                    api.get(carsUrl),
                    api.get(`/settings`),
                    parsedUser && parsedUser.role === 'SUPER_ADMIN' ? api.get(`/reports`) : Promise.resolve({ data: [] }),
                    parsedUser && parsedUser.role === 'SUPER_ADMIN' ? api.get(`/staff`) : Promise.resolve({ data: [] })
                ]);

                const carsDataRaw = carsRes.data;
                const settingsData: AppSettings = settingsRes.data;
                const reportsData: UserReport[] = reportsRes.data;
                const staffData: StaffMember[] = staffRes.data;

                const carsMap: Record<string, Vehicle> = {};
                const carsData = Array.isArray(carsDataRaw) ? carsDataRaw : [];
                carsData.forEach(c => {
                    if (c && c.id) carsMap[c.id] = c;
                });

                setCars(carsMap);
                setReports(reportsData);
                setSettings(settingsData);
                setStaff(staffData);

                if (parsedUser) {
                    try {
                        const notifRes = await api.get(`/notifications`);
                        const notifData: AdminNotification[] = notifRes.data;
                        if (Array.isArray(notifData)) setNotifications(notifData);
                    } catch {
                        setNotifications([]);
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

    // Local polling
    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;
        const tick = async () => {
            try {
                if (currentUser.role === 'SUPER_ADMIN') {
                    const [reportsRes, notifRes] = await Promise.all([
                        api.get(`/reports`),
                        api.get(`/notifications`),
                    ]);
                    const reportsData: UserReport[] = reportsRes.data;
                    const notifData: AdminNotification[] = notifRes.data;
                    
                    if (!cancelled) {
                        if (Array.isArray(reportsData)) setReports(reportsData);
                        if (Array.isArray(notifData)) setNotifications(notifData);
                    }
                } else {
                    const notifRes = await api.get(`/notifications`);
                    const notifData: AdminNotification[] = notifRes.data;
                    if (!cancelled && Array.isArray(notifData)) setNotifications(notifData);
                }
            } catch { /* ignore */ }
        };

        const interval = window.setInterval(tick, 8000);
        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
    }, [currentUser?.id, currentUser?.role]);

    const logoutStaff = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('racs_staff_member');
        window.location.href = '/login';
    }, []);

    // Idle session timeout
    useEffect(() => {
        if (!currentUser) return;
        const timeoutSeconds = Math.max(0, Number(settings.sessionTimeout) || 0);
        if (timeoutSeconds <= 0) return;

        const lastActivityRef = { current: Date.now() };

        let throttleUntil = 0;
        const markActivity = () => {
            const now = Date.now();
            if (now < throttleUntil) return;
            throttleUntil = now + 400;
            lastActivityRef.current = now;
        };

        const events: (keyof WindowEventMap)[] = [
            'mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'
        ];
        events.forEach(ev => window.addEventListener(ev, markActivity, { passive: true }));

        const intervalId = window.setInterval(() => {
            const diff = Date.now() - lastActivityRef.current;
            if (diff > timeoutSeconds * 1000) {
                window.clearInterval(intervalId);
                logoutStaff();
                alert('Your session has expired due to inactivity.');
            }
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
            events.forEach(ev => window.removeEventListener(ev, markActivity));
        };
    }, [currentUser?.id, settings.sessionTimeout, logoutStaff]);

    const loginStaff = async (username: string, password: string) => {
        try {
            const res = await api.post(`/auth/login`, { username, password });
            const user = res.data;
            setCurrentUser(user);
            localStorage.setItem('racs_staff_member', JSON.stringify(user));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const addVehicle = async (vehicle: Vehicle) => {
        try {
            const res = await api.post(`/cars`, vehicle);
            const newCar = res.data;
            setCars(prev => ({ ...prev, [newCar.id]: newCar }));
        } catch (error: any) {
            console.error('Add vehicle error:', error);
        }
    };

    const updateVehicle = async (vehicle: Vehicle) => {
        try {
            const res = await api.put(`/cars/${vehicle.id}`, vehicle);
            const updatedCar = res.data;
            setCars(prev => ({ ...prev, [updatedCar.id]: updatedCar }));
        } catch (error: any) {
            console.error('Update vehicle error:', error);
        }
    };

    const deleteVehicle = async (id: string) => {
        try {
            await api.delete(`/cars/${id}`);
            setCars(prev => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        } catch (error: any) {
            console.error('Delete vehicle error:', error);
        }
    };

    const requestDeletionVehicle = async (id: string, requestedBy: string, remarks: string) => {
        try {
            const res = await api.post(`/cars/${id}/request-deletion`, { requestedBy, remarks });
            const updated = res.data;
            setCars(prev => ({ ...prev, [updated.id]: updated }));
        } catch (error: any) {
            console.error('Request deletion error:', error);
            throw error;
        }
    };

    const resolveDeletion = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await api.post(`/cars/${id}/resolve-deletion`, { action });
            if (action === 'approve') {
                setCars(prev => {
                    const { [id]: _, ...rest } = prev;
                    return rest;
                });
            } else {
                const updated = res.data;
                setCars(prev => ({ ...prev, [updated.id]: updated }));
            }
        } catch (error: any) {
            console.error('Resolve deletion error:', error);
        }
    };

    const resolveSale = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await api.post(`/cars/${id}/resolve-sale`, { action });
            const updatedCar = res.data;
            setCars(prev => ({ ...prev, [updatedCar.id]: updatedCar }));
        } catch (error: any) {
            console.error('Resolve sale error:', error);
        }
    };

    const addStaff = async (data: Partial<StaffMember>) => {
        try {
            const res = await api.post(`/staff`, data);
            const payload = res.data;
            const { welcomeEmailSent = false, welcomeEmailError, ...newStaff } = payload;
            setStaff(prev => [newStaff as StaffMember, ...prev]);
            return { success: true, welcomeEmailSent, welcomeEmailError };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.error || 'Could not create staff' };
        }
    };

    const updateStaff = async (id: string, data: Partial<StaffMember>) => {
        try {
            const res = await api.put(`/staff/${id}`, data);
            const updated = res.data;
            setStaff(prev => prev.map(s => s.id === id ? updated : s));
        } catch (error: any) {
            console.error('Update staff error:', error);
        }
    };

    const changePassword = async (id: string, currentPassword: string, newPassword: string) => {
        try {
            await api.put(`/staff/${id}/change-password`, { currentPassword, newPassword });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.error || 'Password change failed' };
        }
    };

    const deleteStaff = async (id: string) => {
        try {
            await api.delete(`/staff/${id}`);
            setStaff(prev => prev.filter(s => s.id !== id));
        } catch (error: any) {
            console.error('Delete staff error:', error);
        }
    };

    const addReport = async (report: UserReport) => {
        try {
            const res = await api.post(`/reports`, report);
            setReports(prev => [...prev, res.data]);
        } catch (error: any) {
            console.error('Add report error:', error);
        }
    };

    const resolveReport = async (id: string) => {
        try {
            const res = await api.patch(`/reports/${id}`, { status: 'RESOLVED' });
            setReports(prev => prev.map(r => r.id === id ? res.data : r));
        } catch (error: any) {
            console.error('Resolve report error:', error);
        }
    };

    const reopenReport = async (id: string) => {
        try {
            const res = await api.patch(`/reports/${id}`, { status: 'REOPENED' });
            setReports(prev => prev.map(r => r.id === id ? res.data : r));
        } catch (error: any) {
            console.error('Reopen report error:', error);
        }
    };

    const deleteReport = async (id: string) => {
        try {
            await api.delete(`/reports/${id}`);
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (error: any) {
            console.error('Delete report error:', error);
        }
    };

    const addInquiry = async (carId: string, carName: string, userEmail: string, message: string) => {
        try {
            await api.post(`/inquiries`, { carId, carName, userEmail, message });
        } catch (error: any) {
            console.error('Add inquiry error:', error);
            throw error;
        }
    };

    const sendReply = async (inquiryId: string, replyMessage: string) => {
        try {
            await api.post(`/inquiries/${inquiryId}/reply`, { replyMessage });
        } catch (error: any) {
            console.error('Send reply error:', error);
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            const res = await api.post(`/auth/forgot-password`, { email });
            return { success: true, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.error || 'Request failed' };
        }
    };

    const resetPassword = async (email: string, otp: string, newPassword: string) => {
        try {
            const res = await api.post(`/auth/reset-password`, { email, otp, newPassword });
            return { success: true, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.error || 'Reset failed' };
        }
    };

    const updateSettings = async (newSettings: AppSettings) => {
        try {
            const res = await api.put(`/settings`, newSettings);
            setSettings(res.data);
        } catch (error: any) {
            console.error('Update settings error:', error);
        }
    };

    const addNotification = (title: string, message: string, type: AdminNotification['type'], sender: string) => {
        const newNotif: AdminNotification = {
            id: 'notif_' + Date.now(),
            title, message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false, type, sender
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    };

    const markAllNotificationsRead = async () => {
        try {
            await api.patch(`/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error: any) {
            console.error('Mark read notifications error:', error);
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
            addReport, resolveReport, reopenReport, deleteReport,
            addInquiry, sendReply,
            requestPasswordReset, resetPassword,
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
