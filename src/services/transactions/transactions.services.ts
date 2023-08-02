import { api } from '../../helpers';
import { MeResponse } from './types';

export const transactionsServices = {
	getUser
};

async function getUser() {
	const { data } = await api.get<MeResponse>('/users/me');
	return data;
}
