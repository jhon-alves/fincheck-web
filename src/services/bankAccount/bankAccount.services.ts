import { api } from '../../helpers';
import { BankAccountParams, AccountsResponse, UpdateAccountParams } from './types';

export const bankAccountServices = {
	createAccount,
	findAllAccounts,
	updateAccount,
	deleteAccount
};

async function createAccount(params: BankAccountParams) {
	const { data } = await api.post('/bank-accounts', params);
	return data;
}

async function findAllAccounts() {
	const { data } = await api.get<AccountsResponse>('/bank-accounts');
	return data;
}

async function updateAccount({ id, ...params }: UpdateAccountParams) {
	const { data } = await api.put(`/bank-accounts/${id}`, params);
	return data;
}

async function deleteAccount(id: string) {
	const { data } = await api.delete(`/bank-accounts/${id}`);
	return data;
}
