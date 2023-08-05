import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './contexts';
import { queryClient } from './helpers';
import { lightTheme } from './themes/lightTheme';
import { App } from './App';
import './index.css';
import moment from 'moment';
import 'moment/locale/pt-br';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

moment.locale('pt-br');

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
		<ThemeProvider theme={lightTheme}>
			<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='pt-br'>
				<AuthProvider>
					<App />
				</AuthProvider>
			</LocalizationProvider>
		</ThemeProvider>
	</QueryClientProvider>,
);
