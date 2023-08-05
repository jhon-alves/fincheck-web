import { useHome } from '../../../../contexts/HomeContext/useHome';

export function useAccountModal() {
	const {
		isNewAccountModalOpen,
		handleNewAccountModalOpen
	} = useHome();

	return {
		isNewAccountModalOpen,
		handleNewAccountModalOpen
	};
}
