import { CategoryIcon } from '../Icons/CategoryIcon';
import { categoryColorVar } from '../Icons/categoryPalette';
import type { CategoryType } from '../../types/categories-types';

/** Preview ao vivo da categoria: ícone + nome numa pílula com a cor. */
export function CategoryChip({
  name,
  type,
  icon,
  color,
}: {
  name: string;
  type: CategoryType;
  icon: string;
  color: string | null;
}) {
  const colorVar = categoryColorVar(color);

  return (
    <span
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1 pr-4 pl-1 shadow-soft"
      style={colorVar ? { borderColor: `color-mix(in oklab, ${colorVar} 35%, var(--border))` } : undefined}
    >
      <CategoryIcon type={type} icon={icon} color={color} size="sm" className="rounded-full" />
      <span className="truncate text-sm font-semibold text-fg">{name || 'Nova categoria'}</span>
    </span>
  );
}
