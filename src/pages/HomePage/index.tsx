import { ArrowDownLeft, ArrowUpRight, CreditCard, PiggyBank, ReceiptText } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import { EmptyState } from '../../components/Shared';
import { TransactionRow } from '../../components/Transactions';
import { useDashboard } from '../../components/Dashboard';
import { formatDayHeading, formatMonthYear, fromApiDate } from '../../helpers';
import { useDashboardSummary } from '../../hooks';
import { CardsCarousel, CardsTotal } from './components/CardsCarousel';
import { CategoryDonut } from './components/CategoryDonut';
import { FixedOfMonth } from './components/FixedOfMonth';
import { HeroBalance } from './components/HeroBalance';
import { HistoryChart } from './components/HistoryChart';
import { HomeBlock } from './components/HomeBlock';
import { KpiCard } from './components/KpiCard';
import { UpcomingList } from './components/UpcomingList';

const EMPTY_TOTALS = { income: 0, expense: 0, savings: 0, openInvoices: 0 };

export function HomePage() {
  const { selectedMonth, openTransactionDetail } = useDashboard();
  const { summary, isLoading } = useDashboardSummary(selectedMonth.month, selectedMonth.year);
  const current = summary?.current ?? EMPTY_TOTALS;
  const previous = summary?.previous ?? EMPTY_TOTALS;
  const monthLabel = formatMonthYear(new Date(selectedMonth.year, selectedMonth.month, 1));

  return (
    <PageContainer className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <HeroBalance totalBalance={summary?.totalBalance ?? 0} isLoading={isLoading} />
      </div>

      <section aria-label={`Indicadores de ${monthLabel}`} className="grid grid-cols-2 gap-4 lg:col-span-2">
        <KpiCard
          label="Entradas"
          value={current.income}
          previous={previous.income}
          icon={ArrowDownLeft}
          iconTone="bg-income-soft text-income-strong"
          higherIsBetter
          isLoading={isLoading}
        />
        <KpiCard
          label="Saídas"
          value={current.expense}
          previous={previous.expense}
          icon={ArrowUpRight}
          iconTone="bg-expense-soft text-expense-strong"
          higherIsBetter={false}
          isLoading={isLoading}
        />
        <KpiCard
          label="Economia"
          value={current.savings}
          previous={previous.savings}
          icon={PiggyBank}
          iconTone="bg-primary-soft text-primary-strong dark:text-primary"
          higherIsBetter
          isLoading={isLoading}
        />
        <KpiCard
          label="Faturas abertas"
          value={current.openInvoices}
          previous={previous.openInvoices}
          icon={CreditCard}
          iconTone="bg-warning-soft text-warning-strong"
          higherIsBetter={false}
          isLoading={isLoading}
        />
      </section>

      <HomeBlock title="Gastos por categoria" description={monthLabel} className="lg:col-span-2">
        <CategoryDonut data={summary?.expensesByCategory ?? []} isLoading={isLoading} />
      </HomeBlock>

      <HomeBlock title="Evolução" description="Entradas × saídas nos últimos 6 meses" className="lg:col-span-2">
        <HistoryChart data={summary?.history ?? []} isLoading={isLoading} />
      </HomeBlock>

      <HomeBlock
        title="Meus cartões"
        description={summary ? undefined : ' '}
        link={{ to: '/cartoes', label: 'Ver cartões' }}
        className="overflow-hidden lg:col-span-4"
      >
        {summary && summary.cards.length > 0 && (
          <div className="-mt-3 mb-3">
            <CardsTotal cards={summary.cards} />
          </div>
        )}
        <CardsCarousel cards={summary?.cards ?? []} isLoading={isLoading} />
      </HomeBlock>

      <HomeBlock
        title="Fixos do mês"
        description={
          summary && summary.fixed.transactions.length > 0
            ? `${summary.fixed.confirmed} de ${summary.fixed.transactions.length} confirmados`
            : monthLabel
        }
        link={{ to: '/extrato?aba=recorrentes', label: 'Recorrentes' }}
        className="lg:col-span-2"
      >
        <FixedOfMonth fixed={summary?.fixed} isLoading={isLoading} />
      </HomeBlock>

      <HomeBlock title="Próximos 7 dias" description="Pendentes e faturas a vencer" className="lg:col-span-2">
        <UpcomingList upcoming={summary?.upcoming} isLoading={isLoading} />
      </HomeBlock>

      <HomeBlock
        title="Últimos lançamentos"
        link={{ to: '/extrato', label: 'Ver extrato' }}
        className="lg:col-span-4"
      >
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton h-12" />
            ))}
          </div>
        )}
        {!isLoading && summary?.recentTransactions.length === 0 && (
          <EmptyState
            className="py-6"
            icon={<ReceiptText size={24} />}
            title="Nenhum lançamento ainda"
            description="Use “Novo lançamento” para registrar o primeiro."
          />
        )}
        <div className="-mx-3 space-y-0.5">
          {summary?.recentTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              dateLabel={formatDayHeading(fromApiDate(transaction.date))}
              onClick={openTransactionDetail}
            />
          ))}
        </div>
      </HomeBlock>
    </PageContainer>
  );
}
