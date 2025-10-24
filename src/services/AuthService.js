import ApiService from './ApiService.js';
import AuthStorage from './AuthStorage.js';

class AuthService {
  static async login(credentials) {
    try {
      const response = await ApiService.post('/usuario/login', {
        email: credentials.email,
        senha: credentials.senha
      });

      if (response.token) {
        AuthStorage.saveToken(response.token);
        AuthStorage.saveUser(response);
        return response;
      }

      throw new Error('Token não recebido do servidor');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await ApiService.post('/usuario/cadastro', {
        nome: userData.nomeCompleto,
        email: userData.email,
        telefone: userData.telefone || '',
        senha: userData.senha,
        dtNasc: userData.dataNascimento ? new Date(userData.dataNascimento) : null,
        isAdmin: false
      });

      return response;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  static logout() {
    AuthStorage.clearAuth();
    window.location.reload();
  }

  static isAuthenticated() {
    return AuthStorage.isAuthenticated();
  }

  static getCurrentUser() {
    return AuthStorage.getUser();
  }

  static getToken() {
    return AuthStorage.getToken();
  }
}

export default AuthService;