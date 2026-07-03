/**
 * App.jsx
 * Root application component.
 * Configures React Router routes, AuthProvider, and page layouts.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// ─── Layout Components ────────────────────────────────────────────────────────
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// ─── Public Pages ─────────────────────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// ─── App Pages ────────────────────────────────────────────────────────────────
import Dashboard from './pages/Dashboard';
import StartupForm from './pages/StartupForm';
import ValidationResults from './pages/ValidationResults';
import ReportHistory from './pages/ReportHistory';

// ─── Authenticated Layout Wrapper ─────────────────────────────────────────────
const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="flex pt-16 min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 page-container">
        {children}
      </main>
    </div>
  </>
);

// ─── Smart Home Redirect — sends authenticated users to dashboard ──────────────
const HomeRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

// ─── App Component ────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ─── Protected Routes ─── */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/submit"
              element={
                <AppLayout>
                  <StartupForm />
                </AppLayout>
              }
            />
            <Route
              path="/validation/:startupId"
              element={
                <AppLayout>
                  <ValidationResults />
                </AppLayout>
              }
            />
            <Route
              path="/history"
              element={
                <AppLayout>
                  <ReportHistory />
                </AppLayout>
              }
            />
          </Route>

          {/* ─── Fallback ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
