import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { Router } from './router';

export function App() {
	return (
		<>
			<CssBaseline />
			<Router />
			<Toaster position="top-right" />
		</>
	);
}
