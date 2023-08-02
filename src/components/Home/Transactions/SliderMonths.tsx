import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSwiper } from 'swiper/react';

interface SliderMonthsProps {
  isActive: boolean;
  month: string;
  index: number;
}

export function SliderMonths({isActive, month, index }: SliderMonthsProps) {
	const swiper = useSwiper();

	return (
		<button
			onClick={() => swiper.slideTo(index)}
			className={twMerge(clsx(
				'w-full rounded-full h-12 text-sm text-gray-800 font-medium',
				isActive && 'bg-white'
			))}
		>
			{month}
		</button>
	);
}
