import { Controller } from 'react-hook-form';
import {
  Modal,
  Input,
  Button,
  Select,
  InputCurrency,
  DatePickerInput,
} from '../../../Shared';
import { useNewTransferController } from './useNewTransferModalController';

export function NewTransferModal() {
  const {
    isNewTransferModalOpen,
    closeNewTransferModal,
    control,
    errors,
    handleSubmit,
    register,
    accounts,
    isLoading,
  } = useNewTransferController();

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  return (
    <Modal
      open={isNewTransferModalOpen}
      onClose={closeNewTransferModal}
      title="Nova Transferência"
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className="text-gray-600 text-xs tracking-[-0.5px]">
            Valor da Transferência
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg tracking-[-0.5px]">R$</span>
            <Controller
              control={control}
              name="value"
              defaultValue="0"
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
            placeholder="Descrição (opcional)"
            {...register('name')}
            error={errors.name?.message}
          />

          <Controller
            control={control}
            name="fromBankAccountId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={onChange}
                value={value}
                placeholder="De (origem)"
                options={accountOptions}
                error={errors.fromBankAccountId?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="toBankAccountId"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={onChange}
                value={value}
                placeholder="Para (destino)"
                options={accountOptions}
                error={errors.toBankAccountId?.message}
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
        </div>

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Transferir
        </Button>
      </form>
    </Modal>
  );
}
