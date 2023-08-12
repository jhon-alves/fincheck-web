import { formatDate } from '../../../../../app/utils/formaDate';
import { formatCurrency, cn } from '../../../../../helpers';
import { CategoryIcon } from '../../../../components/icons/categories/CategoryIcon';
import { useTransactionController } from './useTransactionController';

interface TransactionCardProps {
  type: 'INCOME' | 'EXPENSE';
  name: string;
  category?: string;
  date: string;
  value: number;
  transaction: object;
  onClick(): void;
}

export function TransactionCard({ type, name, category, date, value, onClick }: TransactionCardProps) {
  const { areValuesVisible } = useTransactionController();

  return (
    <div
      className="rounded-2xl p-4 bg-white flex items-center justify-between gap-4"
      role="button"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <CategoryIcon
          type={type === 'EXPENSE' ? 'expense' : 'income'}
          category={category}
        />
        <div>
          <strong className="tracking-[-0.5px] block">
            {name}
          </strong>
          <span className="text-sm text-gray-600">
            {formatDate(new Date(date))}
          </span>
        </div>
      </div>
      <span
        className={cn(
          ' tracking-[-0.5px] font-medium',
          type === 'EXPENSE'
            ? 'text-red-800'
            : 'text-green-800',
          !areValuesVisible && 'blur-sm'
        )}
      >
        {type === 'EXPENSE' ? '-' : '+'}{' '}
        {formatCurrency(value)}
      </span>
    </div>
  );
}
