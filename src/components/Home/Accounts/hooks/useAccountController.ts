import { useState } from 'react';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { useHome } from '../../../../contexts/HomeContext/useHome';

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

	return {
		sliderState,
		windowWidth,
		areValuesVisible,
		setSliderState,
		toogleValueVisibility,
		handleNewAccountModalOpen,
		isInitialLoading: false,
		accounts: []
	};
}
