import { createContext } from 'react';
import { User } from '../types/me-types';

export interface AuthContextValue {
  signedIn: boolean;
  signin(accessToken: string): void;
  signout(): void;
  user: User | undefined;
}

export const AuthContext = createContext({} as AuthContextValue);
