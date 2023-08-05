import { PlusIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '../../Shared';
import { Expense } from '../../Icons/categories/expense/Expense';
import { Income } from '../../Icons/categories/income/Income';
import { BankAccountIcon } from '../../Icons';
import { useTransactionsController } from './hooks/useTransactionsController';

export function CreateTransactionButton() {
	const {
		handleNewAccountModalOpen,
		openNewTransactionModal
	} = useTransactionsController();
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button className="bg-teal-900 rounded-full flex items-center gap-2
        justify-center w-9 h-9 hover:bg-teal-800 transition-colors">
					<PlusIcon className="text-white w-5 h-5" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="min-w-[180px] z-50">
				<DropdownMenu.Item
					onSelect={() => openNewTransactionModal('EXPENSE')}
					className="flex items-center gap-3"
				>
					<Expense />
          Nova Despesa
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onSelect={() => openNewTransactionModal('INCOME')}
					className="flex items-center gap-3"
				>
					<Income />
          Nova Receita
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onSelect={handleNewAccountModalOpen}
					className="flex items-center gap-3"
				>
					<BankAccountIcon />
          Nova Conta
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
