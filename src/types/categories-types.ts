export type CategoryType = 'INCOME' | 'EXPENSE';

export type Category = {
  id: string;
  name: string;
  /** Chave do ícone: das padrão (`home`, `food`...) ou do set personalizado. */
  icon: string;
  type: CategoryType;
  /** Padrão (criada no cadastro): não pode ser editada nem excluída. */
  isDefault: boolean;
  /** Chave da paleta (`violet`, `blue`...). */
  color: string | null;
  createdAt: string;
  /** Total de lançamentos (todos os meses). */
  transactionsCount: number;
  /** Regras de recorrência que usam esta categoria. */
  recurringRulesCount: number;
};

export type CategoriesResponse = Array<Category>;

export type CategoryParams = {
  name: string;
  type: CategoryType;
  icon: string;
  color: string | null;
};

export type UpdateCategoryParams = CategoryParams & { id: string };
