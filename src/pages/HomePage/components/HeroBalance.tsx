import { Link } from 'react-router';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Money } from '../../../components/Shared';
import { useDashboard } from '../../../components/Dashboard';
import { useAuth } from '../../../hooks';

function greeting(hour: number) {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function HeroBalance({ totalBalance, isLoading }: { totalBalance: number; isLoading: boolean }) {
  const { user } = useAuth();
  const { areValuesVisible, toggleValueVisibility } = useDashboard();
  const firstName = user?.name.split(' ')[0];

  return (
    <section
      aria-label="Saldo total"
      className="relative flex h-full min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-ink-950 p-6 text-white shadow-soft dark:border-border"
    >
      {/* Brilhos lima: o acento da marca sobre o fundo escuro */}
      <span aria-hidden className="absolute -top-24 -right-16 size-64 rounded-full bg-primary/25 blur-3xl" />
      <span aria-hidden className="absolute -bottom-28 left-10 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <p className="text-sm text-white/70">
          {greeting(new Date().getHours())}
          {firstName ? `, ${firstName}` : ''}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
          Saldo total nas contas
          <button
            type="button"
            onClick={toggleValueVisibility}
            aria-label={areValuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
            className="grid size-8 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            {areValuesVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        {isLoading ? (
          <div className="mt-1 h-10 w-56 animate-pulse rounded-xl bg-white/10" />
        ) : (
          <Money
            value={totalBalance}
            className="block text-4xl font-semibold tracking-tight md:text-[44px]"
          />
        )}
      </div>

      <Link
        to="/contas"
        className="relative mt-6 flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-ink-950 transition hover:brightness-95"
      >
        Ver contas <ArrowRight size={15} />
      </Link>
    </section>
  );
}
