import { PlusIcon } from '@radix-ui/react-icons';
import { DropdownMenu } from '../../Shared';
import { BankAccountIcon, TransactionsIcon } from '../../Icons';
import { useDashboard } from '../DashboardContext/useDashboard';
import { CategoryIcon } from '../../Icons/categories/CategoryIcon';

export function Fab() {
  const { openNewAccountModal, openNewTransactionModal, openNewTransferModal } =
    useDashboard();

  return (
    <div className="fixed right-4 bottom-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button className="text-white h-12 w-12 bg-teal-900 rounded-full flex items-center justify-center cursor-pointer">
            <PlusIcon className="w-6 h-6" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="gap-2"
            onSelect={() => openNewTransactionModal('EXPENSE')}
          >
            <CategoryIcon type="expense" />
            Nova Despesa
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="gap-2"
            onSelect={() => openNewTransactionModal('INCOME')}
          >
            <CategoryIcon type="income" />
            Nova Receita
          </DropdownMenu.Item>
          <DropdownMenu.Item className="gap-2" onSelect={openNewTransferModal}>
            <TransactionsIcon />
            Transferência
          </DropdownMenu.Item>
          <DropdownMenu.Item className="gap-2" onSelect={openNewAccountModal}>
            <BankAccountIcon />
            Nova Conta
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
