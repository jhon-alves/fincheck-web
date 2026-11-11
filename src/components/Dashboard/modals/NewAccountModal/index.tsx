import { Controller } from 'react-hook-form';
import {
  Modal,
  Input,
  Button,
  Select,
  InputCurrency,
  ColorsDropdownInput
} from '../../../Shared';
import { useNewAccountController } from './useNewAccountModalController';

export function NewAccountModal() {
  const {
    closeNewAccountModal,
    isNewAccountModalOpen,
    errors,
    handleSubmit,
    register,
    control,
    isLoading,
  } = useNewAccountController();

  return (
    <Modal
      open={isNewAccountModalOpen}
      onClose={closeNewAccountModal}
      title="Nova conta"
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className="text-xs font-medium text-muted">Saldo inicial</span>
          <div className="flex items-center gap-2">
            <span className="text-lg text-muted">R$</span>
            <Controller
              name="initialBalance"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputCurrency
                  onChange={onChange}
                  error={errors.initialBalance?.message}
                  value={value}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Nome da conta"
            error={errors.name?.message}
            {...register('name')}
          />

          <Controller
            control={control}
            name="type"
            defaultValue="CHECKING"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Tipo"
                onChange={onChange}
                value={value}
                error={errors.type?.message}
                options={[
                  { value: 'CHECKING', label: 'Conta corrente' },
                  { value: 'INVESTMENT', label: 'Investimentos' },
                  { value: 'CASH', label: 'Dinheiro físico' },
                ]}
              />
            )}
          />

          <Controller
            control={control}
            name="color"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <ColorsDropdownInput
                onChange={onChange}
                value={value}
                error={errors.color?.message}
              />
            )}
          />
        </div>

        <Button type="submit" size="lg" className="mt-6 w-full" isLoading={isLoading}>
          Criar
        </Button>
      </form>
    </Modal>
  );
}
