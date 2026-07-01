import { useState } from 'react';
import { useBankAccounts } from '../../../../hooks';

export function useFiltersModalController(open: boolean) {
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<
    string | undefined
  >(undefined);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [wasOpen, setWasOpen] = useState(open);

  const { accounts } = useBankAccounts();

  // Reseta os filtros locais sempre que o modal é fechado (padrão do React de
  // ajustar estado quando uma prop muda, sem useEffect).
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) {
      setSelectedBankAccountId(undefined);
      setSelectedYear(new Date().getFullYear());
    }
  }

  function handleSelectBankAccount(bankAccountId: string) {
    setSelectedBankAccountId((prevState) =>
      prevState === bankAccountId ? undefined : bankAccountId
    );
  }

  function handleChangeYear(step: number) {
    setSelectedYear((prevState) => prevState + step);
  }

  return {
    handleSelectBankAccount,
    selectedBankAccountId,
    selectedYear,
    handleChangeYear,
    accounts,
  };
}
