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
        const rememberMe = credentials.permanecerConectado || false;
        
        console.log('Resposta do login (básica):', response);
        
        // Salvar token primeiro para poder fazer requisições autenticadas
        AuthStorage.saveToken(response.token, rememberMe);
        
        // Buscar dados completos do perfil
        const profileData = await this.fetchUserProfile(response.id);
        
        // Combinar dados do login com dados do perfil
        const normalizedUser = {
          ...response,
          telefone: profileData?.telefone || '',
          dataNascimento: profileData?.dataNascimento || ''
        };
        
        console.log('Usuário completo após buscar perfil:', normalizedUser);
        
        AuthStorage.saveUser(normalizedUser, rememberMe);
        return normalizedUser;
      }

      throw new Error('Token não recebido do servidor');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  static async loginWithGoogle(googleUser) {
    try {
      // Tenta fazer login com Google no backend
      const response = await ApiService.post('/usuario/login', {
        email: googleUser.email,
        senha: googleUser.uid // Usa UID do Google como "senha"
      });

      if (response.token) {
        // Salvar token primeiro
        AuthStorage.saveToken(response.token, true);
        
        // Buscar dados completos do perfil
        const profileData = await this.fetchUserProfile(response.id);
        
        // Combinar dados
        const normalizedUser = {
          ...response,
          telefone: profileData?.telefone || '',
          dataNascimento: profileData?.dataNascimento || ''
        };
        
        AuthStorage.saveUser(normalizedUser, true);
        return normalizedUser;
      }

      throw new Error('Token não recebido');
    } catch (backendError) {
      console.log('Backend não reconheceu Google login, usando fallback local');
      
      // Fallback: armazenar dados do Google localmente
      const userData = {
        id: googleUser.uid,
        email: googleUser.email,
        nome: googleUser.displayName,
        photoURL: googleUser.photoURL,
        telefone: '',
        dataNascimento: '',
        isAdmin: false,
        loginType: 'google'
      };
      
      AuthStorage.saveToken(`google_${googleUser.uid}`, true);
      AuthStorage.saveUser(userData, true);
      console.log('Usuário Google armazenado localmente:', userData);
      return userData;
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

  static async fetchUserProfile(userId) {
    try {
      const response = await ApiService.get(`/usuario/${userId}`);
      console.log('Dados completos do perfil do backend:', response);
      
      // Normalizar dados do perfil
      let dataNascimento = '';
      if (response.dtNasc) {
        try {
          const date = new Date(response.dtNasc);
          dataNascimento = date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Erro ao formatar data do perfil:', e);
          dataNascimento = response.dtNasc;
        }
      }
      
      return {
        ...response,
        telefone: response.telefone || '',
        dataNascimento: dataNascimento || response.dataNascimento || ''
      };
    } catch (error) {
      console.error('Erro ao buscar perfil completo:', error);
      return null;
    }
  }

  static async updateProfile(userId, userData) {
    try {
      const currentUser = AuthStorage.getUser();
      
      const response = await ApiService.patch(`/usuario/${userId}/perfil`, {
        nome: userData.nome,
        telefone: userData.telefone || '',
        dtNasc: userData.dataNascimento || null
      });

      // Normalizar dados atualizados
      const updatedUser = {
        ...currentUser,
        nome: response.nome || userData.nome,
        telefone: response.telefone || userData.telefone || '',
        dataNascimento: response.dtNasc || userData.dataNascimento || ''
      };
      
      const rememberMe = AuthStorage.getToken() !== null;
      AuthStorage.saveUser(updatedUser, rememberMe);
      
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}

export default AuthService;