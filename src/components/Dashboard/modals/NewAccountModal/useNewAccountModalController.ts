import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useInvalidateFinance } from '../../../../hooks/useInvalidateFinance';
import { useDashboard } from '../../DashboardContext/useDashboard';
import { banksServices } from '../../../../services/banks-services';
import { currencyStringToNumber } from '../../../../helpers';

const schema = z.object({
  name: z.string().nonempty('Nome da conta é obrigatório'),
  initialBalance: z.string().nonempty('Saldo inicial é obrigatório'),
  type: z.enum(['CHECKING', 'CASH', 'INVESTMENT']),
  color: z.string().nonempty('Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useNewAccountController() {
  const { isNewAccountModalOpen, closeNewAccountModal } = useDashboard();

  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const invalidateFinance = useInvalidateFinance();
  const { isPending: isLoading, mutateAsync } = useMutation({
    mutationFn: banksServices.createBank,
  });

  useEffect(() => {
    if (!isNewAccountModalOpen) {
      reset();
    }
  }, [isNewAccountModalOpen, reset]);

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
      });

      invalidateFinance();
      toast.success('Conta cadastrada com sucesso!');
      closeNewAccountModal();
      reset();
    } catch {
      toast.error('Erro ao cadastrar conta');
    }
  });

  return {
    isNewAccountModalOpen,
    closeNewAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isLoading,
  };
}
