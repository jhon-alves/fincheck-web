import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiErrorMessage, apiErrorStatus } from '../../../helpers';
import { useInvalidateCategories } from '../../../hooks';
import { categoriesServices } from '../../../services/categories-services';
import type { Category, CategoryType } from '../../../types/categories-types';
import { DEFAULT_CATEGORY_COLOR } from '../../Icons/categoryPalette';

const schema = z.object({
  name: z.string().trim().min(1, 'Dê um nome à categoria').max(40, 'Use até 40 caracteres'),
  type: z.enum(['INCOME', 'EXPENSE']),
  icon: z.string().min(1, 'Escolha um ícone'),
  color: z.string().min(1, 'Escolha uma cor'),
});

export type CategoryFormData = z.infer<typeof schema>;

export function useCategoryFormController({
  category,
  defaultType,
  onSaved,
}: {
  category: Category | null;
  defaultType: CategoryType;
  onSaved: (category: Category) => void;
}) {
  const invalidateCategories = useInvalidateCategories();
  const isEditing = !!category;
  // Com lançamentos, o tipo fica travado (a API também recusa a troca).
  const isTypeLocked =
    isEditing &&
    (category?.transactionsCount ?? 0) + (category?.recurringRulesCount ?? 0) > 0;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? '',
      type: category?.type ?? defaultType,
      icon: category?.icon ?? 'tag',
      color: category?.color ?? DEFAULT_CATEGORY_COLOR,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CategoryFormData) =>
      category
        ? categoriesServices.updateCategory({ id: category.id, ...data })
        : categoriesServices.createCategory(data),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const saved = await mutateAsync({ ...data, name: data.name.trim() });
      await invalidateCategories();
      toast.success(isEditing ? 'Categoria atualizada!' : 'Categoria criada!');
      onSaved(saved);
    } catch (error) {
      const message = apiErrorMessage(error, 'Não foi possível salvar a categoria');
      // Nome repetido (409) aparece no próprio campo.
      if (apiErrorStatus(error) === 409) {
        form.setError('name', { message });
      } else {
        toast.error(message);
      }
    }
  });

  const [name, type, icon, color] = useWatch({
    control: form.control,
    name: ['name', 'type', 'icon', 'color'],
  });

  return {
    form,
    values: { name, type, icon, color },
    isEditing,
    isTypeLocked,
    isPending,
    handleSubmit,
  };
}
