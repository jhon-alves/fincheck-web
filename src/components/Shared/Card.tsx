import { ComponentProps } from 'react';
import { cn } from '../../helpers';

/** Superfície padrão de conteúdo (raio 16px, borda sutil, sombra suave). */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-card shadow-soft', className)}
      {...props}
    />
  );
}
