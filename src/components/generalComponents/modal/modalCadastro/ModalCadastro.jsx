import { Modal } from '../Modal.jsx';
import './modalCadastro.css';
import React, { useState, useEffect } from 'react';
import ModalCadastroConcluido from '../ModalCadastroConcluido.jsx';
import { Notificacao } from '../../notificacao/Notificacao.jsx';
import api from "../../../../services/api.js";

export const ModalCadastro = ({ isOpen, onClose, onSwitchToLogin, transitionClass = "" }) => {
  const url = "/usuario";
  
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
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [notificacao, setNotificacao] = useState({
    visivel: false,
    tipo: 'sucesso',
    titulo: '',
    mensagem: ''
  });

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowSuccessModal(false);
      setNotificacao({ visivel: false, tipo: 'sucesso', titulo: '', mensagem: '' });
    }
  }, [isOpen]);

  const mostrarNotificacao = (tipo, titulo, mensagem) => {
    setNotificacao({
      visivel: true,
      tipo,
      titulo,
      mensagem
    });
  };

  const fecharNotificacao = () => {
    setNotificacao(prev => ({
      ...prev,
      visivel: false
    }));
  };

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
      return 'Telefone é obrigatório';
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

    if (!formData.telefone || formData.telefone.trim() === '') {
      newErrors.telefone = 'Telefone é obrigatório';
    } else {
      const phoneError = validatePhone(formData.telefone);
      if (phoneError) {
        newErrors.telefone = phoneError;
      }
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
        const userData = {
          nome: formData.nomeCompleto,
          email: formData.email,
          telefone: formData.telefone,
          senha: formData.senha,
          dtNasc: formData.dataNascimento
        };

        const response = await api.post(url + "/cadastro", userData);
        
        console.log('Cadastro realizado com sucesso:', response.data);
        mostrarNotificacao('sucesso', 'Cadastro Realizado!', 'Sua conta foi criada com sucesso. Bem-vindo!');
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Erro no cadastro:', error);
        
        // Tratar erros baseados na resposta da API
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 409) {
            if (data.message && data.message.includes('Email')) {
              mostrarNotificacao('erro', 'Email já em uso', 'Este email já está cadastrado no sistema.');
              setErrors({ email: 'Este email já está em uso' });
            } else if (data.message && data.message.includes('Telefone')) {
              mostrarNotificacao('erro', 'Telefone já em uso', 'Este telefone já está cadastrado no sistema.');
              setErrors({ telefone: 'Este telefone já está em uso' });
            } else {
              mostrarNotificacao('erro', 'Dados já cadastrados', data.message || 'Os dados informados já estão em uso.');
            }
          } else if (status === 400) {
            const errorDetails = data.message || data.details || '';
            let errorMessage = 'Verifique os dados informados:';
            
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
            
            mostrarNotificacao('erro', 'Dados Inválidos', errorMessage);
          } else {
            mostrarNotificacao('erro', 'Erro no Cadastro', data.message || 'Erro interno do servidor. Tente novamente.');
          }
        } else if (error.request) {
          // Erro de rede
          mostrarNotificacao('erro', 'Erro de Conexão', 'Verifique sua internet e tente novamente.');
        } else {
          // Outros erros
          mostrarNotificacao('erro', 'Erro Inesperado', 'Algo deu errado. Tente novamente.');
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

  const handlePasswordFocus = () => {
    setShowPasswordTooltip(true);
  };

  const handlePasswordBlur = (e) => {
    if (!e.relatedTarget?.closest('.password-tooltip')) {
      setTimeout(() => setShowPasswordTooltip(false), 150);
    }
  };

  const handleTooltipMouseEnter = () => {
    setShowPasswordTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    setShowPasswordTooltip(false);
  };

  const getPasswordCriteria = (password) => {
    return {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal} transitionClass={transitionClass} closeButtonColor="#ffffff">
        <div className="modal-cadastro">
        <div className="modal-left-form">
          <form onSubmit={handleSubmit} className="cadastro-form" noValidate>
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
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleInputChange}
                className={errors.telefone ? 'error' : ''}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <div className="password-input-container">
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
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
                    <span class="material-symbols-outlined">
                      {showPassword ? (
                        'visibility_off'
                      ) : (
                        'visibility'
                      )}
                    </span>
                  </button>
                </div>
                
                {showPasswordTooltip && (
                  <div 
                    className="password-tooltip"
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  >
                    <h4>Critérios para uma senha válida:</h4>
                    <ul>
                      {(() => {
                        const criteria = getPasswordCriteria(formData.senha);
                        return (
                          <>
                            <li className={criteria.minLength ? 'valid' : 'invalid'}>
                              <span className="icon">{criteria.minLength ? '✓' : '×'}</span>
                              Pelo menos 6 caracteres
                            </li>
                            <li className={criteria.hasNumber ? 'valid' : 'invalid'}>
                              <span className="icon">{criteria.hasNumber ? '✓' : '×'}</span>
                              Pelo menos um número (0-9)
                            </li>
                            <li className={criteria.hasSpecialChar ? 'valid' : 'invalid'}>
                              <span className="icon">{criteria.hasSpecialChar ? '✓' : '×'}</span>
                              Pelo menos um caractere especial (!@#$%^&*(),.?":{}|&lt;&gt;)
                            </li>
                          </>
                        );
                      })()}
                    </ul>
                  </div>
                )}
              </div>
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
                  <span class="material-symbols-outlined">
                      {showConfirmPassword ? (
                        'visibility_off'
                      ) : (
                        'visibility'
                      )}
                    </span>
                </button>
              </div>
            </div>

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
      
      <Notificacao
        tipo={notificacao.tipo}
        titulo={notificacao.titulo}
        mensagem={notificacao.mensagem}
        visivel={notificacao.visivel}
        onFechar={fecharNotificacao}
        duracao={5000}
        posicao={1}
      />
    </>
  );
};

export default ModalCadastro;