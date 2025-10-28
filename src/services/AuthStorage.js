class AuthStorage {
  static TOKEN_KEY = 'auth_token';
  static USER_KEY = 'user_data';
  static REMEMBER_KEY = 'remember_me';
  static TIMESTAMP_KEY = 'auth_timestamp';

  static saveToken(token, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    const timestamp = new Date().getTime();
    
    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.TIMESTAMP_KEY, timestamp.toString());
    
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, 'true');
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  static saveUser(userData, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  static getUser() {
    const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static getRememberMe() {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  static clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    localStorage.removeItem(this.TIMESTAMP_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.TIMESTAMP_KEY);
  }
}

export default AuthStorage;