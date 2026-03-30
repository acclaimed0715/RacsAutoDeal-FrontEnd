// src/types/index.ts

export type CarStatus = 'open' | 'in-progress' | 'closed' | 'pending_deal' | 'sold';

export interface Vehicle {
    id: string;
    name: string;
    price: string;
    promoPrice?: string;
    modelYear: string;
    mileage: string;
    brand: string;
    transmission: string;
    fuelType: string;
    engine: string;
    hp: string;
    torque: string;
    safety: string;
    seating: string;
    description: string;
    status: CarStatus;
    images: string[];
    date: string;
    isArchived?: boolean;
    saleReportedBy?: string;
    posted?: string; // UI only
    type?: string; // UI only
}

export interface StaffMember {
    id: string;
    username: string;
    name: string;
    role: 'SUPER_ADMIN' | 'INVENTORY_MANAGER';
    password?: string;
    createdAt?: string;
}

export interface UserReport {
    id: string;
    userName: string;
    userEmail: string;
    reason: string;
    description?: string;
    date: string;
    status: 'PENDING' | 'RESOLVED';
}

export interface AppSettings {
    businessName: string;
    contactEmail: string;
    phone: string;
    address: string;
    adminPassword?: string;
    sessionTimeout: number;
    emailNotif: boolean;
    stockNotif: boolean;
    theme: 'dark' | 'light' | 'luxury';
    currency: string;
    vehicleTypes?: string[];
}

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    sender: string;
}
