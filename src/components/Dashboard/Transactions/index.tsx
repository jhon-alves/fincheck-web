import { Swiper, SwiperSlide } from 'swiper/react';
import { FilterIcon } from '../../Icons/FilterIcon';
import { MONTHS } from '../../../config/constants';
import { SliderOption } from './SliderOption';
import { SliderNavigation } from './SliderNavigation';
import { formatCurrency, cn, formatDate } from '../../../helpers';
import { CategoryIcon } from '../../Icons/categories/CategoryIcon';
import { TransactionsIcon } from '../../Icons';
import { useTransactionController } from './useTransactionController';
import { Spinner, ConfirmDeleteModal } from '../../Shared';
import { TransactionTypeDropdown } from './TransactionTypeDropdown';
import { FiltersModal } from './FiltersModal';
import { EditTransactionModal } from '../modals/EditTransactionModal';
import emptyStateImage from '../../../assets/empty-state.svg';

export function Transactions() {
  const {
    areValuesVisible,
    isLoading,
    transactions,
    isInitialLoading,
    isFiltersModalOpen,
    handleCloseFiltersModal,
    handleOpenFiltersModal,
    handleChangeFilters,
    filters,
    handleApplyFilters,
    handleCloseEditModal,
    handleOpenEditModal,
    isEditModalOpen,
    transactionBeingEdited,
    transferBeingDeleted,
    isDeletingTransfer,
    handleOpenDeleteTransferModal,
    handleCloseDeleteTransferModal,
    handleDeleteTransfer,
  } = useTransactionController();

  const hasTransactions = transactions.length > 0;

  return (
    <div className="bg-gray-100 rounded-2xl h-full w-full px-4 py-8 md:p-10 flex flex-col">
      {isInitialLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      )}
      {!isInitialLoading && (
        <>
          <FiltersModal
            open={isFiltersModalOpen}
            onClose={handleCloseFiltersModal}
            onApplyFirters={handleApplyFilters}
          />

          <header>
            <div className="flex items-center justify-between">
              <TransactionTypeDropdown
                onSelect={handleChangeFilters('type')}
                selectedType={filters.type}
              />

              <button onClick={handleOpenFiltersModal} className="cursor-pointer">
                <FilterIcon />
              </button>
            </div>

            <div className="mt-6 relative">
              <Swiper
                slidesPerView={3}
                centeredSlides
                onSlideChange={(swiper) => {
                  handleChangeFilters('month')(swiper.realIndex);
                }}
                initialSlide={filters.month}
              >
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive }) => (
                      <SliderOption
                        isActive={isActive}
                        month={month}
                        index={index}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>
          <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center flex-col h-full justify-center">
                <Spinner />
              </div>
            )}
            {!hasTransactions && !isLoading && (
              <div className="flex items-center flex-col h-full justify-center">
                <img src={emptyStateImage} />
                <p className="text-gray-700">
                  Não encontramos nenhuma transação
                </p>
              </div>
            )}
            {hasTransactions && !isLoading && (
              <>
                {transactions.map((transaction) =>
                  transaction.type === 'TRANSFER' ? (
                    <div
                      key={transaction.id}
                      className="rounded-2xl p-4 bg-white flex items-center justify-between gap-4 cursor-pointer"
                      role="button"
                      onClick={() => handleOpenDeleteTransferModal(transaction)}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                          <TransactionsIcon />
                        </div>
                        <div>
                          <strong className="tracking-[-0.5px] block">
                            {transaction.name}
                          </strong>
                          <span className="text-sm text-gray-600">
                            {transaction.bankAccount?.name} →{' '}
                            {transaction.toBankAccount?.name}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'tracking-[-0.5px] font-medium text-gray-700',
                          !areValuesVisible && 'blur-sm'
                        )}
                      >
                        {formatCurrency(transaction.value)}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={transaction.id}
                      className="rounded-2xl p-4 bg-white flex items-center justify-between gap-4"
                      role="button"
                      onClick={() => handleOpenEditModal(transaction)}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <CategoryIcon
                          type={
                            transaction.type === 'EXPENSE'
                              ? 'expense'
                              : 'income'
                          }
                          category={transaction.category?.icon}
                        />
                        <div>
                          <strong className="tracking-[-0.5px] block">
                            {transaction.name}
                          </strong>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {formatDate(new Date(transaction.date))}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] font-medium rounded-full px-2 py-0.5',
                                transaction.paid
                                  ? 'text-green-900 bg-green-100'
                                  : 'text-orange-900 bg-orange-100'
                              )}
                            >
                              {transaction.paid
                                ? transaction.type === 'EXPENSE'
                                  ? 'Paga'
                                  : 'Recebida'
                                : 'Pendente'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          ' tracking-[-0.5px] font-medium',
                          transaction.type === 'EXPENSE'
                            ? 'text-red-800'
                            : 'text-green-800',
                          !areValuesVisible && 'blur-sm'
                        )}
                      >
                        {transaction.type === 'EXPENSE' ? '-' : '+'}{' '}
                        {formatCurrency(transaction.value)}
                      </span>
                    </div>
                  )
                )}
                {transactionBeingEdited && (
                  <EditTransactionModal
                    open={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    transaction={transactionBeingEdited}
                  />
                )}
                {transferBeingDeleted && (
                  <ConfirmDeleteModal
                    title="Tem certeza que deseja excluir esta transferência?"
                    onClose={handleCloseDeleteTransferModal}
                    onConfirm={handleDeleteTransfer}
                    isLoading={isDeletingTransfer}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
