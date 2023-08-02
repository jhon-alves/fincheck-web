import { useContext } from 'react';
import { HomeContext } from './index';

export function useHome() {
	return useContext(HomeContext);
}
