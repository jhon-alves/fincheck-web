import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { EmptyState, Money } from '../../../components/Shared';
import { cn } from '../../../helpers';
import type { DashboardSummary } from '../../../types/dashboard-types';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
];

type Slice = DashboardSummary['expensesByCategory'][number];

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Slice }> }) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload;

  return (
    <div className="rounded-xl border border-border bg-card-elevated px-3 py-2 text-xs shadow-float">
      <p className="font-medium text-fg">{slice.name}</p>
      <Money value={slice.total} className="font-semibold text-fg" />
    </div>
  );
}

export function CategoryDonut({
  data,
  isLoading,
}: {
  data: DashboardSummary['expensesByCategory'];
  isLoading: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.total, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div className="skeleton size-44 rounded-full" />
        <div className="w-full flex-1 space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton h-4" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        className="py-6"
        icon={<PieIcon size={24} />}
        title="Sem saídas neste mês"
        description="Quando houver gastos, eles aparecem aqui por categoria."
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              cornerRadius={6}
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              isAnimationActive
            >
              {data.map((slice, index) => (
                <Cell
                  key={slice.categoryId ?? 'others'}
                  fill={COLORS[index % COLORS.length]}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-[11px] text-muted">Total</span>
          <Money value={total} compact className="text-base font-semibold text-fg" />
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-1">
        {data.map((slice, index) => (
          <li
            key={slice.categoryId ?? 'others'}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
              activeIndex === index && 'bg-subtle',
            )}
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="min-w-0 flex-1 truncate text-fg-soft">{slice.name}</span>
            <span className="money text-xs text-muted">
              {total > 0 ? Math.round((slice.total / total) * 100) : 0}%
            </span>
            <Money value={slice.total} className="w-24 text-right font-medium text-fg" />
          </li>
        ))}
      </ul>
    </div>
  );
}
