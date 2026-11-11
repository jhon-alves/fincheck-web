import { ReactNode } from 'react';
import * as AlertDialog from '@radix-ui/react-dialog';
import { LogOut, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../helpers';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'neutral';
  icon?: 'trash' | 'logout';
  isLoading?: boolean;
  onConfirm: () => void;
  /** Conteúdo extra (ex.: escolha de escopo das parcelas). */
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  icon = 'trash',
  isLoading,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const Icon = icon === 'logout' ? LogOut : Trash2;

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[80] bg-overlay backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <AlertDialog.Content
          role="alertdialog"
          className="fixed top-1/2 left-1/2 z-[81] w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-float outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className={cn(
                'grid size-12 place-items-center rounded-full',
                variant === 'danger'
                  ? 'bg-expense-soft text-expense-strong'
                  : 'bg-subtle text-fg',
              )}
            >
              <Icon size={22} aria-hidden />
            </div>
            <AlertDialog.Title className="text-lg font-semibold tracking-tight text-fg">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description
              className={cn('text-sm text-muted', !description && 'sr-only')}
            >
              {description ?? title}
            </AlertDialog.Description>
          </div>

          {children && <div className="mt-5">{children}</div>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'dark'}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
