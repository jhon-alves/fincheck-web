import { createContext, useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { localStorageKeys } from '../config/localStorageKeys';
import { usersService } from '../services/usersService';
import { LaunchScreen } from '../components/';
import { User } from '../entities/User';

interface AuthContextValue {
  signedIn: boolean;
  signin(accessToken: string): void;
  signout(): void;
  user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    const storedAccessToken = localStorage.getItem(
      localStorageKeys.ACCESS_TOKEN
    );

    return !!storedAccessToken;
  });

  const { isError, isFetching, isSuccess, remove, data } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersService.me(),
    enabled: signedIn,
    staleTime: Infinity,
  });

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
    setSignedIn(true);
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    remove();
    setSignedIn(false);
    queryClient.clear();
  }, [remove]);

  useEffect(() => {
    if (isError) {
      signout();
    }
  }, [isError, signout]);

  return (
    <AuthContext.Provider
      value={{ signedIn: isSuccess && signedIn, signin, signout, user: data }}
    >
      <LaunchScreen isLoading={isFetching} />
      {!isFetching && children}
    </AuthContext.Provider>
  );
}
