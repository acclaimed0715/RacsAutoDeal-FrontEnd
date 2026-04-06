import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Vehicle, type UserReport, type AppSettings, type AdminNotification, type StaffMember } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

/** Sent with notification requests so the API can filter IM login alerts (Super Admin only). */
function staffRoleHeaders(): HeadersInit {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('racs_staff_member') : null;
    if (!raw) return {};
    try {
        const u = JSON.parse(raw) as StaffMember;
        return { 'X-Staff-Role': u.role };
    } catch {
        return {};
    }
}

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

                if (storedUser) {
                    try {
                        const u = JSON.parse(storedUser) as StaffMember;
                        const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
                            headers: { 'X-Staff-Role': u.role },
                        });
                        const notifData: AdminNotification[] = await notifRes.json();
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

    // Poll reports + notifications for Super Admin; notifications only for Inventory Managers.
    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;
        const tick = async () => {
            try {
                if (currentUser.role === 'SUPER_ADMIN') {
                    const [reportsRes, notifRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/reports`),
                        fetch(`${API_BASE_URL}/notifications`, { headers: { 'X-Staff-Role': 'SUPER_ADMIN' } }),
                    ]);
                    const [reportsData, notifData]: [UserReport[], AdminNotification[]] = await Promise.all([
                        reportsRes.json(),
                        notifRes.json(),
                    ]);
                    if (!cancelled) {
                        if (Array.isArray(reportsData)) setReports(reportsData);
                        if (Array.isArray(notifData)) setNotifications(notifData);
                    }
                } else {
                    const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
                        headers: { 'X-Staff-Role': 'INVENTORY_MANAGER' },
                    });
                    const notifData: AdminNotification[] = await notifRes.json();
                    if (!cancelled && Array.isArray(notifData)) setNotifications(notifData);
                }
            } catch {
                /* non-critical */
            }
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

    // Idle session timeout (seconds from settings) — Super Admin & Inventory Manager
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
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'click',
            'wheel',
            'pointerdown',
        ];
        events.forEach(ev => window.addEventListener(ev, markActivity, { passive: true }));

        const onVisibility = () => {
            if (document.visibilityState === 'visible') markActivity();
        };
        document.addEventListener('visibilitychange', onVisibility);

        const intervalId = window.setInterval(() => {
            const diff = Date.now() - lastActivityRef.current;
            if (diff > timeoutSeconds * 1000) {
                window.clearInterval(intervalId);
                events.forEach(ev => window.removeEventListener(ev, markActivity));
                document.removeEventListener('visibilitychange', onVisibility);
                logoutStaff();
                alert('Your session has expired due to inactivity.');
            }
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
            events.forEach(ev => window.removeEventListener(ev, markActivity));
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [currentUser?.id, currentUser?.role, settings.sessionTimeout, logoutStaff]);

    const loginStaff = async (username: string, password: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                const user = data;
                setCurrentUser(user);
                localStorage.setItem('racs_staff_member', JSON.stringify(user));
                try {
                    const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
                        headers: { 'X-Staff-Role': user.role },
                    });
                    const notifData: AdminNotification[] = await notifRes.json();
                    if (Array.isArray(notifData)) setNotifications(notifData);
                } catch {
                    /* non-critical */
                }
                return { success: true };
            }
            return { success: false, error: data.error || 'Invalid username or password' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Is the API running?' };
        }
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
                const notifRes = await fetch(`${API_BASE_URL}/notifications`, { headers: staffRoleHeaders() });
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
                const notifRes = await fetch(`${API_BASE_URL}/notifications`, { headers: staffRoleHeaders() });
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

            try {
                const notifRes = await fetch(`${API_BASE_URL}/notifications`, { headers: staffRoleHeaders() });
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
            const payload = await res.json();
            if (!res.ok) {
                console.error('Error adding staff:', payload?.error);
                return { success: false, error: payload?.error ?? 'Could not create user.' };
            }
            const {
                welcomeEmailSent = false,
                welcomeEmailError,
                ...newStaff
            } = payload as StaffMember & { welcomeEmailSent?: boolean; welcomeEmailError?: string };
            setStaff(prev => [newStaff as StaffMember, ...prev]);
            return { success: true, welcomeEmailSent, welcomeEmailError };
        } catch (error) {
            console.error('Error adding staff:', error);
            return { success: false, error: 'Network error. Is the API running?' };
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

    const reopenReport = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REOPENED' })
            });
            const updatedReport = await res.json();
            setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
        } catch (error) {
            console.error('Error reopening report:', error);
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

    const addInquiry = async (carId: string, carName: string, userEmail: string, message: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carId, carName, userEmail, message })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to send inquiry');
            }
        } catch (error) {
            console.error('Error adding inquiry:', error);
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.error || 'Request failed', error: data.error };
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: 'Network error', error: 'Network error' };
        }
    };

    const resetPassword = async (email: string, otp: string, newPassword: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.error || 'Reset failed', error: data.error };
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: 'Network error', error: 'Network error' };
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
            await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'PATCH',
                headers: staffRoleHeaders(),
            });
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
            addReport, resolveReport, reopenReport, deleteReport,
            addInquiry,
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

