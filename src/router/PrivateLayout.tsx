import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { DashboardProvider } from '../components/Dashboard';
import { Header, MobileNav, PageSkeleton, Sidebar } from '../components/Layout';
import { GlobalDrawers } from './GlobalDrawers';

/*
 * Shell da área logada: sidebar e header fixos, só o <main> rola. A máscara
 * esmaece o conteúdo que sobe por baixo do header em vez de cortá-lo seco; os
 * 24px coincidem com o pt-6 do PageContainer, então com a página parada nada
 * some.
 */
export function PrivateLayout() {
  return (
    <DashboardProvider>
      <div className="app-backdrop flex h-dvh overflow-hidden">
        <a
          href="#conteudo"
          className="sr-only z-[100] rounded-xl bg-primary px-4 py-2 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Pular para o conteúdo
        </a>

        {/* p-4 pr-0: a sidebar "solta" das bordas da tela */}
        <div className="hidden p-4 pr-0 md:flex">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main
            id="conteudo"
            className="scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto mask-[linear-gradient(to_bottom,transparent,black_24px)]"
          >
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </div>

        <MobileNav />
        <GlobalDrawers />
      </div>
    </DashboardProvider>
  );
}
