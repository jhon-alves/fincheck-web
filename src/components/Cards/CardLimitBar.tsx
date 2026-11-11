import { cn } from '../../helpers';
import { Money } from '../Shared/Money';

interface CardLimitBarProps {
  used: number;
  limit: number;
  /** `inverse`: texto claro sobre o cartão. */
  tone?: 'default' | 'inverse';
  className?: string;
  showLabels?: boolean;
}

/** Barra de limite usado. Acima de 80% fica em alerta; estourado, em vermelho. */
export function CardLimitBar({
  used,
  limit,
  tone = 'default',
  className,
  showLabels = true,
}: CardLimitBarProps) {
  const ratio = limit > 0 ? used / limit : 0;
  const percent = Math.min(100, Math.max(0, ratio * 100));
  const available = limit - used;

  return (
    <div className={className}>
      {showLabels && (
        <div
          className={cn(
            'mb-1.5 flex items-baseline justify-between gap-2 text-xs',
            tone === 'inverse' ? 'text-white/80' : 'text-muted',
          )}
        >
          <span>
            Usado <Money value={used} className={tone === 'inverse' ? 'text-white' : 'text-fg'} />
          </span>
          <span>
            {available >= 0 ? 'Disponível ' : 'Excedido '}
            <Money
              value={Math.abs(available)}
              className={cn(
                'font-semibold',
                tone === 'inverse' ? 'text-white' : available < 0 ? 'text-expense-strong' : 'text-fg',
              )}
            />
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label="Limite usado"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        className={cn(
          'h-2 overflow-hidden rounded-full',
          tone === 'inverse' ? 'bg-white/25' : 'bg-subtle',
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-700 ease-out',
            ratio >= 1 ? 'bg-expense' : ratio >= 0.8 ? 'bg-warning' : tone === 'inverse' ? 'bg-white' : 'bg-primary-strong',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
