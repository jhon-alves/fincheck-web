import { Controller } from 'react-hook-form';
import {
  Modal,
  Input,
  Button,
  Select,
  Switch,
  InputCurrency,
  DatePickerInput
} from '../../../Shared';
import { useNewTransactionController } from './useNewTransactionModalController';

export function NewTransactionModal() {
  const {
    closeNewTransactionModal,
    isNewTransactionModalOpen,
    newTransactionType,
    control,
    errors,
    handleSubmit,
    register,
    accounts,
    categories,
    isLoading,
  } = useNewTransactionController();

  const isExpense = newTransactionType === 'EXPENSE';

  return (
    <Modal
      open={isNewTransactionModalOpen}
      onClose={closeNewTransactionModal}
      title={`Nova ${isExpense ? 'Despesa' : 'Receita'}`}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className="text-gray-600 text-xs tracking-[-0.5px]">
            Valor da {isExpense ? 'Despesa' : 'Receita'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg tracking-[-0.5px]">R$</span>
            <Controller
              control={control}
              name="value"
              render={({ field: { onChange, value } }) => (
                <InputCurrency
                  onChange={onChange}
                  value={value}
                  error={errors.value?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <Input
            type="text"
            placeholder={`Nome da ${isExpense ? 'Despesa' : 'Receita'}`}
            {...register('name')}
            error={errors.name?.message}
          />

          <Controller
            control={control}
            name="categoryId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={onChange}
                value={value}
                placeholder="Categoria"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                error={errors.categoryId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bankAccountId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={onChange}
                value={value}
                placeholder={isExpense ? 'Pagar com' : 'Receber com'}
                options={accounts.map((account) => ({
                  value: account.id,
                  label: account.name,
                }))}
                error={errors.bankAccountId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            defaultValue={new Date()}
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                value={value}
                onChange={onChange}
                error={errors.date?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="paid"
            defaultValue={true}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center justify-between">
                <span className="text-gray-700 tracking-[-0.5px]">
                  {isExpense ? 'Despesa paga' : 'Receita recebida'}
                </span>
                <Switch checked={value} onChange={onChange} />
              </div>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Criar
        </Button>
      </form>
    </Modal>
  );
}
