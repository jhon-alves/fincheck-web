export interface SigninParams {
  email: string,
  password: string
}

export interface SignupParams {
  name: string,
  email: string,
  password: string
}

export interface SignupResponse {
  accessToken: string
}
