import { ConfirmDialog } from './ConfirmDialog';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  description?: string;
  isLoading: boolean;
}

/** Atalho do diálogo de confirmação para exclusões (API antiga mantida). */
export function ConfirmDeleteModal({
  onConfirm,
  onClose,
  title,
  description,
  isLoading,
}: ConfirmDeleteModalProps) {
  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={title}
      description={description}
      confirmLabel="Excluir"
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  );
}
