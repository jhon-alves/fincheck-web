import { useSwiper } from 'swiper/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export function SliderNavigation() {
	const swiper = useSwiper();

	return (
		<div>
			<button
				onClick={() => swiper.slidePrev()}
				className="p-[8px] rounded-full enabled:hover:bg-teal-700 transition-colors"
			>
				<ChevronLeftIcon className="text-white w-6 h-6" />
			</button>
			<button
				onClick={() => swiper.slideNext()}
				className="p-[8px] rounded-full hover:bg-teal-700 transition-colors"
			>
				<ChevronRightIcon className="text-white w-6 h-6" />
			</button>
		</div>
	);
}
