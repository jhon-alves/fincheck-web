import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { EyeIcon } from '../Icons/EyeIcon';
import { AccountCard } from './AccountCard';
import { SliderNavigation } from './SliderNavigation';

export function Accounts() {
	const [value, setValue ] = useState<boolean>(true);

	function handleValue() {
		setValue(!value);
	}

	return (
		<div className="bg-teal-900 rounded-2xl w-full h-full md:p-10 px-4 py-8 flex flex-col">
			<div>
				<p className="text-sm tracking-[-0.5px] text-white">
          Saldo Total
				</p>
				<div className="flex gap-3 items-center">
					<span className="text-2xl tracking-[-0.5px] text-white font-medium">
						{value ? 'R$ 100,00' : 'R$ ***'}
					</span>
					<button
						onClick={handleValue}
						className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-teal-700"
					>
						<EyeIcon open={value} />
					</button>
				</div>
			</div>

			<div className="flex-1 flex flex-col justify-end">
				<div>
					<Swiper
						spaceBetween={16}
						slidesPerView={2.2}
						onSlideChange={() => console.log('slide change')}
						onSwiper={(swiper) => console.log(swiper)}
					>
						<div
							slot="container-start"
							className="flex justify-between items-center mb-4"
						>
							<strong className="text-white tracking-[-1px] text-lg">
                Minhas contas
							</strong>
							<SliderNavigation />
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
			</div>
		</div>
	);
}
