import { ComponentProps, ReactNode, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '../../helpers';

/*
 * Painel lateral sobre o Dialog do Radix: foco preso, Esc fecha e overlay,
 * entrando pela direita. Flutua a 16px das bordas (como a sidebar) e só o
 * corpo rola — cabeçalho e rodapé ficam sempre à vista. No celular vira um
 * bottom sheet que sobe de baixo.
 */

const Drawer = DialogPrimitive.Root;
const DrawerClose = DialogPrimitive.Close;

interface DrawerContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  size?: 'md' | 'lg';
  /** Barra colorida no topo (ex.: destaque do tipo de lançamento). */
  accent?: string;
  hideClose?: boolean;
}

function DrawerContent({
  className,
  children,
  size = 'md',
  accent,
  hideClose,
  onOpenAutoFocus,
  ...props
}: DrawerContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-overlay',
          'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        )}
      />
      <DialogPrimitive.Content
        ref={contentRef}
        // Ao abrir, o foco vai para o painel (e não para o primeiro botão, que
        // pode ser "Excluir"). Se um campo já pegou o foco com autoFocus, fica.
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          if (!contentRef.current?.contains(document.activeElement)) {
            contentRef.current?.focus();
          }
        }}
        className={cn(
          'fixed z-50 flex flex-col overflow-hidden border border-border bg-card shadow-float outline-none',
          // Celular: bottom sheet
          'inset-x-2 bottom-2 max-h-[calc(100dvh-1rem)] rounded-3xl',
          'data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out',
          // Telas maiores: painel à direita, flutuando a 16px das bordas
          'sm:inset-x-auto sm:inset-y-4 sm:right-4 sm:max-h-none sm:w-[calc(100%-2rem)]',
          'sm:data-[state=open]:animate-drawer-in sm:data-[state=closed]:animate-drawer-out',
          size === 'md' ? 'sm:max-w-md' : 'sm:max-w-[560px]',
          className,
        )}
        {...props}
      >
        {accent && (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 transition-colors duration-300"
            style={{ backgroundColor: accent }}
          />
        )}
        <span
          aria-hidden
          className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border sm:hidden"
        />
        {children}

        {!hideClose && (
          <DialogPrimitive.Close
            aria-label="Fechar"
            className={cn(
              'absolute top-4 right-4 grid size-9 place-items-center rounded-full sm:top-5 sm:right-5',
              'text-muted transition-colors outline-none hover:bg-subtle hover:text-fg',
              'focus-visible:ring-4 focus-visible:ring-ring',
            )}
          >
            <X size={18} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

interface DrawerHeaderProps extends ComponentProps<'div'> {
  /** Mostra o botão voltar (troca de conteúdo dentro do mesmo drawer). */
  onBack?: () => void;
}

function DrawerHeader({ className, onBack, children, ...props }: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-start gap-3 border-b border-border px-5 pt-4 pb-4 pr-16 sm:px-6 sm:pt-6 sm:pb-5',
        className,
      )}
      {...props}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="-ml-2 grid size-9 shrink-0 place-items-center rounded-full text-fg-soft transition-colors hover:bg-subtle hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </div>
  );
}

function DrawerBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6', className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-3 border-t border-border px-5 py-4 sm:px-6',
        'pb-[max(1rem,env(safe-area-inset-bottom))]',
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('truncate text-lg font-semibold tracking-tight text-fg sm:text-xl', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn('text-sm text-muted', className)} {...props} />
  );
}

function DrawerSection({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerSection,
};
