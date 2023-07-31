import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LoginPage, RegisterPage, HomePage, AuthLayout } from '../pages';
import { AuthGuard } from './AuthGuard';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>
          </Route>
        </Route>

        {/* Private */}
        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<HomePage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
