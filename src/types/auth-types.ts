export type SigninParams = {
  email: string;
  password: string;
}

export type SigninResponse = {
  accessToken: string;
}

export type SignupParams = {
  name: string;
  email: string;
  password: string;
}

export type SignupResponse = {
  accessToken: string;
}
