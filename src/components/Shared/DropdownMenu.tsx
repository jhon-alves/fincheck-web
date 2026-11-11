import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../helpers';

function DropdownMenuRoot({ children }: { children: React.ReactNode }) {
  return <RadixDropdownMenu.Root>{children}</RadixDropdownMenu.Root>;
}

function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  return (
    <RadixDropdownMenu.Trigger className="outline-none" asChild>
      {children}
    </RadixDropdownMenu.Trigger>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

function DropdownMenuContent({
  children,
  className,
  align = 'end',
}: DropdownMenuContentProps) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        align={align}
        sideOffset={8}
        className={cn(
          'z-[95] min-w-48 rounded-2xl border border-border bg-card-elevated p-1.5 shadow-float',
          'data-[side=bottom]:animate-slide-up-and-fade data-[side=top]:animate-slide-down-and-fade',
          className,
        )}
      >
        {children}
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
}

function DropdownMenuItem({
  children,
  className,
  onSelect,
  variant = 'default',
}: DropdownMenuItemProps) {
  return (
    <RadixDropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        'flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-fg outline-none transition-colors select-none',
        'data-[highlighted]:bg-subtle',
        variant === 'danger' && 'text-expense-strong data-[highlighted]:bg-expense-soft',
        className,
      )}
    >
      {children}
    </RadixDropdownMenu.Item>
  );
}

function DropdownMenuSeparator() {
  return <RadixDropdownMenu.Separator className="my-1 h-px bg-border" />;
}

function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <RadixDropdownMenu.Label className="px-3 py-2">{children}</RadixDropdownMenu.Label>
  );
}

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
};
