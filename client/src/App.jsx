/**
 * App.jsx
 * Root application component.
 * Configures React Router routes, AuthProvider, and page layouts.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ─── Layout Components ────────────────────────────────────────────────────────
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// ─── Auth Pages ───────────────────────────────────────────────────────────────
import Login from './pages/Login';
import Register from './pages/Register';

// ─── App Pages ────────────────────────────────────────────────────────────────
import Dashboard from './pages/Dashboard';
import StartupForm from './pages/StartupForm';
import ValidationResults from './pages/ValidationResults';
import ReportHistory from './pages/ReportHistory';

// TODO: V2 — Import future module pages:
//   import TeamCollaboration from './pages/TeamCollaboration';
//   import InvestorReadiness from './pages/InvestorReadiness';
//   import FinancialForecast from './pages/FinancialForecast';
//   import Notifications from './pages/Notifications';
//   import AdminDashboard from './pages/AdminDashboard';
//   import Settings from './pages/Settings';

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

// ─── App Component ────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ─── Public Routes ─── */}
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

            {/* TODO: V2 — Add protected routes for:
                /team, /investor, /forecast, /notifications, /admin, /settings */}
          </Route>

          {/* ─── Redirects ─── */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
