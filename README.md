# Fincheck Web

Front-end do Fincheck: dashboard de finanças pessoais com contas, cartões, extrato, calendário, categorias e lançamentos parcelados e recorrentes.

A API fica no repositório [`fincheck-api`](https://github.com/jhon-alves/fincheck-api). Para arquitetura, convenções e cuidados ao alterar o código, veja o [`AGENTS.md`](AGENTS.md).

## Stack

Vite · React 18 · TypeScript · Tailwind CSS v4 (tokens em `src/index.css`) · React Router 7 · React Query 5 · React Hook Form + Zod · Radix (dialog, dropdown, popover, select, tooltip) · motion · lucide-react · Recharts · date-fns · card-validator · react-hot-toast.

## Rodando

1. Suba a [`fincheck-api`](https://github.com/jhon-alves/fincheck-api) (padrão `http://localhost:3000`).
2. Configure e rode o front:

   ```bash
   npm install
   cp .env.example .env   # VITE_API_URL=http://localhost:3000
   npm run dev            # http://localhost:5173
   ```

Outros scripts:

```bash
npm run lint
npm run build      # tsc + vite build
npm run preview
```

Para ter dados de exemplo, rode `npm run seed` na API (só em banco de desenvolvimento) e entre com o usuário demo descrito em `fincheck-api/prisma/seed.ts`.

## Telas

| Rota | Tela |
|---|---|
| `/login`, `/register` | Login e cadastro |
| `/` | Home: saldo, entradas, saídas, economia, faturas abertas, gastos por categoria, evolução de 6 meses, cartões, fixos do mês, próximos 7 dias e últimos lançamentos |
| `/extrato` | Extrato do mês com filtros, agrupado por dia. A aba Recorrentes (`/extrato?aba=recorrentes`) lista as regras |
| `/calendario` | Calendário do mês com totais por dia, parcelas e recorrentes |
| `/cartoes` | Cartões de crédito e débito, com o limite usado e os lançamentos de cada cartão |
| `/contas` | Contas bancárias e saldos |
| `/categorias` | Categorias padrão e personalizadas (ícone e cor) |
| `/configuracoes` | Dados da conta, tema (claro, escuro ou do sistema) e modo privacidade |

Novo lançamento, edição e detalhe abrem em drawers globais, a partir de qualquer tela.

## Organização

```
src/
  index.css             # tokens de design (claro e escuro) e utilitários
  router/               # rotas, AuthGuard, PrivateLayout (shell) e drawers globais
  contexts/             # autenticação
  components/
    Layout/             # Sidebar recolhível, Header, seletor de mês, navegação mobile
    Shared/             # Drawer, Button, Input, Select, Money, SegmentedControl...
    Icons/              # ícones de categoria e de conta, bandeiras, paleta de cores
    Cards/              # cartão animado, detecção de bandeira, formulário de cartão
    Categories/         # formulário, pickers de ícone e cor, exclusão com mover lançamentos
    Transactions/       # linha do extrato, drawers de detalhe e de formulário, escopo
    Dashboard/          # DashboardContext (privacidade, mês, drawers globais)
  pages/                # Home, Extrato, Calendário, Cartões, Contas, Categorias, Configurações
  hooks/                # React Query (query keys em hooks/queryKeys.ts)
  services/             # chamadas HTTP (axios)
  helpers/              # datas da API, moeda, erros, recorrência, storage
  types/                # tipos das respostas da API
```

## Convenções

- **Datas**: o front envia `YYYY-MM-DD` (`toApiDate`) e exibe a parte da data do ISO da API (`fromApiDate`), então o fuso nunca troca o dia.
- **Dinheiro**: sempre pelo componente `<Money>` (BRL, algarismos tabulares e modo privacidade).
- **Cores**: só tokens (`bg-card`, `text-muted`, `text-expense-strong`...). Nada de hex nos componentes, exceto dados salvos pelo usuário (cores de contas, gradientes de cartão em `components/Cards/cardThemes.ts` e a paleta de categorias).
- **Cartões**: o número completo existe só no estado do formulário, para detectar a bandeira; para a API vão apenas os 4 últimos dígitos e a bandeira. Não há campo de CVV.
- **Lançamentos parcelados e recorrentes**: editar ou excluir pergunta o escopo ("só esta", "esta e as próximas", "todas"). Os previstos aparecem como pendentes, com o botão "Confirmar".
- **Tema**: claro, escuro ou do sistema em Configurações (`fincheck:theme` no localStorage).
