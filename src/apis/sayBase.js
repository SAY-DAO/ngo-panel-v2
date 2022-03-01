import axios from 'axios';
import i18next from 'i18next';
import { apiUrl, apiUrl3, baseUrl } from '../env';

export const publicApi = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: '',
    'Access-Control-Allow-Origin': baseUrl,
    'Cache-Control': 'no-cache',
  },
});

export const publicApi3 = axios.create({
  baseURL: apiUrl3,
});

const getLanguage = () => i18next.language || window.localStorage.i18nextLng;

publicApi.interceptors.request.use((configuration) => {
  // To pass language to backend
  const config = {
    ...configuration,
    params: {
      _lang: getLanguage(),
      ...configuration.params,
    },
  };
  return config;
});

publicApi3.interceptors.request.use((configuration) => {
  // To pass language to backend
  const config = {
    ...configuration,
    params: {
      _lang: getLanguage(),
      ...configuration.params,
    },
  };
  return config;
});
