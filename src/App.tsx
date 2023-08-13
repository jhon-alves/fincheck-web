import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { theme } from './theme';
import { Router } from './router';
import { queryClient } from './helpers';
import { AuthProvider } from './contexts/AuthContext';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
      <CssBaseline />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
