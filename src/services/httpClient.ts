import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'http://localhost:3000',
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('@token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
