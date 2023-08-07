import { useQuery } from '@tanstack/react-query';
import { categoriesServices } from '../services';

export function useCategories() {
	const { data } = useQuery({
		queryKey: ['categories'],
		queryFn: categoriesServices.findAllCategories
	});

	return {
		categories: data ?? []
	};
}
