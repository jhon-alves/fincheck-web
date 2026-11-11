import {
  CategoriesResponse,
  Category,
  CategoryParams,
  UpdateCategoryParams,
} from '../types/categories-types';
import { httpClient } from './httpClient';

export async function getCategories() {
  const { data } = await httpClient.get<CategoriesResponse>('categories');
  return data;
}

export const categoriesServices = {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,
};

async function createCategory(params: CategoryParams) {
  const { data } = await httpClient.post<Category>('categories', params);
  return data;
}

async function updateCategory({ id, ...params }: UpdateCategoryParams) {
  const { data } = await httpClient.put<Category>(`categories/${id}`, params);
  return data;
}

/** Com lançamentos, `moveToCategoryId` é obrigatório (mesmo tipo). */
async function removeCategory({ id, moveToCategoryId }: { id: string; moveToCategoryId?: string }) {
  await httpClient.delete(`categories/${id}`, {
    params: moveToCategoryId ? { moveToCategoryId } : undefined,
  });
}
