import { cn } from '../../helpers';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ checked = false, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none cursor-pointer',
        checked ? 'bg-teal-900' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}
