import { MeResponse } from '../types/me-types';
import { httpClient } from './httpClient';

export async function me() {
  const { data } = await httpClient.get<MeResponse>('users/me');
  return data;
}
