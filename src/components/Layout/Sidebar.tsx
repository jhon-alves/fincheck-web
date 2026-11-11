import { useState } from 'react';
import { NavLink } from 'react-router';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../../helpers';
import { useAuth } from '../../hooks';
import { LogoMark, SignoutDialog, Tooltip } from '../Shared';
import { mainNavItems, settingsNavItem, type NavItem } from './navItems';
import { useSidebarCollapsed } from './useSidebarCollapsed';

/*
 * Ao recolher, nada muda de posição: os itens mantêm padding e alinhamento,
 * os ícones ficam ancorados à esquerda e só os rótulos encolhem (largura,
 * margem e opacidade) junto com a sidebar. Montar/desmontar o texto ou trocar
 * para `justify-center` é o que faz o menu "sambar" durante a animação.
 */
const LABEL_TRANSITION =
  'overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-out motion-reduce:transition-none';

const labelState = (isCollapsed: boolean) =>
  isCollapsed ? 'max-w-0 opacity-0' : 'ml-3 max-w-44 opacity-100';

const ITEM_CLASS =
  'flex h-11 w-full shrink-0 items-center justify-start rounded-2xl px-3.5 text-sm font-medium outline-none focus-visible:ring-4 focus-visible:ring-ring';

function SidebarLink({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const Icon = item.icon;

  // className em string (e não função): o Slot do tooltip concatena classes e
  // transformaria a função do NavLink em texto. O estado ativo vem do
  // aria-current="page" que o NavLink já coloca.
  return (
    <Tooltip label={item.label} side="right" enabled={isCollapsed}>
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={cn(
          ITEM_CLASS,
          'group text-fg-soft transition-colors duration-200 hover:bg-subtle hover:text-fg',
          // Fundo lima suave + texto forte: contraste de ~17:1
          'aria-[current=page]:bg-primary-soft aria-[current=page]:font-semibold aria-[current=page]:text-fg',
        )}
      >
        <Icon
          size={19}
          aria-hidden
          className="shrink-0 stroke-[1.8] group-aria-[current=page]:stroke-[2.2] group-aria-[current=page]:text-primary-strong dark:group-aria-[current=page]:text-primary"
        />
        <span className={cn(LABEL_TRANSITION, labelState(isCollapsed))}>{item.label}</span>
      </NavLink>
    </Tooltip>
  );
}

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarCollapsed();
  const { signout } = useAuth();
  const [isConfirmingSignout, setIsConfirmingSignout] = useState(false);

  return (
    <aside
      aria-label="Menu lateral"
      className={cn(
        'surface-glass flex shrink-0 flex-col rounded-3xl',
        'transition-[width] duration-300 ease-out motion-reduce:transition-none',
        isCollapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-between overflow-x-hidden overflow-y-auto p-3">
        <div className="flex flex-col gap-1">
          <div className="mb-5 flex h-12 items-center pl-1">
            <LogoMark />
            <span
              className={cn(
                LABEL_TRANSITION,
                labelState(isCollapsed),
                'text-lg font-semibold tracking-tight text-fg',
              )}
            >
              Fincheck
            </span>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Menu principal">
            {mainNavItems.map((item) => (
              <SidebarLink key={item.to} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-1">
          <SidebarLink item={settingsNavItem} isCollapsed={isCollapsed} />

          <Tooltip label="Sair" side="right" enabled={isCollapsed}>
            <button
              type="button"
              onClick={() => setIsConfirmingSignout(true)}
              className={cn(
                ITEM_CLASS,
                'text-fg-soft transition-colors hover:bg-expense-soft hover:text-expense-strong',
              )}
            >
              <LogOut size={19} strokeWidth={1.8} aria-hidden className="shrink-0" />
              <span className={cn(LABEL_TRANSITION, labelState(isCollapsed))}>Sair</span>
            </button>
          </Tooltip>

          <div className="my-2 h-px bg-border" />

          <Tooltip label="Expandir menu" side="right" enabled={isCollapsed}>
            <button
              type="button"
              onClick={toggle}
              aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
              aria-expanded={!isCollapsed}
              className={cn(
                ITEM_CLASS,
                'text-muted transition-colors hover:bg-subtle hover:text-fg',
              )}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={19} strokeWidth={1.8} aria-hidden className="shrink-0" />
              ) : (
                <PanelLeftClose size={19} strokeWidth={1.8} aria-hidden className="shrink-0" />
              )}
              <span className={cn(LABEL_TRANSITION, labelState(isCollapsed))}>
                Recolher menu
              </span>
            </button>
          </Tooltip>
        </div>
      </div>

      <SignoutDialog
        open={isConfirmingSignout}
        onOpenChange={setIsConfirmingSignout}
        onConfirm={signout}
      />
    </aside>
  );
}
