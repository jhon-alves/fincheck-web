import { useSearchParams } from 'react-router';
import { Plus, ReceiptText, Repeat, Search, X } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import { Button, Card, EmptyState, SegmentedControl, Spinner } from '../../components/Shared';
import { cn } from '../../helpers';
import { MONTHS_LONG } from '../../config/constants';
import { DayGroup } from './components/DayGroup';
import { RecurringRulesPanel } from './components/RecurringRulesPanel';
import { ActiveFilterChips, StatementFiltersButton } from './components/StatementFilters';
import { StatementSummary } from './components/StatementSummary';
import { useStatementController } from './useStatementController';

function ListSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      {Array.from({ length: 3 }, (_, group) => (
        <div key={group} className="space-y-3">
          <div className="skeleton h-5 w-32" />
          {Array.from({ length: 3 }, (_, row) => (
            <div key={row} className="flex items-center gap-3">
              <div className="skeleton size-10 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
              <div className="skeleton h-4 w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

type StatementTab = 'lancamentos' | 'recorrentes';

export function StatementPage() {
  // A aba fica na URL (/extrato?aba=recorrentes) para dar para linkar.
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: StatementTab = searchParams.get('aba') === 'recorrentes' ? 'recorrentes' : 'lancamentos';

  function changeTab(next: StatementTab) {
    setSearchParams(
      (params) => {
        if (next === 'recorrentes') params.set('aba', 'recorrentes');
        else params.delete('aba');
        return params;
      },
      { replace: true },
    );
  }

  const {
    selectedMonth,
    search,
    setSearch,
    isSearching,
    filters,
    updateFilter,
    clearFilters,
    activeFilterCount,
    hasQuery,
    groups,
    summary,
    isInitialLoading,
    isFetching,
    openTransactionDetail,
    openNewTransaction,
  } = useStatementController();

  const monthName = MONTHS_LONG[selectedMonth.month].toLowerCase();

  const tabs = (
    <SegmentedControl<StatementTab>
      aria-label="Visão do extrato"
      value={tab}
      onChange={changeTab}
      className="sm:w-80"
      options={[
        { value: 'lancamentos', label: 'Lançamentos', icon: <ReceiptText size={15} /> },
        { value: 'recorrentes', label: 'Recorrentes', icon: <Repeat size={15} /> },
      ]}
    />
  );

  if (tab === 'recorrentes') {
    return (
      <PageContainer className="space-y-5">
        {tabs}
        <RecurringRulesPanel />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-5">
      {tabs}
      <StatementSummary {...summary} isLoading={isInitialLoading} />

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar pelo nome"
              aria-label="Buscar lançamentos pelo nome"
              className="h-11 w-full rounded-2xl border border-border bg-card pr-10 pl-10 text-sm text-fg shadow-soft outline-none placeholder:text-muted focus:border-fg/30 focus-visible:ring-4 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-subtle hover:text-fg"
              >
                {isSearching ? <Spinner className="size-4" /> : <X size={15} />}
              </button>
            )}
          </div>
          <StatementFiltersButton
            filters={filters}
            activeCount={activeFilterCount}
            onChange={updateFilter}
            onClear={clearFilters}
          />
        </div>
        <ActiveFilterChips filters={filters} onChange={updateFilter} onClear={clearFilters} />
      </div>

      <Card
        className={cn(
          'p-2 transition-opacity sm:p-3',
          isFetching && !isInitialLoading && 'opacity-70',
        )}
        aria-busy={isFetching}
      >
        {isInitialLoading && (
          <div className="p-3">
            <ListSkeleton />
          </div>
        )}

        {!isInitialLoading && groups.length === 0 && (
          <EmptyState
            icon={<ReceiptText size={28} />}
            title={hasQuery ? 'Nada encontrado' : `Nenhum lançamento em ${monthName}`}
            description={
              hasQuery
                ? 'Nenhum lançamento bate com a busca e os filtros. Tente outros termos.'
                : 'Registre entradas, saídas e compras parceladas para acompanhar o mês.'
            }
            action={
              hasQuery ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Limpar busca e filtros
                </Button>
              ) : (
                <Button onClick={() => openNewTransaction()}>
                  <Plus size={18} strokeWidth={2.4} /> Novo lançamento
                </Button>
              )
            }
          />
        )}

        {!isInitialLoading && groups.length > 0 && (
          <div className="space-y-4">
            {groups.map((group) => (
              <DayGroup key={group.key} group={group} onOpen={openTransactionDetail} />
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
