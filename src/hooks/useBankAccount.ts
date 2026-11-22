import { useQuery } from '@tanstack/react-query';
import { banksServices } from '../services/banks-services';
import { queryKeys } from './queryKeys';

/**
 * Telas que só usam o nome das contas (filtros, selects) passam
 * `refetchOnMount: false`: o saldo pode estar desatualizado ali sem problema, e
 * assim a lista não é buscada de novo a cada lançamento. A tela de Contas
 * mostra os saldos e usa o padrão, que recarrega quando a lista fica velha.
 */
export function useBankAccounts(options: { refetchOnMount?: boolean } = {}) {
  const { data, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.bankAccounts,
    queryFn: banksServices.getBanks,
    refetchOnMount: options.refetchOnMount,
  });

  return {
    accounts: data ?? [],
    isFetching,
    isLoading,
  };
}
