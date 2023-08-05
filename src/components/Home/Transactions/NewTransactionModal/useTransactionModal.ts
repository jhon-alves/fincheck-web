import { useHome } from '../../../../contexts/HomeContext/useHome';

export function useTransactionModal() {
	const {
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal,
	} = useHome();

	return {
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal
	};
}
