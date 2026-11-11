import {
  BadgeDollarSign,
  Baby,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Cake,
  CarTaxiFront,
  Car,
  Coffee,
  Coins,
  Droplets,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  Hammer,
  HandCoins,
  HandHeart,
  HeartPulse,
  Landmark,
  Map as MapIcon,
  Monitor,
  Music,
  PawPrint,
  Percent,
  PiggyBank,
  Pill,
  Pizza,
  Receipt,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Store,
  Tag,
  Ticket,
  TrainFront,
  TreePalm,
  TrendingUp,
  Tv,
  Users,
  Wallet,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/*
 * Ícones e cores das categorias personalizadas. A chave (string) é o que vai
 * para o banco, nos campos `icon` e `color`. As cores apontam para tokens
 * (--cat-*) definidos em index.css, com versões para o tema escuro.
 */

export type CategoryIconOption = {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Termos extras para a busca do seletor. */
  keywords?: string;
};

export const CUSTOM_CATEGORY_ICONS: CategoryIconOption[] = [
  { key: 'paw-print', label: 'Pet', icon: PawPrint, keywords: 'cachorro gato animal' },
  { key: 'heart-pulse', label: 'Saúde', icon: HeartPulse, keywords: 'plano hospital' },
  { key: 'pill', label: 'Farmácia', icon: Pill, keywords: 'remédio' },
  { key: 'stethoscope', label: 'Médico', icon: Stethoscope, keywords: 'consulta dentista' },
  { key: 'dumbbell', label: 'Academia', icon: Dumbbell, keywords: 'treino esporte' },
  { key: 'gift', label: 'Presente', icon: Gift, keywords: 'aniversário' },
  { key: 'cake', label: 'Festa', icon: Cake, keywords: 'aniversário comemoração' },
  { key: 'tv', label: 'Streaming', icon: Tv, keywords: 'netflix assinatura' },
  { key: 'music', label: 'Música', icon: Music, keywords: 'spotify show' },
  { key: 'film', label: 'Cinema', icon: Film, keywords: 'filme' },
  { key: 'gamepad-2', label: 'Jogos', icon: Gamepad2, keywords: 'games videogame' },
  { key: 'ticket', label: 'Eventos', icon: Ticket, keywords: 'ingresso' },
  { key: 'trending-up', label: 'Investimento', icon: TrendingUp, keywords: 'ações renda' },
  { key: 'piggy-bank', label: 'Poupança', icon: PiggyBank, keywords: 'reserva' },
  { key: 'landmark', label: 'Banco', icon: Landmark, keywords: 'tarifa' },
  { key: 'percent', label: 'Impostos', icon: Percent, keywords: 'taxa juros' },
  { key: 'hand-coins', label: 'Empréstimo', icon: HandCoins, keywords: 'dívida' },
  { key: 'coins', label: 'Renda extra', icon: Coins, keywords: 'bico' },
  { key: 'badge-dollar-sign', label: 'Bônus', icon: BadgeDollarSign, keywords: 'prêmio plr' },
  { key: 'briefcase', label: 'Trabalho', icon: Briefcase, keywords: 'emprego' },
  { key: 'wallet', label: 'Carteira', icon: Wallet, keywords: 'dinheiro' },
  { key: 'baby', label: 'Filhos', icon: Baby, keywords: 'criança escola' },
  { key: 'users', label: 'Família', icon: Users, keywords: 'pais' },
  { key: 'hand-heart', label: 'Doações', icon: HandHeart, keywords: 'caridade dízimo' },
  { key: 'car', label: 'Carro', icon: Car, keywords: 'veículo ipva' },
  { key: 'fuel', label: 'Combustível', icon: Fuel, keywords: 'gasolina posto' },
  { key: 'car-taxi-front', label: 'Táxi e apps', icon: CarTaxiFront, keywords: 'uber 99' },
  { key: 'train-front', label: 'Metrô', icon: TrainFront, keywords: 'trem transporte' },
  { key: 'bike', label: 'Bicicleta', icon: Bike, keywords: 'bike' },
  { key: 'map', label: 'Passeio', icon: MapIcon, keywords: 'turismo' },
  { key: 'tree-palm', label: 'Férias', icon: TreePalm, keywords: 'praia viagem' },
  { key: 'smartphone', label: 'Celular', icon: Smartphone, keywords: 'telefone plano' },
  { key: 'wifi', label: 'Internet', icon: Wifi, keywords: 'banda larga' },
  { key: 'zap', label: 'Energia', icon: Zap, keywords: 'luz' },
  { key: 'droplets', label: 'Água', icon: Droplets, keywords: 'saneamento' },
  { key: 'receipt', label: 'Contas', icon: Receipt, keywords: 'boleto' },
  { key: 'shield-check', label: 'Seguro', icon: ShieldCheck, keywords: 'proteção' },
  { key: 'wrench', label: 'Manutenção', icon: Wrench, keywords: 'conserto' },
  { key: 'hammer', label: 'Reforma', icon: Hammer, keywords: 'obra' },
  { key: 'sofa', label: 'Móveis', icon: Sofa, keywords: 'decoração' },
  { key: 'monitor', label: 'Eletrônicos', icon: Monitor, keywords: 'computador' },
  { key: 'coffee', label: 'Café', icon: Coffee, keywords: 'padaria' },
  { key: 'pizza', label: 'Delivery', icon: Pizza, keywords: 'ifood lanche' },
  { key: 'beer', label: 'Bar', icon: Beer, keywords: 'bebida happy hour' },
  { key: 'shopping-bag', label: 'Compras', icon: ShoppingBag, keywords: 'loja shopping' },
  { key: 'store', label: 'Loja', icon: Store, keywords: 'comércio' },
  { key: 'scissors', label: 'Beleza', icon: Scissors, keywords: 'cabelo salão' },
  { key: 'sparkles', label: 'Cuidados', icon: Sparkles, keywords: 'estética skincare' },
  { key: 'book-open', label: 'Livros', icon: BookOpen, keywords: 'leitura curso' },
  { key: 'tag', label: 'Geral', icon: Tag, keywords: 'outros' },
];

export const customCategoryIcons: Record<string, LucideIcon> = Object.fromEntries(
  CUSTOM_CATEGORY_ICONS.map((option) => [option.key, option.icon]),
);

export const CATEGORY_COLORS = [
  { key: 'violet', label: 'Violeta' },
  { key: 'blue', label: 'Azul' },
  { key: 'cyan', label: 'Ciano' },
  { key: 'teal', label: 'Verde-água' },
  { key: 'green', label: 'Verde' },
  { key: 'lime', label: 'Lima' },
  { key: 'yellow', label: 'Amarelo' },
  { key: 'amber', label: 'Âmbar' },
  { key: 'orange', label: 'Laranja' },
  { key: 'red', label: 'Vermelho' },
  { key: 'pink', label: 'Rosa' },
  { key: 'slate', label: 'Cinza' },
] as const;

export const DEFAULT_CATEGORY_COLOR = 'violet';

/** `var(--cat-violet)` se a chave existir na paleta; senão `null`. */
export function categoryColorVar(color?: string | null) {
  if (!color || !CATEGORY_COLORS.some((item) => item.key === color)) return null;
  return `var(--cat-${color})`;
}
