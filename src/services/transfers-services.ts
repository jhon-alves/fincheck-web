import { CreateTransferParams } from '../types/transfer-types';
import { httpClient } from './httpClient';

export const transfersServices = {
  createTransfer,
  removeTransfer,
};

async function createTransfer(params: CreateTransferParams) {
  const { data } = await httpClient.post('transfers', params);
  return data;
}

async function removeTransfer(transferId: string) {
  const { data } = await httpClient.delete(`transfers/${transferId}`);
  return data;
}
