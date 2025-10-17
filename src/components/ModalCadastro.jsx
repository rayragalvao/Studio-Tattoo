import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ModalCadastroConcluido from './ModalCadastroConcluido';

const ModalCadastro = ({ isOpen, onClose, onSwitchToLogin, transitionClass = "" }) => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const validatePassword = (password) => {
    const minLength = 6;
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }
    if (!hasNumbers) {
      return 'A senha deve conter pelo menos um número';
    }
    if (!hasSpecialChar) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    } else if (formData.nomeCompleto.trim().split(' ').length < 2) {
      newErrors.nomeCompleto = 'Digite seu nome completo';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dataNascimento = 'Você deve ter pelo menos 18 anos';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Digite um email válido';
    }

    const passwordError = validatePassword(formData.senha);
    if (passwordError) {
      newErrors.senha = passwordError;
    }

    if (!formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      nomeCompleto: '',
      dataNascimento: '',
      email: '',
      senha: '',
      confirmacaoSenha: ''
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do cadastro:', formData);
      
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
    onSwitchToLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} transitionClass={transitionClass}>
      <div className="modal-cadastro">
        <div className="modal-left-form">
          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nomeCompleto">Nome completo</label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                placeholder="Digite seu nome completo"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                className={errors.nomeCompleto ? 'error' : ''}
                autoComplete="off"
                required
              />
              {errors.nomeCompleto && <span className="error-message">{errors.nomeCompleto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dataNascimento">Data de nascimento</label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className={errors.dataNascimento ? 'error' : ''}
                autoComplete="off"
                required
              />
              {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmacaoSenha">Confirmação de senha</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmacaoSenha"
                  name="confirmacaoSenha"
                  placeholder="Digite sua senha"
                  value={formData.confirmacaoSenha}
                  onChange={handleInputChange}
                  className={errors.confirmacaoSenha ? 'error' : ''}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  👁️
                </button>
              </div>
              {errors.confirmacaoSenha && <span className="error-message">{errors.confirmacaoSenha}</span>}
            </div>

            <button type="submit" className="btn-cadastrar">
              Cadastrar
            </button>
          </form>
        </div>

        <div className="modal-right-orange">
          <div className="welcome-text">
            <h2>Já eternizou seu estilo com a gente?</h2>
            <p>Entre agora e planeje sua nova tattoo</p>
            <button 
              className="btn-fazer-login"
              onClick={onSwitchToLogin}
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>

      <ModalCadastroConcluido
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        nomeUsuario={formData.nomeCompleto.split(' ')[0] || 'usuário'}
      />
    </Modal>
  );
};

export default ModalCadastro;