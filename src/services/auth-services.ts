import { SigninParams, SigninResponse, SignupParams, SignupResponse } from "../types/auth-types";
import { httpClient } from "./httpClient";

export const authServices = {
  signin,
  signup
}

async function signin(params: SigninParams) {
  const { data } = await httpClient.post<SigninResponse>('auth/signin', params);
  return data;
}

async function signup(params: SignupParams) {
  const { data } = await httpClient.post<SignupResponse>('auth/signup', params);
  return data;
}
