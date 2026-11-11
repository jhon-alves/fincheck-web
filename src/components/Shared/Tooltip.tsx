import { ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../helpers';

export const TooltipProvider = RadixTooltip.Provider;

interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Permite desligar o tooltip sem desmontar o gatilho (evita remontagem). */
  enabled?: boolean;
  className?: string;
}

export function Tooltip({
  label,
  children,
  side = 'top',
  enabled = true,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={200} open={enabled ? undefined : false}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={8}
          className={cn(
            'z-[99] rounded-lg bg-fg px-2.5 py-1.5 text-xs font-medium text-card shadow-float',
            'data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out',
            className,
          )}
        >
          {label}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
