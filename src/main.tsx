import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './contexts';
import { queryClient } from './helpers';
import { lightTheme } from './themes/lightTheme';
import { App } from './App';
import './index.css';
import ptBR from 'date-fns/locale/pt-BR';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
		<ThemeProvider theme={lightTheme}>
			<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</LocalizationProvider>
		</ThemeProvider>
	</QueryClientProvider>,
);
