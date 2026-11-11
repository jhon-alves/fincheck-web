import { CalendarPlus, CreditCard, ReceiptText } from 'lucide-react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  Money,
} from '../../../components/Shared';
import { MiniCard } from '../../../components/Cards';
import { TransactionRow } from '../../../components/Transactions';
import { useDashboard } from '../../../components/Dashboard';
import { cn, formatLongDay, toApiDate } from '../../../helpers';
import { useTransactions } from '../../../hooks';
import type { Card } from '../../../types/cards-types';

interface DayDrawerProps {
  open: boolean;
  date: Date | null;
  dueCards: Card[];
  onClose: () => void;
}

/** O que entrou e saiu num dia do calendário. */
export function DayDrawer({ open, date, dueCards, onClose }: DayDrawerProps) {
  return (
    <Drawer open={open && !!date} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent>{date && <DayContent date={date} dueCards={dueCards} />}</DrawerContent>
    </Drawer>
  );
}

function DayContent({ date, dueCards }: { date: Date; dueCards: Card[] }) {
  const { openTransactionDetail, openNewTransaction } = useDashboard();
  const day = toApiDate(date);
  const { transactions, isInitialLoading } = useTransactions({ from: day, to: day });

  const income = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((total, t) => total + t.value, 0);
  const expense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((total, t) => total + t.value, 0);
  const balance = income - expense;

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>{formatLongDay(date)}</DrawerTitle>
        <DrawerDescription>
          {isInitialLoading
            ? 'Carregando…'
            : transactions.length === 0
              ? 'Nenhum lançamento neste dia'
              : `${transactions.length} lançamento${transactions.length > 1 ? 's' : ''}`}
        </DrawerDescription>
      </DrawerHeader>

      <DrawerBody className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Entradas', value: income, className: 'text-income-strong' },
            { label: 'Saídas', value: expense, className: 'text-expense-strong' },
            { label: 'Saldo', value: balance, className: balance < 0 ? 'text-expense-strong' : 'text-fg' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-subtle px-3 py-2.5">
              <p className="text-[11px] text-muted">{item.label}</p>
              <Money
                value={item.value}
                sign={item.label === 'Saldo' ? 'auto' : undefined}
                className={cn('block truncate text-sm font-semibold', item.className)}
              />
            </div>
          ))}
        </div>

        {dueCards.length > 0 && (
          <div className="space-y-2">
            {dueCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning-soft px-3.5 py-3"
              >
                <CreditCard size={18} className="shrink-0 text-warning-strong" aria-hidden />
                <p className="flex-1 text-sm text-fg">
                  Vence neste dia a fatura do <strong>{card.name}</strong>
                </p>
                <MiniCard color={card.color} brand={card.brand} />
              </div>
            ))}
          </div>
        )}

        {isInitialLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-14" />
            ))}
          </div>
        )}

        {!isInitialLoading && transactions.length === 0 && (
          <EmptyState
            className="py-8"
            icon={<ReceiptText size={26} />}
            title="Dia tranquilo"
            description="Nada foi lançado neste dia."
          />
        )}

        <div className="-mx-3 space-y-0.5">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              installmentLabel="long"
              onClick={openTransactionDetail}
            />
          ))}
        </div>
      </DrawerBody>

      <DrawerFooter>
        <Button className="w-full sm:w-auto" onClick={() => openNewTransaction({ date })}>
          <CalendarPlus size={17} /> Adicionar neste dia
        </Button>
      </DrawerFooter>
    </>
  );
}
