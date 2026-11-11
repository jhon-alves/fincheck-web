import { ComponentProps } from 'react';
import { cn } from '../../helpers';

/**
 * Área útil das páginas. O pt-6 coincide com a máscara de 24px do <main>, então
 * com a página parada nada some sob o header. No celular sobra espaço embaixo
 * para a bottom navigation.
 */
export function PageContainer({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1440px] px-4 pt-6 pb-32 md:px-6 md:pb-10',
        className,
      )}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <PageContainer aria-busy className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
        <div className="skeleton h-28" />
      </div>
      <div className="skeleton h-80" />
    </PageContainer>
  );
}
