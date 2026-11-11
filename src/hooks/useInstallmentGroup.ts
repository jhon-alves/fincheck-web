import { useQuery } from '@tanstack/react-query';
import { transactionsServices } from '../services/transactions-services';
import { queryKeys } from './queryKeys';

export function useInstallmentGroup(installmentGroupId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.installments(installmentGroupId ?? ''),
    queryFn: () => transactionsServices.getInstallmentGroup(installmentGroupId!),
    enabled: !!installmentGroupId,
  });

  return { installments: data ?? [], isLoading };
}
