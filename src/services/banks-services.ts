import { BankAccountsResponse, CreateBankAccountParams, UpdateBankAccountParams } from "../types/bank-types";
import { httpClient } from "./httpClient";

export const banksServices = {
  getBanks,
  createBank,
  updateBank,
  removeBank
}

async function getBanks() {
  const { data } = await httpClient.get<BankAccountsResponse>('bank-accounts');
  return data;
}

async function createBank(params: CreateBankAccountParams) {
  const { data } = await httpClient.post('bank-accounts', params);
  return data;
}

async function updateBank({ id, ...params }: UpdateBankAccountParams) {
  const { data } = await httpClient.put(`bank-accounts/${id}`, params);
  return data;
}

async function removeBank(bankAccountId: string) {
  const { data } = await httpClient.delete(`bank-accounts/${bankAccountId}`);
  return data;
}
