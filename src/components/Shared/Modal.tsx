import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../helpers';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Modal({
  children,
  open,
  title,
  description,
  rightAction,
  onClose,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-overlay backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-float outline-none',
            'data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
            className,
          )}
        >
          <header className="mb-6 flex items-center justify-between gap-3">
            <Dialog.Close
              aria-label="Fechar"
              className="grid size-10 place-items-center rounded-full text-fg-soft transition-colors outline-none hover:bg-subtle focus-visible:ring-4 focus-visible:ring-ring"
            >
              <X size={20} />
            </Dialog.Close>
            <Dialog.Title className="text-lg font-semibold tracking-tight text-fg">
              {title}
            </Dialog.Title>
            <div className="grid size-10 place-items-center">{rightAction}</div>
          </header>
          {description ? (
            <Dialog.Description className="sr-only">{description}</Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}

          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
