import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FilterIcon } from '../../Icons/FilterIcon';
import { MONTHS } from '../../../constants/months';
import { SliderMonths } from './SliderMonths';
import { TransactionSliderNavigation } from './TransactionSliderNavigation';
import { TransactionCard } from './TransactionCard';
import { transactionsMock } from './mock';
import { useTransactionsController } from './hooks/useTransactionsController';
import { Spinner } from '../../Spinner';
import emptyState from '../../../assets/imgs/emptyStateTransactions.svg';
import { TransactionDropdown } from './TransactionDropdown';
import { CreateTransactionButton } from './CreateTransactionButton';
import { FiltersModal } from './Filters';

export function Transactions() {
	const {
		isInitialLoading,
		isLoading,
		transactions,
		isFiltersModalOpen,
		handleIsFiltersModalOpen
	} = useTransactionsController();
	const hasTransactions = transactions.length > 0;

	return (
		<>
			<FiltersModal
				open={isFiltersModalOpen}
				onClose={handleIsFiltersModalOpen}
			/>
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
								<div className="flex items-center gap-5">
									<button onClick={handleIsFiltersModalOpen}>
										<FilterIcon />
									</button>
									<TransactionDropdown />
								</div>
								<CreateTransactionButton />
							</div>

							<div className="mt-6 relative">
								<Swiper
									centeredSlides
									spaceBetween={16}
									slidesPerView={3}
								>
									<TransactionSliderNavigation />
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
		</>
	);
}
