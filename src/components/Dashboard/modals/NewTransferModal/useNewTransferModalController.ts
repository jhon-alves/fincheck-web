import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transfersServices } from '../../../../services/transfers-services';
import { currencyStringToNumber, dateToApi } from '../../../../helpers';
import { useDashboard } from '../../DashboardContext/useDashboard';
import { useBankAccounts } from '../../../../hooks';

const schema = z
  .object({
    value: z.string().nonempty('Informe o valor'),
    name: z.string(),
    fromBankAccountId: z.string().nonempty('Informe a conta de origem'),
    toBankAccountId: z.string().nonempty('Informe a conta de destino'),
    date: z.date(),
  })
  .refine((data) => data.fromBankAccountId !== data.toBankAccountId, {
    message: 'As contas precisam ser diferentes',
    path: ['toBankAccountId'],
  });

type FormData = z.infer<typeof schema>;

export function useNewTransferController() {
  const { isNewTransferModalOpen, closeNewTransferModal } = useDashboard();

  const {
    handleSubmit: hookFormHandleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const { accounts } = useBankAccounts();
  const { isPending: isLoading, mutateAsync } = useMutation({
    mutationFn: transfersServices.createTransfer,
  });

  useEffect(() => {
    if (!isNewTransferModalOpen) {
      reset();
    }
  }, [isNewTransferModalOpen, reset]);

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await mutateAsync({
        fromBankAccountId: data.fromBankAccountId,
        toBankAccountId: data.toBankAccountId,
        name: data.name || undefined,
        value: currencyStringToNumber(data.value),
        date: dateToApi(data.date),
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      toast.success('Transferência realizada com sucesso!');
      closeNewTransferModal();
    } catch {
      toast.error('Erro ao realizar a transferência');
    }
  });

  return {
    isNewTransferModalOpen,
    closeNewTransferModal,
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    isLoading,
  };
}
