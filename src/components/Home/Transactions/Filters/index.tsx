import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button } from '@mui/material';
import { Modal } from '../../../Shared';
import { useFiltersModal } from './useFiltersModal';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface FiltersModalProps {
  open: boolean;
  onClose(): void;
  onApplyfilters(filters: { bankAccountId: string | undefined; year: number }): void;
}

export function FiltersModal({ open, onClose, onApplyfilters }: FiltersModalProps) {
	const {
		selectedYear,
		selectedBankAccount,
		handleSelectBankAccount,
		handleChangeYear,
		accounts
	} = useFiltersModal();

	return (
		<Modal open={open} onClose={onClose} title="Filtros">
			<div className="">
				<span className="text-lg font-medium text-gray-800">Conta</span>

				<div className="space-y-2 mt-2">
					{accounts.map(account => (
						<button
							key={account.id}
							onClick={() => handleSelectBankAccount(account.id)}
							className={twMerge(clsx(
								'p-2 rounded-2xl text-gray-800 w-full',
								'text-left hover:bg-gray-50 transition-colors',
								account.id === selectedBankAccount && '!bg-gray-200'
							))}>
							{account.name}
						</button>
					))}
				</div>
			</div>
			<div className="mt-10 text-gray-800">
				<span className="text-lg font-medium text-gray-800">Ano</span>

				<div className="mt-2 w-52 flex items-center justify-between">
					<button
						onClick={() => handleChangeYear(-1)}
						className="w-12 h-12 flex items-center justify-center"
					>
						<ChevronLeftIcon className="w-6 h-6" />
					</button>
					<div className="text-center flex-1">
						<span className="text-sm font-medium">{selectedYear}</span>
					</div>
					<button
						onClick={() => handleChangeYear(1)}
						className="w-12 h-12 flex items-center justify-center"
					>
						<ChevronRightIcon className="w-6 h-6" />
					</button>
				</div>
			</div>
			<Button
				fullWidth
				variant="contained"
				onClick={() => onApplyfilters({
					bankAccountId: selectedBankAccount,
					year: selectedYear
				})}
			>
        Aplicar Filtros
			</Button>
		</Modal>
	);
}
