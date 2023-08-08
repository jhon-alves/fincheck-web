import { ChevronDownIcon } from '@radix-ui/react-icons';
import { TransactionsIcon } from '../../Icons/TransactionsIcon';
import { DropdownMenu } from '../..';
import { IncomeIcon } from '../../Icons/IncomeIcon';
import { ExpensesIcon } from '../../Icons/ExpensesIcon';

interface TransactionDropdownProps {
  onSelect(value: 'INCOME' | 'EXPENSE' | undefined): void;
  selectedType: 'INCOME' | 'EXPENSE' | undefined;
}

export function TransactionDropdown({ onSelect, selectedType }: TransactionDropdownProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button className="flex items-center gap-2">
					{selectedType === 'INCOME' && <IncomeIcon />}
					{selectedType === 'EXPENSE' && <ExpensesIcon />}
					{selectedType === undefined && <TransactionsIcon />}

					<span className="text-sm text-gray-800 font-medium">
						{selectedType === 'INCOME' && 'Receitas'}
						{selectedType === 'EXPENSE' && 'Despesas'}
						{selectedType === undefined && 'Transações'}
					</span>
					<ChevronDownIcon className="text-gray-800" />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="min-w-[180px] z-50">
				<DropdownMenu.Item
					className="flex items-center gap-3"
					onSelect={() => onSelect('INCOME')}
				>
					<IncomeIcon />
          Receitas
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="flex items-center gap-3"
					onSelect={() => onSelect('EXPENSE')}
				>
					<ExpensesIcon />
          Despesas
				</DropdownMenu.Item>
				<DropdownMenu.Item
					className="flex items-center gap-3"
					onSelect={() => onSelect(undefined)}
				>
					<TransactionsIcon />
          Transações
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
