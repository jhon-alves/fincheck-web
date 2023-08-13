import { Modal } from '.';
import { Button } from './Button';
import { TrashIcon } from '../Icons/TrashIcon';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  description?: string;
  isLoading: boolean;
}

export function ConfirmDeleteModal({
  onConfirm,
  onClose,
  title,
  description,
  isLoading,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open onClose={onClose} title="Excluir">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-[52px] h-[52px] rounded-full bg-red-0 flex items-center justify-center">
          <TrashIcon className="w-6 h-6 text-red-900" />
        </div>
        <p className="max-w-[180px] text-gray-900 tracking-[-0.5px] font-bold">
          {title}
        </p>
        {description && (
          <p className="tracking-[-0.5px] text-gray-800">{description}</p>
        )}
      </div>
      <div className="mt-10 space-y-4">
        <Button
          variant="danger"
          className="w-full"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Sim, desejo excluir
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
