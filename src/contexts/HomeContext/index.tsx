import { ReactNode, createContext, useCallback, useState } from 'react';

interface HomeContextValue {
  areValuesVisible: boolean;
  isNewAccountModalOpen: boolean;
  isNewTransactionModalOpen: boolean;
  newTransactionType: 'INCOME' | 'EXPENSE' | null;
  toogleValueVisibility(): void;
  handleNewAccountModalOpen(): void;
  openNewTransactionModal(type: 'INCOME' | 'EXPENSE'): void;
  closeNewTransactionModal(): void;
}

export const HomeContext = createContext({} as HomeContextValue);

export function HomeProvider({ children }: { children: ReactNode }) {
	const [areValuesVisible, setAreValuesVisible] = useState(true);
	const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
	const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
	const [newTransactionType, setNewTransactionType] = useState<'INCOME' | 'EXPENSE' | null>(null);

	const toogleValueVisibility = useCallback(() => {
		setAreValuesVisible(prevState => !prevState);
	}, []);

	function handleNewAccountModalOpen() {
		setIsNewAccountModalOpen(!isNewAccountModalOpen);
	}

	const openNewTransactionModal = useCallback((type: 'INCOME' | 'EXPENSE') => {
		setNewTransactionType(type);
		setIsNewTransactionModalOpen(true);
	}, []);

	function closeNewTransactionModal() {
		setNewTransactionType(null);
		setIsNewTransactionModalOpen(false);
	}

	return (
		<HomeContext.Provider value={{
			newTransactionType,
			areValuesVisible,
			isNewAccountModalOpen,
			isNewTransactionModalOpen,
			toogleValueVisibility,
			handleNewAccountModalOpen,
			openNewTransactionModal,
			closeNewTransactionModal
		}}>
			{children}
		</HomeContext.Provider>
	);
}
