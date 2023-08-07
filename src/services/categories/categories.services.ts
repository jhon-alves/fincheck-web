import { api } from '../../helpers';
import { CategoryResponse } from './types';

export const categoriesServices = {
	findAllCategories
};

async function findAllCategories() {
	const { data } = await api.get<CategoryResponse>('/categories');
	return data;
}

