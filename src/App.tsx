import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './components/auth/LoginScreen';
import { MapPage } from './pages/MapPage';
import { BancalPage } from './pages/BancalPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';

function SplashScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh gap-4"
      style={{ background: 'var(--earth-900)' }}
    >
      <h1
        className="text-2xl m-0"
        style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}
      >
        Huerta Comunitaria
      </h1>
      <div
        className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;
  if (!user) return <LoginScreen />;

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/map" replace />} />
        <Route path="map" element={<MapPage />} />
        <Route path="bancal" element={<BancalPage />} />
        <Route path="bancal/:id" element={<BancalPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
