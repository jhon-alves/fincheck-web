import { lazy } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router';
import { AuthGuard } from './AuthGuard';
import { PrivateLayout } from './PrivateLayout';
import { LayoutPage, LoginPage, RegisterPage } from '../pages';

// Cada página vira um chunk próprio, carregado só quando a rota abre.
const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const StatementPage = lazy(() =>
  import('../pages/StatementPage').then((m) => ({ default: m.StatementPage })),
);
const CalendarPage = lazy(() =>
  import('../pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const CardsPage = lazy(() =>
  import('../pages/CardsPage').then((m) => ({ default: m.CardsPage })),
);
const AccountsPage = lazy(() =>
  import('../pages/AccountsPage').then((m) => ({ default: m.AccountsPage })),
);
const CategoriesPage = lazy(() =>
  import('../pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
);
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<LayoutPage />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>
        <Route element={<AuthGuard isPrivate />}>
          <Route element={<PrivateLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/extrato" element={<StatementPage />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/cartoes" element={<CardsPage />} />
            <Route path="/contas" element={<AccountsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
