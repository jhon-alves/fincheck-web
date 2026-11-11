# AGENTS.md — Fincheck Web

Guia para agentes de código (e pessoas) que vão mexer neste repositório. Leia antes de alterar qualquer coisa.

## O projeto

O Fincheck é um app de finanças pessoais: contas bancárias, cartões, categorias, lançamentos (à vista, parcelados e recorrentes), transferências, calendário e um dashboard com indicadores do mês.

São dois repositórios, normalmente lado a lado na mesma pasta:

| Repositório | Papel |
|---|---|
| `fincheck-web` (este) | Front-end em React + Vite |
| `fincheck-api` | API REST em Fastify + Prisma (PostgreSQL no Supabase). As regras de negócio e os endpoints estão no `README.md` e no `AGENTS.md` de lá |

O front só fala com a API (`VITE_API_URL`). Ele não acessa o banco nem usa `supabase-js`.

Toda a interface é em **português do Brasil**, com valores em **reais (BRL)** e datas formatadas com `date-fns` (`ptBR`).

## Stack

- Vite 8 · React 18 · TypeScript (estrito)
- Tailwind CSS v4: tokens em `src/index.css`, sem `tailwind.config.js`
- React Router 7 · TanStack React Query 5 · axios
- React Hook Form + Zod (`@hookform/resolvers`)
- Radix (dialog, dropdown-menu, popover, select, tooltip), `motion`, `lucide-react`, Recharts, `card-validator`, `react-hot-toast`
- Fonte Geist (`@fontsource-variable/geist`)

## Comandos

```bash
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000
npm run dev              # Vite (http://localhost:5173 por padrão)
npm run lint             # ESLint
npm run build            # tsc + vite build
npm run preview
```

Antes de dar uma tarefa por terminada: `npm run lint` (sem erros novos) e `npm run build` precisam passar.

Para ter dados, suba a `fincheck-api` e rode `npm run seed` lá (usuário demo descrito em `fincheck-api/prisma/seed.ts`). Use o seed só num banco de desenvolvimento.

## Estrutura

```
src/
  main.tsx, App.tsx       # providers (React Query, MotionConfig, Tooltip, Auth, Router, Toaster)
  index.css               # tokens de design (claro/escuro), animações e utilitários
  router/
    index.tsx             # rotas públicas (login/cadastro) e privadas, páginas com lazy()
    AuthGuard.tsx         # redireciona conforme o login
    PrivateLayout.tsx     # shell: Sidebar, Header, MobileNav e <Outlet />
    GlobalDrawers.tsx     # drawers e modais globais (lançamento, detalhe, contas)
  contexts/               # AuthContext / AuthProvider (token em localStorage '@token')
  components/
    Layout/               # Sidebar recolhível, Header, MonthSelector, MobileNav, PageContainer, navItems
    Shared/               # Button, Input, Select, Drawer, Modal, ConfirmDialog, Money, Tooltip...
    Icons/                # CategoryIcon, AccountTypeIcon, bandeiras, paleta de categorias, rótulos
    Cards/                # CardVisual (animado), MiniCard, CardFormDrawer, temas e número do cartão
    Categories/           # CategoryFormDrawer, pickers de ícone e cor, QuickCategoryForm, exclusão
    Transactions/         # TransactionRow, drawers de formulário e detalhe, escopo, badge e confirmação
    Dashboard/            # DashboardContext + modais de conta
  pages/
    LayoutPage/           # layout do login/cadastro
    LoginPage/, RegisterPage/
    HomePage/             # dashboard (KPIs, gráficos, cartões, fixos do mês, próximos 7 dias)
    StatementPage/        # extrato, com abas Lançamentos e Recorrentes (?aba=recorrentes)
    CalendarPage/, CardsPage/, AccountsPage/, CategoriesPage/, SettingsPage/
  hooks/                  # React Query (useTransactions, useCards, useRecurringRules...) e utilitários
  services/               # chamadas HTTP, uma por domínio (httpClient.ts = axios + Bearer)
  helpers/                # datas da API, moeda, erros da API, recorrência, cn, storage
  types/                  # tipos das respostas da API, um arquivo por domínio
  config/                 # constantes (meses) e chaves de localStorage
```

Rotas: `/` (Home), `/extrato`, `/calendario`, `/cartoes`, `/contas`, `/categorias`, `/configuracoes`, `/login`, `/register`.

## Como os dados fluem

1. `services/*-services.ts` chama a API pelo `httpClient` (axios com `baseURL = VITE_API_URL` e o header `Authorization: Bearer` lido de `localStorage['@token']`).
2. `hooks/use*.ts` envolve os services em `useQuery`/`useMutation`. **Todas as query keys ficam em `hooks/queryKeys.ts`.** A primeira posição é o domínio: invalidar `['transactions']` alcança todas as listas filtradas.
3. Depois de criar, editar, excluir ou confirmar lançamentos, chame `useInvalidateFinance()`. Ele invalida lançamentos, calendário, dashboard, cartões, contas, categorias e regras recorrentes, porque tudo depende dos lançamentos.
4. Listas que mudam com o mês (`useTransactions`, `useCalendar`, `useDashboardSummary`) usam `placeholderData: keepPreviousData`. Enquanto o mês novo carrega, a tela continua mostrando o anterior, e o `MonthSelector` mostra um spinner (`useIsFetching`).

Estado global de UI fica no `DashboardContext` (`components/Dashboard/DashboardContext`):

- modo privacidade (`areValuesVisible`);
- mês selecionado no header (`selectedMonth`, com `month` de 0 a 11), compartilhado entre as páginas;
- drawers globais de lançamento: `openNewTransaction`, `openEditTransaction(transaction, scope)` e `openTransactionDetail`;
- modais de conta bancária.

Use essas funções em vez de criar drawers locais de lançamento.

## Convenções

### Datas

- A API grava as datas às 12:00 UTC. Envie sempre `YYYY-MM-DD` com `toApiDate(date)` e leia com `fromApiDate(iso)` (`helpers/apiDate.ts`). Nunca use `new Date(iso)` direto para exibir: o fuso troca o dia.
- O mês segue o JavaScript: `0` = janeiro, `11` = dezembro.

### Dinheiro

- Exiba valores sempre com `<Money>` (BRL, algarismos tabulares e respeito ao modo privacidade).
- Nos formulários, use `InputCurrency` e converta com `currencyStringToNumber`.

### Visual

- Use **só tokens** do `index.css` (`bg-card`, `bg-surface`, `text-fg`, `text-muted`, `text-income-strong`, `bg-expense-soft`, `border-border`...). Nada de cor hex nos componentes, exceto dados salvos pelo usuário (cores de contas, gradientes em `components/Cards/cardThemes.ts`, paleta de categorias em `components/Icons/categoryPalette.ts`).
- Tema claro/escuro via `[data-theme='dark']` no `<html>` (`useTheme`, chave `fincheck:theme`). Teste as telas nos dois temas.
- Camadas: conteúdo flutuante (Select, Popover, DropdownMenu, DatePicker) usa `z-[95]` e o Tooltip `z-[99]`, para aparecerem acima de drawers, modais e do ConfirmDialog. Um Select novo dentro de um diálogo precisa seguir essa regra.
- Ícones: `lucide-react`. Categorias usam chaves (`food`, `home`, `paw-print`...) mapeadas em `CategoryIcon`, e a cor é uma chave da paleta (`violet`, `amber`...).
- Animações com `motion`, curtas. O `MotionConfig reducedMotion="user"` no `App.tsx` já respeita o `prefers-reduced-motion`.
- Layout responsivo: sidebar no desktop, `MobileNav` no celular. Confira as páginas em ~375 px.

### Formulários

- React Hook Form + Zod. Para observar campos, use `useWatch({ name })` em vez de `form.watch()` (o lint reclama e re-renderiza demais).
- Mensagens de erro da API: `apiErrorMessage(error, fallback)` em `helpers/apiError.ts`, exibidas com `toast.error`.
- Lançamento parcelado ou recorrente: editar ou excluir abre o `InstallmentScopeDialog` ("só esta", "esta e as próximas", "todas") e envia `?scope=` para a API.

### Cartões (segurança)

O número completo do cartão existe **só no estado do formulário**, para detectar a bandeira com `card-validator`. Para a API vão apenas `lastDigits` e `brand`. Não existe campo de CVV, e nada disso pode ir para logs, `localStorage` ou analytics.

### Domínio

- **Saldo**: a API só soma lançamentos pagos e ignora compras no crédito. Lançamentos previstos (parcelas futuras, recorrentes) aparecem com o status "pendente" e o botão "Confirmar".
- **Parcelas**: o nome vem sem sufixo. O "3/10" é montado no front a partir de `installmentNumber`/`installmentsTotal`.
- **Recorrentes**: aparecem com o `RecurringBadge` (↻). A aba Recorrentes do extrato lista as regras, que não dependem do mês (por isso o seletor de mês some nessa aba).
- **Categorias padrão** (`isDefault`) não podem ser editadas nem excluídas. Excluir uma personalizada com lançamentos pede uma categoria de destino.

## Lint e TypeScript

- ESLint com `typescript-eslint`, `react-hooks` e `react-refresh`. Hoje há alguns avisos antigos de `react-refresh/only-export-components`; não crie erros novos.
- TypeScript estrito. Os tipos das respostas ficam em `src/types/` e precisam acompanhar a API: se um endpoint mudar, atualize o tipo e o service juntos.

## Git

- Branch padrão: `main`. Trabalhe em branches de feature.
- Mensagens de commit curtas, em inglês, minúsculas e no passado, uma por alteração. Exemplos do histórico: `added transfer accounts and paid status`, `fix bugs and adjusts components`.
- Não commite `.env`, `dist/` nem `node_modules/`.
