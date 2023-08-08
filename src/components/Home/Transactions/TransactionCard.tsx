import moment from 'moment';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatCurrency } from '../../../helpers';
import { CategoryIcon } from '../../Icons/categories/CategoryIcon';
import { useTransactionsController } from './hooks/useTransactionsController';

interface TransactionCardProps {
  type: 'income' | 'expense';
  category?: string;
  name: string;
  date: string;
  value: number;
}

export function TransactionCard({ type, category, name, date, value }: TransactionCardProps) {
	const { areValuesVisible } = useTransactionsController();

	return (
		<div className="bg-white p-4 flex items-center justify-between rounded-2xl gap-4">
			<div className="flex items-center gap-3">
				<CategoryIcon type={type} category={category} />
				<div className="flex flex-col">
					<strong>{name}</strong>
					<span className="text-gray-400 text-sm">{moment(date).format('DD/MM/YYYY')}</span>
				</div>
			</div>
			<span className={twMerge(clsx(
				'font-medium', !areValuesVisible && 'blur-sm'
			))}
			>
				{formatCurrency(value)}
			</span>
		</div>
	);
}
