import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Landmark, LogOut, Settings, Tags } from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import { ConfirmDialog } from './ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';

function initials(name?: string) {
  if (!name) return '··';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? '');
  return (first + last).toUpperCase();
}

export function UserMenu() {
  const { signout, user } = useAuth();
  const navigate = useNavigate();
  const [isConfirmingSignout, setIsConfirmingSignout] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            aria-label="Menu do usuário"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-sm font-semibold text-card transition-opacity outline-none hover:opacity-90 focus-visible:ring-4 focus-visible:ring-ring"
          >
            {initials(user?.name)}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-60">
          <DropdownMenu.Label>
            <span className="block truncate text-sm font-semibold text-fg">{user?.name}</span>
            <span className="block truncate text-xs text-muted">{user?.email}</span>
          </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => navigate('/contas')}>
            <Landmark size={16} className="text-muted" /> Contas
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => navigate('/categorias')}>
            <Tags size={16} className="text-muted" /> Categorias
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => navigate('/configuracoes')}>
            <Settings size={16} className="text-muted" /> Configurações
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item variant="danger" onSelect={() => setIsConfirmingSignout(true)}>
            <LogOut size={16} /> Sair
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <SignoutDialog
        open={isConfirmingSignout}
        onOpenChange={setIsConfirmingSignout}
        onConfirm={signout}
      />
    </>
  );
}

export function SignoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sair da conta?"
      description="Você vai precisar entrar de novo com seu e-mail e senha."
      confirmLabel="Sair"
      variant="neutral"
      icon="logout"
      onConfirm={onConfirm}
    />
  );
}
