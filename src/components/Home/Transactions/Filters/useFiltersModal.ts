import { useState } from 'react';

export function useFiltersModal() {
	const [selectedBankAccount, setSelectedBankAccount] = useState<null | string>(null);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	function handleSelectBankAccount(bankAccountId: string) {
		setSelectedBankAccount(prevState => prevState === bankAccountId ? null : bankAccountId);
	}

	function handleChangeYear(step: number) {
		setSelectedYear(prevState => prevState + step);
	}

	return {
		selectedYear,
		selectedBankAccount,
		handleSelectBankAccount,
		handleChangeYear
	};
}
