export type Category = {
  id: string;
  name: string;
  icon: string;
  type: 'INCOME' | 'EXPENSE';
}

export type CategoriesResponse = Array<Category>;
