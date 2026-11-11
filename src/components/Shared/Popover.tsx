import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '../../helpers';

interface PopoverRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function PopoverRoot({ children, open, onOpenChange }: PopoverRootProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixPopover.Root>
  );
}

function PopoverTrigger({ children }: { children: React.ReactNode }) {
  return <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

function PopoverContent({ children, className, align = 'center' }: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          'z-[95] rounded-2xl border border-border bg-card-elevated p-4 shadow-float outline-none',
          'data-[side=bottom]:animate-slide-up-and-fade data-[side=top]:animate-slide-down-and-fade',
          className,
        )}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: RadixPopover.Close,
};
