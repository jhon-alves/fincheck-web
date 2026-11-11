import { Check } from 'lucide-react';
import { cn } from '../../helpers';
import { CATEGORY_COLORS } from '../Icons/categoryPalette';

interface CategoryColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

/** Paleta de 12 cores (tokens --cat-*). */
export function CategoryColorPicker({ value, onChange, className }: CategoryColorPickerProps) {
  return (
    <div role="radiogroup" aria-label="Cor" className={cn('flex flex-wrap gap-2', className)}>
      {CATEGORY_COLORS.map((color) => {
        const isSelected = color.key === value;

        return (
          <button
            key={color.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={color.label}
            title={color.label}
            onClick={() => onChange(color.key)}
            className={cn(
              'grid size-8 place-items-center rounded-full ring-offset-2 ring-offset-card transition-transform outline-none hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring',
              isSelected && 'ring-2 ring-fg',
            )}
            style={{ backgroundColor: `var(--cat-${color.key})` }}
          >
            {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
          </button>
        );
      })}
    </div>
  );
}
