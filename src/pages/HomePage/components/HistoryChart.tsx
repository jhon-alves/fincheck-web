import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Money } from '../../../components/Shared';
import { MONTHS } from '../../../config/constants';
import type { DashboardSummary } from '../../../types/dashboard-types';

type Point = { label: string; income: number; expense: number; year: number };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Point }>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="space-y-1 rounded-xl border border-border bg-card-elevated px-3 py-2 text-xs shadow-float">
      <p className="font-semibold text-fg">
        {point.label}/{point.year}
      </p>
      <p className="flex items-center justify-between gap-4 text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-income" /> Entradas
        </span>
        <Money value={point.income} className="font-semibold text-fg" />
      </p>
      <p className="flex items-center justify-between gap-4 text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-expense" /> Saídas
        </span>
        <Money value={point.expense} className="font-semibold text-fg" />
      </p>
    </div>
  );
}

export function HistoryChart({
  data,
  isLoading,
}: {
  data: DashboardSummary['history'];
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="skeleton h-56" />;
  }

  const points: Point[] = data.map((item) => ({
    label: MONTHS[item.month],
    year: item.year,
    income: item.income,
    expense: item.expense,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-3 flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-income" /> Entradas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-expense" /> Saídas
        </span>
      </div>
      <div className="h-56 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {/* Sem eixo Y: os valores ficam no tooltip (que respeita o modo privacidade) */}
          <BarChart data={points} barGap={4} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--subtle)', radius: 8 }} />
            <Bar dataKey="income" name="Entradas" fill="var(--income)" radius={[6, 6, 2, 2]} maxBarSize={22} />
            <Bar dataKey="expense" name="Saídas" fill="var(--expense)" radius={[6, 6, 2, 2]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
