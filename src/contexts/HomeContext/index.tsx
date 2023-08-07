import { ReactNode, createContext, useCallback, useState } from 'react';
import { BankAccount } from '../../entities/bankAccount';

interface HomeContextValue {
  // View Currency Balance
  areValuesVisible: boolean;
  toogleValueVisibility(): void;

  // New Account
  isNewAccountModalOpen: boolean;
  handleNewAccountModalOpen(): void;

  // Edit Account
  accountBeingEdited: null | BankAccount;
  isEditAccountModalOpen: boolean;
  openEditAccountModal(bankAccount: BankAccount): void;
  closeEditAccountModal(): void;

  // New Transaction
  isNewTransactionModalOpen: boolean;
  newTransactionType: 'INCOME' | 'EXPENSE' | null;
  openNewTransactionModal(type: 'INCOME' | 'EXPENSE'): void;
  closeNewTransactionModal(): void;
}

export const HomeContext = createContext({} as HomeContextValue);

export function HomeProvider({ children }: { children: ReactNode }) {
	const [areValuesVisible, setAreValuesVisible] = useState(true);
	const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
	const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
	const [accountBeingEdited, setAccountBeingEdited] = useState<null | BankAccount>(null);
	const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
	const [newTransactionType, setNewTransactionType] = useState<'INCOME' | 'EXPENSE' | null>(null);

	const toogleValueVisibility = useCallback(() => {
		setAreValuesVisible(prevState => !prevState);
	}, []);

	function handleNewAccountModalOpen() {
		setIsNewAccountModalOpen(!isNewAccountModalOpen);
	}

	const openEditAccountModal = useCallback((bankAccount: BankAccount) => {
		setAccountBeingEdited(bankAccount);
		setIsEditAccountModalOpen(true);
	}, []);

	const closeEditAccountModal = useCallback(() => {
		setAccountBeingEdited(null);
		setIsEditAccountModalOpen(false);
	}, []);

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
			areValuesVisible,
			toogleValueVisibility,
			isNewAccountModalOpen,
			handleNewAccountModalOpen,
			accountBeingEdited,
			isEditAccountModalOpen,
			openEditAccountModal,
			closeEditAccountModal,
			newTransactionType,
			isNewTransactionModalOpen,
			openNewTransactionModal,
			closeNewTransactionModal,

		}}>
			{children}
		</HomeContext.Provider>
	);
}
