import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext.jsx';

const ModalLogin = ({ isOpen, onClose, onSwitchToCadastro, transitionClass = "" }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    permanecerConectado: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email é obrigatório';
    }

    if (!formData.senha || formData.senha.trim() === '') {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      email: '',
      senha: '',
      permanecerConectado: false
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      try {
        const response = await login({
          email: formData.email,
          senha: formData.senha
        });

        console.log('Login realizado com sucesso:', response);

        clearForm();
        onClose();

      } catch (error) {
        console.error('Erro no login:', error);

        if (error.status === 401 || error.status === 404) {
          setErrors({
            email: 'Email ou senha incorretos',
            senha: 'Email ou senha incorretos'
          });
        } else if (error.status === 409) {
          setErrors({
            email: error.message || 'Conflito nos dados'
          });
        } else {
          setErrors({
            geral: error.message || 'Erro interno do servidor. Tente novamente.'
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    clearForm();
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} transitionClass={transitionClass}>
      <div className="modal-login">
        <div className="modal-left-orange">
          <div className="welcome-text">
            <h2>Ainda não marcou presença no estúdio?</h2>
            <p>Cadastre-se e comece a planejar sua nova tattoo!</p>
            <button 
              className="btn-fazer-cadastro"
              onClick={onSwitchToCadastro}
            >
              Fazer cadastro
            </button>
          </div>
        </div>

        <div className="modal-right-form">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                autoComplete="off"
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={errors.senha ? 'error' : ''}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  style={{
                    minWidth: '24px',
                    minHeight: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {showPassword ? (
                      <>
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.15C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </>
                    ) : (
                      <>
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.senha && <span className="error-message">{errors.senha}</span>}
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="permanecerConectado"
                name="permanecerConectado"
                checked={formData.permanecerConectado}
                onChange={handleInputChange}
              />
              <label htmlFor="permanecerConectado">Permanecer conectado?</label>
            </div>

            {errors.geral && (
              <div className="error-message general-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {errors.geral}
              </div>
            )}

            <button type="submit" className="btn-entrar" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="forgot-password">
              <a href="#esqueci-senha">A tinta apagou na memória? Redefina sua senha</a>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLogin;