import { Landmark, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { PageContainer } from '../../components/Layout';
import { Button, Card, EmptyState, Money } from '../../components/Shared';
import { AccountTypeIcon, accountTypeLabels } from '../../components/Icons';
import { useDashboard } from '../../components/Dashboard';
import { useBankAccounts } from '../../hooks';

export function AccountsPage() {
  const { accounts, isLoading } = useBankAccounts();
  const { openNewAccountModal, openEditAccountModal } = useDashboard();
  const totalBalance = accounts.reduce((total, account) => total + account.currentBalance, 0);

  return (
    <PageContainer className="space-y-6">
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between md:p-6">
        <div>
          <p className="text-sm text-muted">Saldo total em contas</p>
          {isLoading ? (
            <div className="skeleton mt-2 h-9 w-48" />
          ) : (
            <Money
              value={totalBalance}
              className="mt-1 block text-3xl font-semibold tracking-tight text-fg md:text-4xl"
            />
          )}
          <p className="mt-1 text-xs text-muted">
            Compras no cartão de crédito só saem do saldo quando a fatura é paga.
          </p>
        </div>
        <Button onClick={openNewAccountModal}>
          <Plus size={18} strokeWidth={2.4} /> Nova conta
        </Button>
      </Card>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-40" />
          ))}
        </div>
      )}

      {!isLoading && accounts.length === 0 && (
        <Card>
          <EmptyState
            icon={<Landmark size={28} />}
            title="Nenhuma conta cadastrada"
            description="Cadastre suas contas para acompanhar o saldo e lançar entradas e saídas."
            action={
              <Button onClick={openNewAccountModal}>
                <Plus size={18} /> Cadastrar primeira conta
              </Button>
            }
          />
        </Card>
      )}

      {!isLoading && accounts.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account, index) => (
            <motion.li
              key={account.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => openEditAccountModal(account)}
                aria-label={`Editar conta ${account.name}`}
                className="group relative flex h-full w-full flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-soft transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-float focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ backgroundColor: account.color }}
                />
                <div className="flex items-center gap-3">
                  <AccountTypeIcon type={account.type} color={account.color} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-fg">{account.name}</p>
                    <p className="text-xs text-muted">{accountTypeLabels[account.type]}</p>
                  </div>
                </div>
                <div>
                  <Money
                    value={account.currentBalance}
                    className="block text-2xl font-semibold tracking-tight text-fg"
                  />
                  <p className="mt-0.5 text-xs text-muted">
                    Saldo atual · inicial <Money value={account.initialBalance} />
                  </p>
                </div>
              </button>
            </motion.li>
          ))}
          <li>
            <button
              type="button"
              onClick={openNewAccountModal}
              className="flex h-full min-h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-muted transition-colors hover:border-primary-strong/40 hover:bg-card hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="grid size-10 place-items-center rounded-full bg-subtle">
                <Plus size={20} />
              </span>
              <span className="text-sm font-medium">Nova conta</span>
            </button>
          </li>
        </ul>
      )}
    </PageContainer>
  );
}
