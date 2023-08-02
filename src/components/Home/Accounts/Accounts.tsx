import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { EyeIcon } from '../../Icons/EyeIcon';
import { AccountCard } from './AccountCard';
import { SliderNavigation } from './SliderNavigation';
import { useAccountController } from './hooks/useAccountController';
import { formatCurrency } from '../../../helpers';
import { Spinner } from '../../Spinner';
import { PlusIcon } from '@radix-ui/react-icons';

export function Accounts() {
	const {
		accounts,
		isInitialLoading,
		sliderState,
		windowWidth,
		areValuesVisible,
		setSliderState,
		toogleValueVisibility,
	} = useAccountController();

	return (
		<div className="bg-teal-900 rounded-2xl w-full h-full md:p-10 px-4 py-8 flex flex-col">
			{isInitialLoading && (
				<div className="flex flex-1 items-center justify-center">
					<Spinner />
				</div>
			)}

			{!isInitialLoading && (
				<>
					<div className="mb-4">
						<p className="text-sm text-white">
          Saldo Total
						</p>
						<div className="flex gap-3 items-center">
							<span className={twMerge(clsx(
								'text-2xl text-white font-medium',
								!areValuesVisible && 'blur-md'
							))}
							>
								{formatCurrency(1000)}
							</span>
							<button
								onClick={toogleValueVisibility}
								className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-teal-700 transition-colors"
							>
								<EyeIcon open={areValuesVisible} />
							</button>
						</div>
					</div>

					<div className="flex-1 flex flex-col justify-end">
						{accounts.length > 0 ? (
							<div>
								<Swiper
									spaceBetween={16}
									slidesPerView={windowWidth >= 550 ? 2.2 : 1.2}
									onSlideChange={swiper => {
										setSliderState({
											isBeginning: swiper.isBeginning,
											isEnd: swiper.isEnd
										});
									}}
									onSwiper={(swiper) => console.log(swiper)}
								>
									<div
										slot="container-start"
										className="flex justify-between items-center mb-4"
									>
										<strong className="text-white text-lg">
                Minhas contas
										</strong>
										<SliderNavigation
											isBeginning={sliderState.isBeginning}
											isEnd={sliderState.isEnd}
										/>
									</div>
									<SwiperSlide>
										<AccountCard
											color="purple"
											name="Nubank"
											balance={500}
											type="CASH"
										/>
									</SwiperSlide>
									<SwiperSlide>
										<AccountCard
											color="purple"
											name="Nubank"
											balance={500}
											type="CASH"
										/>
									</SwiperSlide>
									<SwiperSlide>
										<AccountCard
											color="purple"
											name="Nubank"
											balance={500}
											type="CASH"
										/>
									</SwiperSlide>
									<SwiperSlide>
										<AccountCard
											color="purple"
											name="Nubank"
											balance={500}
											type="CASH"
										/>
									</SwiperSlide>
								</Swiper>
							</div>
						) : (
							<div>
								<strong className="text-white text-lg">
                  Minhas contas
								</strong>

								<button className="mt-4 w-full h-52 flex flex-col items-center gap-4
                justify-center rounded-2xl border-2 border-dashed border-teal-600
                hover:bg-teal-950/10 transition-colors">
									<div className="w-10 h-10 rounded-full border-2 border-dashed border-white
                  flex items-center justify-center">
										<PlusIcon className="text-white w-6 h-6" />
									</div>
									<span className="text-white font-medium">
                    Cadastre uma nova conta
									</span>
								</button>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
