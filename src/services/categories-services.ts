import { CategoriesResponse } from "../types/categories-types";
import { httpClient } from "./httpClient";

export async function getCategories() {
  const { data } = await httpClient.get<CategoriesResponse>('categories');
  return data;
}
