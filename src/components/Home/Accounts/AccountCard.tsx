import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BankAccountTypeIcon } from '../../Icons/BankAccountTypeIcon';
import { formatCurrency } from '../../../helpers';
import { useAccountController } from './hooks/useAccountController';

interface AccountCardProps {
  color: string;
  name: string;
  balance: number;
  type: 'CASH' | 'CHECKING' | 'INVESTMENT';
}

export function AccountCard({ color, name, balance, type }: AccountCardProps) {
	const { areValuesVisible } = useAccountController();

	return (
		<div
			style={{ borderBottomColor: color }}
			className="bg-white rounded-2xl p-4 border-b-[8px]"
		>
			<div>
				<BankAccountTypeIcon type={type} />
				<p className="text-gray-800 font-medium mt-4">
					{name}
				</p>
			</div>
			<div className="mt-6">
				<span className={twMerge(clsx(
					'text-gray-800 font-medium mt-4 block',
					!areValuesVisible && 'blur-sm'
				))}
				>
					{formatCurrency(balance)}
				</span>
				<small className="text-gray-600 text-sm">
          Saldo atual
				</small>
			</div>
		</div>
	);
}
