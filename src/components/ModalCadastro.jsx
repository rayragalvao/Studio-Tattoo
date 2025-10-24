import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ModalCadastroConcluido from './ModalCadastroConcluido';
import { useAuth } from '../contexts/AuthContext.jsx';

const ModalCadastro = ({ isOpen, onClose, onSwitchToLogin, transitionClass = "" }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) {
      return '';
    } else if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'telefone') {
      processedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!hasNumbers) {
      return 'A senha deve conter pelo menos um número';
    }
    if (!hasSpecialChar) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
      return '';
    }
    
    const phonePattern = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    
    if (!phonePattern.test(phone)) {
      return 'Telefone deve estar no formato (11) 99999-9999';
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

    const phoneError = validatePhone(formData.telefone);
    if (phoneError) {
      newErrors.telefone = phoneError;
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
      telefone: '',
      senha: '',
      confirmacaoSenha: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      try {
        const response = await register({
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          telefone: formData.telefone,
          senha: formData.senha,
          dataNascimento: formData.dataNascimento
        });

        console.log('Cadastro realizado com sucesso:', response);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.status === 409) {
          if (error.message.includes('Email')) {
            setErrors({
              email: 'Este email já está em uso'
            });
          } else if (error.message.includes('Telefone')) {
            setErrors({
              telefone: 'Este telefone já está em uso'
            });
          } else {
            setErrors({
              geral: error.message || 'Dados já cadastrados'
            });
          }
        } else if (error.status === 400) {
          let errorMessage = 'Dados inválidos. Verifique:';
          const errorDetails = error.details || error.message || '';
          
          if (errorDetails.includes('nome') || errorDetails.includes('NotBlank')) {
            errorMessage += '\n• Nome completo é obrigatório';
          }
          if (errorDetails.includes('email') || errorDetails.includes('Email')) {
            errorMessage += '\n• Email deve ter formato válido';
          }
          if (errorDetails.includes('telefone') || errorDetails.includes('Pattern')) {
            errorMessage += '\n• Telefone deve estar no formato (11) 99999-9999';
          }
          if (errorDetails.includes('senha')) {
            errorMessage += '\n• Senha é obrigatória';
          }
          
          setErrors({
            geral: errorMessage
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
    setShowSuccessModal(false);
    clearForm();
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    clearForm();
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
              <label htmlFor="telefone">Telefone (Opcional)</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleInputChange}
                className={errors.telefone ? 'error' : ''}
                autoComplete="off"
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
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
                  style={{ 
                    minWidth: '24px', 
                    minHeight: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {showConfirmPassword ? (
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
              {errors.confirmacaoSenha && <span className="error-message">{errors.confirmacaoSenha}</span>}
            </div>

            {errors.geral && (
              <div className="error-message general-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {errors.geral}
              </div>
            )}

            <button type="submit" className="btn-cadastrar" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
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
      />
    </Modal>
  );
};

export default ModalCadastro;