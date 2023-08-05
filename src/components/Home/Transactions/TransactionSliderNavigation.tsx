import { useSwiper } from 'swiper/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export function TransactionSliderNavigation() {
	const swiper = useSwiper();

	return (
		<>
			<button
				onClick={() => swiper.slidePrev()}
				className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex
        items-center justify-center bg-gradient-to-r from-gray-200 to-transparent"
			>
				<ChevronLeftIcon className="text-gray-800 w-6 h-6" />
			</button>
			<button
				onClick={() => swiper.slideNext()}
				className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex
        items-center justify-center bg-gradient-to-l from-gray-200 to-transparent"
			>
				<ChevronRightIcon className="text-gray-800 w-6 h-6" />
			</button>
		</>
	);
}
