import { useState } from 'react';
import { useAccounts } from '../../../../hooks';

export function useFiltersModal() {
	const [selectedBankAccount, setSelectedBankAccount] = useState<undefined | string>(undefined);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const { accounts } = useAccounts();

	function handleSelectBankAccount(bankAccountId: string) {
		setSelectedBankAccount(prevState => prevState === bankAccountId ? undefined : bankAccountId);
	}

	function handleChangeYear(step: number) {
		setSelectedYear(prevState => prevState + step);
	}

	return {
		selectedYear,
		selectedBankAccount,
		handleSelectBankAccount,
		handleChangeYear,
		accounts
	};
}
