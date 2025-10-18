import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ModalLoginConcluido from './ModalLoginConcluido';

const ModalLogin = ({ isOpen, onClose, onSwitchToCadastro, transitionClass = "" }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    permanecerConectado: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setShowPassword(false);
      setShowSuccessModal(false);
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
    
    if (showSuccessModal) {
      setShowSuccessModal(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do login:', formData);
      
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    clearForm();
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
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
                type="email"
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
                >
                  👁️
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

            <button type="submit" className="btn-entrar">
              Entrar
            </button>

            <div className="forgot-password">
              <a href="#esqueci-senha">A tinta apagou na memória? Redefina sua senha</a>
            </div>
          </form>
        </div>
      </div>

      <ModalLoginConcluido
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        emailUsuario={formData.email}
      />
    </Modal>
  );
};

export default ModalLogin;