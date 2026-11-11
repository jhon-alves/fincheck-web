import { ReactNode, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../helpers';

export type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** Classe do "pill" ativo (ex.: cor do tipo de lançamento). */
  activeClassName?: string;
};

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  'aria-label': string;
  className?: string;
  size?: 'sm' | 'md';
}

/** Grupo de opções exclusivas com o indicador deslizando entre elas. */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
  ...props
}: SegmentedControlProps<T>) {
  const layoutId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={props['aria-label']}
      className={cn(
        'grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-subtle p-1',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const index = options.findIndex((o) => o.value === value);
              const step = event.key === 'ArrowRight' ? 1 : -1;
              const next = options[(index + step + options.length) % options.length];
              onChange(next.value);
              const buttons = event.currentTarget.parentElement?.querySelectorAll('button');
              buttons?.[options.indexOf(next)]?.focus();
            }}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              'relative flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors outline-none',
              'focus-visible:ring-4 focus-visible:ring-ring',
              size === 'md' ? 'h-10 px-3 text-sm' : 'h-8 px-2.5 text-xs',
              isActive ? 'text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', bounce: 0.18, duration: 0.4 }
                }
                className={cn(
                  'absolute inset-0 rounded-xl bg-card shadow-soft',
                  option.activeClassName,
                )}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
