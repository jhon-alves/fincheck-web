import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BankAccountTypeIcon } from '../../Icons/BankAccountTypeIcon';
import { formatCurrency } from '../../../helpers';
import { useHome } from '../../../contexts/HomeContext/useHome';
import { BankAccount } from '../../../entities/bankAccount';

interface AccountCardProps {
  data: BankAccount;
}

export function AccountCard({ data }: AccountCardProps) {
	const { color, name, currentBalance, type } = data;
	const { areValuesVisible, openEditAccountModal } = useHome();

	return (
		<div
			style={{ borderBottomColor: color }}
			className="bg-white rounded-2xl p-4 border-b-[8px]"
			onClick={() => openEditAccountModal(data)}
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
					{formatCurrency(currentBalance)}
				</span>
				<small className="text-gray-600 text-sm">
          Saldo atual
				</small>
			</div>
		</div>
	);
}
