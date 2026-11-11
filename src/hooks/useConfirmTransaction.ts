import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsServices } from '../services/transactions-services';
import type { Transaction } from '../types/transactions-types';
import { queryKeys } from './queryKeys';
import { useInvalidateFinance } from './useInvalidateFinance';

/**
 * Confirma (ou desfaz) um lançamento com update otimista: as listas mudam na
 * hora e voltam se a API recusar.
 */
export function useConfirmTransaction() {
  const queryClient = useQueryClient();
  const invalidateFinance = useInvalidateFinance();

  return useMutation({
    mutationFn: ({ transaction, paid }: { transaction: Transaction; paid: boolean }) =>
      transactionsServices.confirmTransaction({ id: transaction.id, paid }),
    onMutate: async ({ transaction, paid }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions() });
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard() });
      const snapshots = [
        ...queryClient.getQueriesData({ queryKey: queryKeys.transactions() }),
        ...queryClient.getQueriesData({ queryKey: queryKeys.dashboard() }),
      ];

      const patch = (item: Transaction) =>
        item.id === transaction.id ? { ...item, paid } : item;

      queryClient.setQueriesData<Transaction[]>({ queryKey: queryKeys.transactions() }, (old) =>
        Array.isArray(old) ? old.map(patch) : old,
      );
      queryClient.setQueriesData<{ fixed?: { transactions: Transaction[] } }>(
        { queryKey: queryKeys.dashboard() },
        (old) =>
          old?.fixed
            ? { ...old, fixed: { ...old.fixed, transactions: old.fixed.transactions.map(patch) } }
            : old,
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error('Não foi possível atualizar o lançamento');
    },
    onSuccess: (_data, { transaction, paid }) => {
      toast.success(
        !paid
          ? 'Voltou para pendente'
          : transaction.type === 'INCOME'
            ? 'Recebimento confirmado'
            : 'Pagamento confirmado',
      );
    },
    onSettled: () => invalidateFinance(),
  });
}
