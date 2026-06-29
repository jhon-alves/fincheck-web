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
import { TrashIcon } from '../../../Icons';
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
        description=" Ao excluir a conta, também serão excluídos todos os registros de
        receita e despesas relacionados"
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
        <button onClick={handleOpenDeleteModal}>
          <TrashIcon className="w-6 h-6 text-red-900" />
        </button>
      }
    >
      <form onSubmit={handleSubmit}>
        <div>
          <span className="text-gray-600 text-xs tracking-[-0.5px]">
            Saldo inicial
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-lg tracking-[-0.5px]">R$</span>
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

        <div className="mt-10 flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Nome da Conta"
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
                  { value: 'CHECKING', label: 'Conta Corrente' },
                  { value: 'INVESTMENT', label: 'Investimentos' },
                  { value: 'CASH', label: 'Dinheiro Físico' },
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

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Salvar
        </Button>
      </form>
    </Modal>
  );
}
