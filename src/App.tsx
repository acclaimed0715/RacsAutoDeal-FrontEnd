import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import { InquiryProvider } from './context/InquiryContext';
import { CompareProvider } from './context/CompareContext';
import ComparePage from './pages/ComparePage';
import CompareBar from './components/CompareBar';
import GlobalInquiryStack from './components/GlobalInquiryStack';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import CarsPage from './pages/CarsPage';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import DashboardView from './components/admin/DashboardView';
import InventoryView from './components/admin/InventoryView';
import UsersView from './components/admin/UsersView';
import ReportsView from './components/admin/ReportsView';
import InquiriesView from './components/admin/InquiriesView';
import SettingsView from './components/admin/SettingsView';
import StaffAccountGate from './components/admin/StaffAccountGate';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import CarDetail from './pages/CarDetail';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('racs_staff_member');
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Super Admin only route — redirects Inventory Managers to dashboard
const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const stored = localStorage.getItem('racs_staff_member');
    if (!stored) return <Navigate to="/login" replace />;
    try {
        const user = JSON.parse(stored);
        if (user.role !== 'SUPER_ADMIN') return <Navigate to="/admin" replace />;
    } catch {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

class ErrorBoundary extends React.Component<{children: any}, {hasError: boolean, error: any, info: any}> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }
    componentDidCatch(_error: any, info: any) {
        this.setState({ info });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, color: 'white', background: 'red', minHeight: '100vh' }}>
                    <h2>React Crashed!</h2>
                    <pre>{String(this.state.error)}</pre>
                    <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', marginTop: 20 }}>{this.state.info?.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <InventoryProvider>
                <InquiryProvider>
                    <CompareProvider>
                        <Router>
                            <CompareBar />
                            <GlobalInquiryStack />
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/cars" element={<CarsPage />} />
                                <Route path="/compare" element={<ComparePage />} />
                                <Route path="/terms" element={<TermsAndPrivacy />} />
                                <Route path="/car/:id" element={<CarDetail />} />
                                <Route path="/login" element={<Login />} />

                            {/* Admin Routes */}
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminLayout>
                                        <DashboardView />
                                    </AdminLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/inquiries" element={
                                <ProtectedRoute>
                                    <AdminLayout>
                                        <InquiriesView />
                                    </AdminLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/inventory" element={
                                <ProtectedRoute>
                                    <AdminLayout>
                                        <InventoryView />
                                    </AdminLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/account" element={
                                <ProtectedRoute>
                                    <AdminLayout>
                                        <StaffAccountGate />
                                    </AdminLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/admin/users" element={
                                <SuperAdminRoute>
                                    <AdminLayout>
                                        <UsersView />
                                    </AdminLayout>
                                </SuperAdminRoute>
                            } />
                            <Route path="/admin/reports" element={
                                <SuperAdminRoute>
                                    <AdminLayout>
                                        <ReportsView />
                                    </AdminLayout>
                                </SuperAdminRoute>
                            } />
                            <Route path="/admin/settings" element={
                                <SuperAdminRoute>
                                    <AdminLayout>
                                        <SettingsView />
                                    </AdminLayout>
                                </SuperAdminRoute>
                            } />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                    </CompareProvider>
                </InquiryProvider>
            </InventoryProvider>
        </ErrorBoundary>
    );
};


export default App;
