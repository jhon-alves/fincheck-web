import { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../../components/Shared';
import { cn } from '../../../helpers';

interface HomeBlockProps {
  title: string;
  description?: string;
  link?: { to: string; label: string };
  className?: string;
  children: ReactNode;
}

/** Bloco do bento grid da Home: título, link opcional e conteúdo. */
export function HomeBlock({ title, description, link, className, children }: HomeBlockProps) {
  return (
    <Card className={cn('flex min-w-0 flex-col p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-fg">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        {link && (
          <Link
            to={link.to}
            className="flex shrink-0 items-center gap-1 rounded-lg text-xs font-semibold text-fg-soft hover:text-fg"
          >
            {link.label} <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}
