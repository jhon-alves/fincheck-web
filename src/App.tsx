import { Toaster } from 'react-hot-toast';
import { Router } from './router';

export function App() {
	return (
		<>
			<Router />
			<Toaster position="top-right" />
		</>
	);
}
