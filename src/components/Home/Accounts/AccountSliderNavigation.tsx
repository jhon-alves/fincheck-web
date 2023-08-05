import { useSwiper } from 'swiper/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface SliderNavigationProps {
  isBeginning: boolean;
  isEnd: boolean;
}

export function AccountSliderNavigation({ isBeginning, isEnd }: SliderNavigationProps) {
	const swiper = useSwiper();

	return (
		<div>
			<button
				onClick={() => swiper.slidePrev()}
				className="p-[8px] rounded-full enabled:hover:bg-teal-700 transition-colors disabled:opacity-40"
				disabled={isBeginning}
			>
				<ChevronLeftIcon className="text-white w-6 h-6" />
			</button>
			<button
				onClick={() => swiper.slideNext()}
				className="p-[8px] rounded-full hover:bg-teal-700 transition-colors disabled:opacity-40"
				disabled={isEnd}
			>
				<ChevronRightIcon className="text-white w-6 h-6" />
			</button>
		</div>
	);
}
