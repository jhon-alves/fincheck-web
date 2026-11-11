import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { Button, Input } from '../Shared';
import { apiErrorMessage } from '../../helpers';
import { useInvalidateCategories } from '../../hooks';
import { categoriesServices } from '../../services/categories-services';
import type { Category, CategoryType } from '../../types/categories-types';
import { DEFAULT_CATEGORY_COLOR, categoryColorVar } from '../Icons/categoryPalette';
import { CategoryChip } from './CategoryChip';
import { CategoryColorPicker } from './CategoryColorPicker';
import { CategoryIconPicker } from './CategoryIconPicker';

interface QuickCategoryFormProps {
  type: CategoryType;
  onCreated: (category: Category) => void;
  onCancel: () => void;
}

/**
 * Criação rápida dentro do formulário de lançamento: nome, ícone e cor. Não é
 * um <form> (fica dentro do formulário do lançamento); o Enter no nome cria.
 */
export function QuickCategoryForm({ type, onCreated, onCancel }: QuickCategoryFormProps) {
  const invalidateCategories = useInvalidateCategories();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const [error, setError] = useState<string>();
  const nameRef = useRef<HTMLInputElement>(null);

  // O select do Radix devolve o foco para o gatilho ao fechar; o nome só pega
  // o foco depois disso (por isso o timeout em vez de autoFocus).
  useEffect(() => {
    const timeout = window.setTimeout(() => nameRef.current?.focus(), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: categoriesServices.createCategory,
  });

  async function handleCreate() {
    if (!name.trim()) {
      setError('Dê um nome à categoria');
      return;
    }

    try {
      const category = await mutateAsync({ name: name.trim(), type, icon, color });
      await invalidateCategories();
      toast.success(`Categoria “${category.name}” criada`);
      onCreated(category);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, 'Não foi possível criar a categoria'));
    }
  }

  return (
    <div
      role="group"
      aria-label="Criar categoria"
      className="space-y-3 rounded-2xl border border-border bg-subtle/60 p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-fg">
          Nova categoria de {type === 'EXPENSE' ? 'saída' : 'entrada'}
        </span>
        <CategoryChip name={name} type={type} icon={icon} color={color} />
      </div>
      <Input
        name="quick-category-name"
        ref={nameRef}
        placeholder="Nome da categoria"
        autoComplete="off"
        value={name}
        error={error}
        onChange={(event) => {
          setName(event.target.value);
          setError(undefined);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleCreate();
          }
        }}
      />
      <CategoryIconPicker
        value={icon}
        onChange={setIcon}
        accent={categoryColorVar(color)}
        className="[&_[role=radiogroup]]:max-h-36"
      />
      <CategoryColorPicker value={color} onChange={setColor} />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleCreate} isLoading={isPending}>
          Criar e usar
        </Button>
      </div>
    </div>
  );
}
