import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../helpers';
import { CUSTOM_CATEGORY_ICONS } from '../Icons/categoryPalette';

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

interface CategoryIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  /** Cor de destaque do ícone escolhido (var(--cat-*)). */
  accent?: string | null;
  className?: string;
}

/** Grid de ícones com busca (por nome e palavras-chave, sem acento). */
export function CategoryIconPicker({ value, onChange, accent, className }: CategoryIconPickerProps) {
  const [query, setQuery] = useState('');

  const options = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return CUSTOM_CATEGORY_ICONS;
    return CUSTOM_CATEGORY_ICONS.filter((option) =>
      normalize(`${option.label} ${option.keywords ?? ''}`).includes(term),
    );
  }, [query]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Search
          size={15}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar ícone (ex.: pet, saúde)"
          aria-label="Buscar ícone"
          className="h-10 w-full rounded-xl border border-border bg-card pr-3 pl-9 text-sm text-fg outline-none placeholder:text-muted focus-visible:ring-4 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <div
        role="radiogroup"
        aria-label="Ícone"
        className="scrollbar grid max-h-52 grid-cols-6 gap-1.5 overflow-y-auto p-0.5 sm:grid-cols-8"
      >
        {options.map((option) => {
          const isSelected = option.key === value;

          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              title={option.label}
              onClick={() => onChange(option.key)}
              className={cn(
                'grid aspect-square place-items-center rounded-xl border transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring',
                isSelected ? 'border-fg/30 bg-subtle' : 'border-transparent text-fg-soft hover:bg-subtle',
              )}
              style={isSelected && accent ? { color: accent } : undefined}
            >
              <option.icon size={18} strokeWidth={1.9} />
            </button>
          );
        })}
        {options.length === 0 && (
          <p className="col-span-full py-4 text-center text-sm text-muted">Nenhum ícone encontrado.</p>
        )}
      </div>
    </div>
  );
}
