import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import {
  DashboardPage,
  LayoutPage,
  LoginPage,
  RegisterPage
} from '../pages';

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
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
