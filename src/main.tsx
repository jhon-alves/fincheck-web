import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts';
import { queryClient } from './helpers';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
		<AuthProvider>
			<App />
		</AuthProvider>
	</QueryClientProvider>,
);
