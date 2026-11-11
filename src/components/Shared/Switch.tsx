import { cn } from '../../helpers';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  'aria-label'?: string;
  id?: string;
}

export function Switch({ checked = false, onChange, id, ...props }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={props['aria-label']}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors outline-none',
        'focus-visible:ring-4 focus-visible:ring-ring',
        checked ? 'border-primary-strong bg-primary-strong' : 'border-border bg-subtle',
      )}
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-card shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  );
}
