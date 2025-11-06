import axios from 'axios';
import AuthStorage from './AuthStorage.js';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8080', // URL da sua API Spring Boot
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para requisições - adiciona token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    // Busca o token usando AuthStorage
    const token = AuthStorage.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas (opcional - para tratar erros globalmente)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na requisição:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;