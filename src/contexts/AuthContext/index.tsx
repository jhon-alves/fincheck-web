import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersServices } from '../../services';
import { LaunchScreen } from '../../components';

interface AuthContextValue {
  signedIn: boolean;
  signin(accessToken: string): void;
  signout(): void;
}

export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [signedIn, setSignedIn] = useState<boolean>(() => {
		const storedAccessToken = localStorage.getItem('@token');

		return !!storedAccessToken;
	});

	const { isError, isFetching, isSuccess, remove } = useQuery({
		queryKey: ['loggedUser'],
		queryFn: () => usersServices.getUser(),
		enabled: signedIn
	});

	const signin = useCallback((accessToken: string) => {
		localStorage.setItem('@token', accessToken);

		localStorage.getItem('@token');
		setSignedIn(true);
	}, []);

	const signout = useCallback(() => {
		localStorage.removeItem('@token');
		remove();
		setSignedIn(false);
	}, [remove]);

	useEffect(() => {
		if (isError) {
			signout();
		}
	}, [isError, signout]);

	return (
		<AuthContext.Provider value={{
			signedIn: isSuccess && signedIn,
			signin,
			signout
		}}>
			<LaunchScreen isLoading={isFetching} />
			{!isFetching && children}
		</AuthContext.Provider>
	);
}
