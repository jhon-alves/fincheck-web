import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { ConfirmDialog, Select } from '../Shared';
import { CategoryIcon } from '../Icons/CategoryIcon';
import { apiErrorMessage } from '../../helpers';
import { useInvalidateCategories } from '../../hooks';
import { categoriesServices } from '../../services/categories-services';
import type { Category } from '../../types/categories-types';

interface DeleteCategoryDialogProps {
  category: Category | null;
  categories: Category[];
  onClose: () => void;
}

/**
 * Sem uso: confirmação simples. Com lançamentos: pede a categoria de destino
 * (mesmo tipo, sugerindo "Outro") e só então exclui.
 */
export function DeleteCategoryDialog({ category, categories, onClose }: DeleteCategoryDialogProps) {
  const invalidateCategories = useInvalidateCategories();
  const [moveTo, setMoveTo] = useState<string | undefined>(undefined);

  const targets = useMemo(
    () => categories.filter((item) => category && item.type === category.type && item.id !== category.id),
    [categories, category],
  );
  const suggested =
    targets.find((item) => item.isDefault && item.icon === 'other')?.id ?? targets[0]?.id;
  const selectedTarget = moveTo ?? suggested;
  const transactionsCount = category?.transactionsCount ?? 0;
  const rulesCount = category?.recurringRulesCount ?? 0;
  const count = transactionsCount + rulesCount;
  const usage = [
    transactionsCount > 0
      ? `${transactionsCount} lançamento${transactionsCount > 1 ? 's' : ''}`
      : null,
    rulesCount > 0 ? `${rulesCount} recorrência${rulesCount > 1 ? 's' : ''}` : null,
  ]
    .filter(Boolean)
    .join(' e ');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      categoriesServices.removeCategory({
        id: category!.id,
        moveToCategoryId: count > 0 ? selectedTarget : undefined,
      }),
  });

  async function handleConfirm() {
    try {
      await mutateAsync();
      await invalidateCategories();
      toast.success(
        count > 0
          ? `Categoria excluída. ${usage} ${count > 1 ? 'foram movidos' : 'foi movido'}.`
          : 'Categoria excluída',
      );
      setMoveTo(undefined);
      onClose();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Não foi possível excluir a categoria'));
    }
  }

  return (
    <ConfirmDialog
      open={!!category}
      onOpenChange={(open) => {
        if (!open) {
          setMoveTo(undefined);
          onClose();
        }
      }}
      title={`Excluir “${category?.name ?? ''}”?`}
      description={
        count > 0
          ? `Esta categoria tem ${usage}. Mova para outra categoria antes de excluir.`
          : 'Essa ação não pode ser desfeita.'
      }
      confirmLabel={count > 0 ? 'Mover e excluir' : 'Excluir'}
      isLoading={isPending}
      onConfirm={handleConfirm}
    >
      {count > 0 && (
        <Select
          placeholder="Mover para"
          value={selectedTarget}
          onChange={setMoveTo}
          options={targets.map((item) => ({
            value: item.id,
            label: item.name,
            icon: (
              <CategoryIcon
                type={item.type}
                icon={item.icon}
                color={item.color}
                size="sm"
                className="size-6 rounded-lg [&_svg]:size-3.5"
              />
            ),
          }))}
        />
      )}
    </ConfirmDialog>
  );
}
