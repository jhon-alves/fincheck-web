import { CreateTransferParams, UpdateTransferParams } from '../types/transfer-types';
import { httpClient } from './httpClient';

export const transfersServices = {
  createTransfer,
  updateTransfer,
  removeTransfer,
};

async function createTransfer(params: CreateTransferParams) {
  const { data } = await httpClient.post('transfers', params);
  return data;
}

async function updateTransfer({ id, ...params }: UpdateTransferParams) {
  const { data } = await httpClient.put(`transfers/${id}`, params);
  return data;
}

async function removeTransfer(transferId: string) {
  const { data } = await httpClient.delete(`transfers/${transferId}`);
  return data;
}
