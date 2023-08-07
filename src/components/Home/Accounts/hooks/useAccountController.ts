import { useMemo, useState } from 'react';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { useHome } from '../../../../contexts/HomeContext/useHome';
import { useAccounts } from '../../../../hooks';

export function useAccountController() {
	const windowWidth = useWindowSize();
	const {
		areValuesVisible,
		toogleValueVisibility,
		handleNewAccountModalOpen
	} = useHome();
	const [sliderState, setSliderState] = useState({
		isBeginning: true,
		isEnd: false
	});

	const { accounts, isFetching } = useAccounts();

	const currencyBalance = useMemo(() => {
		return accounts.reduce((total, account) => total + account.currentBalance, 0);
	}, [accounts]);

	return {
		sliderState,
		windowWidth,
		areValuesVisible,
		setSliderState,
		toogleValueVisibility,
		handleNewAccountModalOpen,
		isInitialLoading: isFetching,
		accounts,
		currencyBalance
	};
}
