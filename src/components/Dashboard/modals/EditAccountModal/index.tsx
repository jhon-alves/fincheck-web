import { Controller } from 'react-hook-form';
import {
  Modal,
  Input,
  Button,
  Select,
  InputCurrency,
  ConfirmDeleteModal,
  ColorsDropdownInput
} from '../../../Shared';
import { Trash2 } from 'lucide-react';
import { useEditAccountController } from './useEditAccountModalController';

export function EditAccountModal() {
  const {
    closeEditAccountModal,
    isEditAccountModalOpen,
    errors,
    handleSubmit,
    register,
    control,
    isLoading,
    isDeleteModalOpen,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    isLoadingDelete,
  } = useEditAccountController();

  if (isDeleteModalOpen) {
    return (
      <ConfirmDeleteModal
        title="Tem certeza que deseja excluir essa conta?"
        description="Ao excluir a conta, também serão excluídos todos os lançamentos ligados a ela."
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        isLoading={isLoadingDelete}
      />
    );
  }

  return (
    <Modal
      open={isEditAccountModalOpen}
      onClose={closeEditAccountModal}
      title="Editar conta"
      rightAction={
        <button
          type="button"
          onClick={handleOpenDeleteModal}
          aria-label="Excluir conta"
          className="grid size-10 place-items-center rounded-full text-expense-strong transition-colors hover:bg-expense-soft"
        >
          <Trash2 size={20} />
        </button>
      }
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
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
