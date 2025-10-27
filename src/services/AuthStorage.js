class AuthStorage {
  static TOKEN_KEY = 'auth_token';
  static USER_KEY = 'user_data';

  static saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static saveUser(userData) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  static getUser() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export default AuthStorage;