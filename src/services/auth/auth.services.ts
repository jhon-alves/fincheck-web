import { api } from '../../helpers';
import { SigninParams, SignupParams, SignupResponse } from './types';

export const authServices = {
  signin,
  signup
}

async function signin(params: SigninParams) {
  const { data } = await api.post<SignupResponse>('/auth/signin', params);
  return data;
}

async function signup(params: SignupParams) {
  const { data } = await api.post('/auth/signup', params);
  return data;
}
