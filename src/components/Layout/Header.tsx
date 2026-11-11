import { useLocation } from 'react-router';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';
import { Button, IconButton, LogoMark, Tooltip, UserMenu } from '../Shared';
import { MonthSelector } from './MonthSelector';
import { findNavItem } from './navItems';

export function Header() {
  const { pathname, search } = useLocation();
  const { areValuesVisible, toggleValueVisibility, openNewTransaction } = useDashboard();
  const page = findNavItem(pathname);
  const title = page.title ?? page.label;
  // Na aba "Recorrentes" do extrato as regras não dependem do mês.
  const showMonth =
    page.usesMonth &&
    !(pathname.startsWith('/extrato') && new URLSearchParams(search).get('aba') === 'recorrentes');

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-3 px-4 pt-4 md:px-6 md:pt-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <LogoMark className="size-9 md:hidden" />
        <div className="min-w-0">
          <nav aria-label="Você está em" className="hidden text-xs text-muted sm:block">
            Fincheck <span aria-hidden>/</span> {page.label}
          </nav>
          <h1 className="truncate text-lg font-semibold tracking-tight text-fg md:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showMonth && <MonthSelector className="hidden sm:flex" />}

        <Tooltip label={areValuesVisible ? 'Ocultar valores' : 'Mostrar valores'}>
          <IconButton
            variant="card"
            onClick={toggleValueVisibility}
            aria-label={areValuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
            aria-pressed={!areValuesVisible}
          >
            {areValuesVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </IconButton>
        </Tooltip>

        <Button className="hidden md:inline-flex" onClick={() => openNewTransaction()}>
          <Plus size={18} strokeWidth={2.4} />
          Novo lançamento
        </Button>

        <UserMenu />
      </div>

      {showMonth && <MonthSelector className="w-full sm:hidden" />}
    </header>
  );
}
