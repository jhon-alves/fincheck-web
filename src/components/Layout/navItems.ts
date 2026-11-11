import {
  CalendarDays,
  CreditCard,
  House,
  Landmark,
  ReceiptText,
  Settings,
  Tags,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Título no header (quando diferente do rótulo do menu). */
  title?: string;
  description?: string;
  /** Mostra o seletor de mês no header. */
  usesMonth?: boolean;
};

export const mainNavItems: NavItem[] = [
  {
    to: '/',
    label: 'Início',
    icon: House,
    title: 'Visão geral',
    description: 'Seu mês num relance',
    usesMonth: true,
  },
  {
    to: '/extrato',
    label: 'Extrato',
    icon: ReceiptText,
    description: 'Todos os lançamentos do mês',
    usesMonth: true,
  },
  {
    to: '/calendario',
    label: 'Calendário',
    icon: CalendarDays,
    description: 'O que entrou e saiu em cada dia',
    usesMonth: true,
  },
  {
    to: '/cartoes',
    label: 'Cartões',
    icon: CreditCard,
    description: 'Limites, faturas e lançamentos',
    usesMonth: true,
  },
  {
    to: '/contas',
    label: 'Contas',
    icon: Landmark,
    description: 'Saldos das suas contas',
  },
  {
    to: '/categorias',
    label: 'Categorias',
    icon: Tags,
    description: 'Para onde vai o seu dinheiro',
    usesMonth: true,
  },
];

export const settingsNavItem: NavItem = {
  to: '/configuracoes',
  label: 'Configurações',
  icon: Settings,
  description: 'Aparência e preferências',
};

export const allNavItems = [...mainNavItems, settingsNavItem];

export function findNavItem(pathname: string) {
  return (
    allNavItems.find((item) =>
      item.to === '/' ? pathname === '/' : pathname.startsWith(item.to),
    ) ?? mainNavItems[0]
  );
}
