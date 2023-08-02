import { ReactNode, createContext, useCallback, useState } from 'react';

interface HomeContextValue {
  areValuesVisible: boolean;
  toogleValueVisibility(): void;
}

export const HomeContext = createContext({} as HomeContextValue);

export function HomeProvider({ children }: { children: ReactNode }) {
	const [areValuesVisible, setAreValuesVisible] = useState(true);

	const toogleValueVisibility = useCallback(() => {
		setAreValuesVisible(prevState => !prevState);
	}, []);

	return (
		<HomeContext.Provider value={{ areValuesVisible, toogleValueVisibility }}>
			{children}
		</HomeContext.Provider>
	);
}
