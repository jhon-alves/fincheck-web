import { Controller } from 'react-hook-form';
import { Lock } from 'lucide-react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  SegmentedControl,
} from '../../Shared';
import { FieldError } from '../../Shared/FieldError';
import { categoryColorVar } from '../../Icons/categoryPalette';
import type { Category, CategoryType } from '../../../types/categories-types';
import { CategoryChip } from '../CategoryChip';
import { CategoryColorPicker } from '../CategoryColorPicker';
import { CategoryIconPicker } from '../CategoryIconPicker';
import { useCategoryFormController } from './useCategoryFormController';

interface CategoryFormDrawerProps {
  open: boolean;
  category: Category | null;
  defaultType: CategoryType;
  onClose: () => void;
}

export function CategoryFormDrawer({ open, category, defaultType, onClose }: CategoryFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent>
        <CategoryForm
          key={category?.id ?? `new-${defaultType}`}
          category={category}
          defaultType={defaultType}
          onClose={onClose}
        />
      </DrawerContent>
    </Drawer>
  );
}

function CategoryForm({
  category,
  defaultType,
  onClose,
}: {
  category: Category | null;
  defaultType: CategoryType;
  onClose: () => void;
}) {
  const {
    form: {
      control,
      register,
      formState: { errors },
    },
    values,
    isEditing,
    isTypeLocked,
    isPending,
    handleSubmit,
  } = useCategoryFormController({ category, defaultType, onSaved: onClose });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DrawerHeader>
        <DrawerTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DrawerTitle>
        <DrawerDescription>Escolha um nome, um ícone e uma cor.</DrawerDescription>
      </DrawerHeader>

      <DrawerBody className="space-y-6">
        <div className="flex justify-center rounded-2xl bg-subtle px-4 py-6" aria-live="polite">
          <CategoryChip name={values.name} type={values.type} icon={values.icon} color={values.color} />
        </div>

        <Input
          {...register('name')}
          placeholder="Nome (ex.: Pet)"
          autoComplete="off"
          autoFocus={!isEditing}
          error={errors.name?.message}
        />

        <div className="space-y-2">
          <span className="text-sm font-semibold text-fg">Tipo</span>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <SegmentedControl<CategoryType>
                aria-label="Tipo da categoria"
                value={field.value}
                onChange={(type) => !isTypeLocked && field.onChange(type)}
                options={[
                  { value: 'EXPENSE', label: 'Saída' },
                  { value: 'INCOME', label: 'Entrada' },
                ].filter((option) => !isTypeLocked || option.value === field.value) as {
                  value: CategoryType;
                  label: string;
                }[]}
              />
            )}
          />
          {isTypeLocked && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Lock size={12} /> O tipo não muda porque a categoria já tem lançamentos.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-fg">Ícone</span>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <CategoryIconPicker
                value={field.value}
                onChange={field.onChange}
                accent={categoryColorVar(values.color)}
              />
            )}
          />
          <FieldError message={errors.icon?.message} />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-fg">Cor</span>
          <Controller
            control={control}
            name="color"
            render={({ field }) => <CategoryColorPicker value={field.value} onChange={field.onChange} />}
          />
          <FieldError message={errors.color?.message} />
        </div>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending} className="min-w-32">
          {isEditing ? 'Salvar' : 'Criar categoria'}
        </Button>
      </DrawerFooter>
    </form>
  );
}
