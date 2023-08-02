import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { TransactionsIcon } from '../../Icons/TransactionsIcon';
import { FilterIcon } from '../../Icons/FilterIcon';
import { MONTHS } from '../../../constants/months';
import { SliderMonths } from './SliderMonths';
import { SliderNavigation } from './SliderNavigation';
import { TransactionCard } from './TransactionCard';
import { transactionsMock } from './mock';
import { useTransactionsController } from './hooks/useTransactionsController';
import { Spinner } from '../../Spinner';
import emptyState from '../../../assets/imgs/emptyStateTransactions.svg';

export function Transactions() {
	const { isInitialLoading, isLoading, transactions } = useTransactionsController();
	const hasTransactions = transactions.length > 0;

	return (
		<div className="bg-gray-200 rounded-2xl w-full h-full md:p-10 px-4 py-8 flex flex-col">
			{isInitialLoading && (
				<div className="flex flex-1 items-center justify-center">
					<Spinner />
				</div>
			)}

			{!isInitialLoading && (
				<>
					<div>
						<div className="flex items-center justify-between">
							<button className="flex items-center gap-2">
								<TransactionsIcon />
								<span className="text-sm text-gray-800 font-medium">
                  Transações
								</span>
								<ChevronDownIcon className="text-gray-800" />
							</button>
							<button>
								<FilterIcon />
							</button>
						</div>

						<div className="mt-6 relative">
							<Swiper
								centeredSlides
								spaceBetween={16}
								slidesPerView={3}
							>
								<SliderNavigation />
								{MONTHS.map((month, index) => (
									<SwiperSlide key={month}>
										{({ isActive }) => (
											<SliderMonths
												isActive={isActive}
												month={month}
												index={index}
											/>
										)}
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>

					<div className="mt-4 space-y-3 flex-1 overflow-y-auto">
						{isLoading && (
							<div className="flex flex-col items-center justify-center h-full">
								<Spinner />
							</div>
						)}

						{(!hasTransactions && !isLoading) && (
							<div className="flex flex-col items-center justify-center gap-4 h-full">
								<img src={emptyState} alt="empty state" />
								<span>Não encontramos nenhuma transação!</span>
							</div>
						)}

						{(hasTransactions && !isLoading) && (
							transactionsMock.map((item, index) => (
								<TransactionCard
									key={index}
									type={item.type}
									name={item.name}
									date={item.date}
									value={item.value}
								/>
							))
						)}
					</div>
				</>
			)}
		</div>
	);
}
