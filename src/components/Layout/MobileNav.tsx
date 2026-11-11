import { NavLink } from 'react-router';
import { Plus } from 'lucide-react';
import { useDashboard } from '../Dashboard/DashboardContext/useDashboard';
import { mainNavItems } from './navItems';

/*
 * Celular: bottom navigation com 4 itens e o "+" central. Contas, Categorias,
 * Configurações e Sair ficam no menu do avatar, no header.
 */
const [home, statement, calendar, cards] = mainNavItems;
const left = [home, statement];
const right = [calendar, cards];

function MobileNavLink({ item }: { item: (typeof mainNavItems)[number] }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className="group flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-medium text-muted transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring aria-[current=page]:text-fg"
    >
      <span className="grid h-7 w-12 place-items-center rounded-full transition-colors group-aria-[current=page]:bg-primary-soft">
        <Icon
          size={19}
          aria-hidden
          className="stroke-[1.8] group-aria-[current=page]:stroke-[2.2] group-aria-[current=page]:text-primary-strong dark:group-aria-[current=page]:text-primary"
        />
      </span>
      {item.label}
    </NavLink>
  );
}

export function MobileNav() {
  const { openNewTransaction } = useDashboard();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 md:hidden"
    >
      <div className="surface-glass flex items-center gap-1 rounded-3xl px-2">
        {left.map((item) => (
          <MobileNavLink key={item.to} item={item} />
        ))}

        <div className="flex w-16 shrink-0 justify-center">
          <button
            type="button"
            onClick={() => openNewTransaction()}
            aria-label="Novo lançamento"
            className="-mt-7 grid size-14 place-items-center rounded-full bg-primary text-on-primary shadow-float ring-4 ring-surface transition-transform active:scale-95 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Plus size={26} strokeWidth={2.4} />
          </button>
        </div>

        {right.map((item) => (
          <MobileNavLink key={item.to} item={item} />
        ))}
      </div>
    </nav>
  );
}
