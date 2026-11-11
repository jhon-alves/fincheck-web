import { Outlet } from 'react-router';
import { CalendarDays, CreditCard, EyeOff, Layers } from 'lucide-react';
import { LogoMark } from '../../components';

const HIGHLIGHTS = [
  { label: 'Cartões e limites', icon: CreditCard },
  { label: 'Compras parceladas', icon: Layers },
  { label: 'Calendário do mês', icon: CalendarDays },
  { label: 'Modo privacidade', icon: EyeOff },
];

/*
 * Login e cadastro no estilo do Noou: à esquerda, um hero só de texto (logo,
 * slogan, subtítulo e chips) sobre o fundo escuro da marca; à direita, o
 * formulário centralizado. No celular o hero some e o logo vai para cima do
 * formulário.
 */
export function LayoutPage() {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:h-dvh lg:grid-cols-2">
      {/* No tema escuro o fundo do app também é ink-950: o hero sobe para a
          cor de card e ganha borda para não se fundir com o formulário */}
      <aside className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex xl:p-16 dark:border-r dark:border-border dark:bg-card">
        {/* Brilhos lima discretos: o acento da marca sobre o fundo escuro */}
        <span
          aria-hidden
          className="absolute -top-40 -right-32 size-[28rem] rounded-full bg-primary/20 blur-3xl"
        />
        <span
          aria-hidden
          className="absolute -bottom-48 -left-24 size-[24rem] rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative z-10 flex w-full flex-col justify-between gap-12">
          <div className="flex items-center gap-3">
            <LogoMark className="size-11" />
            <span className="text-xl font-semibold tracking-tight">Fincheck</span>
          </div>

          <div className="max-w-xl">
            <h1 className="text-5xl leading-[1.05] font-semibold tracking-tight xl:text-6xl">
              Suas finanças, <span className="text-primary">claras</span> como deveriam ser.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/70 xl:text-xl">
              Contas, cartões, parcelas e o calendário do mês num lugar só. Você lança, o
              Fincheck organiza.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3" aria-label="Destaques">
            {HIGHLIGHTS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90"
              >
                <Icon size={15} aria-hidden className="text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="app-backdrop flex min-h-0 justify-center overflow-y-auto px-6 py-10 sm:px-10">
        {/* my-auto (e não items-center no pai): centraliza quando cabe e, quando
            não cabe, o topo do formulário não some */}
        <div className="my-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight text-fg">Fincheck</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
