import { ChevronDownIcon } from '@radix-ui/react-icons';
import { TransactionsIcon } from '../../Icons/TransactionsIcon';
import { DropdownMenu } from '../..';
import { IncomeIcon } from '../../Icons/IncomeIcon';
import { ExpensesIcon } from '../../Icons/ExpensesIcon';

export function TransactionDropdown() {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button className="flex items-center gap-2">
					<TransactionsIcon />
					<span className="text-sm text-gray-800 font-medium">
            Transações
					</span>
					<ChevronDownIcon className="text-gray-800" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="min-w-[180px] z-50">
				<DropdownMenu.Item className="flex items-center gap-3">
					<IncomeIcon />
          Receitas
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="flex items-center gap-3"
				>
					<ExpensesIcon />
          Despesas
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="flex items-center gap-3"
				>
					<TransactionsIcon />
          Transações
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
