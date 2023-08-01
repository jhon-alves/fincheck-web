import { useAuth } from '../../contexts/AuthContext/useAuth';

export function HomePage() {
	const { signout } = useAuth();

	return (
		<>
			<h1>home</h1>
			<button onClick={signout}>
      deslogar
			</button>
		</>
	);
}
