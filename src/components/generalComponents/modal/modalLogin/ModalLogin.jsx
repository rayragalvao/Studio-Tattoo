import React, { useState, useEffect } from 'react';
import './modalLogin.css';
import { Modal } from '../Modal.jsx';
import { useAuth } from '../../../../contexts/AuthContext.jsx';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../../firebaseConfig.js";
import GoogleLogo from '../../../../assets/img/google.png'; 
import { Notificacao } from '../../notificacao/Notificacao.jsx';

export const ModalLogin = ({ isOpen, onClose, onSwitchToCadastro, transitionClass = "" }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    permanecerConectado: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
    if (!formData.email || formData.email.trim() === '') newErrors.email = 'Email é obrigatório';
    if (!formData.senha || formData.senha.trim() === '') newErrors.senha = 'Senha é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({ email: '', senha: '', permanecerConectado: false });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const response = await login({
        email: formData.email,
        senha: formData.senha,
        permanecerConectado: formData.permanecerConectado
      });

      console.log('Login realizado com sucesso:', response);
      mostrarNotificacao('sucesso', 'Login Realizado!', `Bem-vindo de volta, ${response.nome || response.email}!`);
      clearForm();
      
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.status === 401 || error.status === 404) {
        mostrarNotificacao('erro', 'Credenciais Inválidas', 'Email ou senha incorretos. Verifique seus dados.');
        setErrors({ email: 'Email ou senha incorretos', senha: 'Email ou senha incorretos' });
      } else if (error.status === 409) {
        mostrarNotificacao('erro', 'Conflito nos Dados', error.message || 'Conflito nos dados informados.');
        setErrors({ email: error.message || 'Conflito nos dados' });
      } else {
        mostrarNotificacao('erro', 'Erro no Login', error.message || 'Erro interno do servidor. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      login({ email: user.email, nome: user.displayName, uid: user.uid, permanecerConectado: true });

      console.log('Login Google realizado com sucesso:', user);
      mostrarNotificacao('sucesso', 'Login com Google Realizado!', `Bem-vindo, ${user.displayName || user.email}!`);
      clearForm();
      onClose();
    } catch (error) {
      console.error('Erro no login com Google:', error);
      mostrarNotificacao('erro', 'Erro no Login Google', 'Não foi possível realizar login com Google. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    clearForm();
    onClose();
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal} transitionClass={`${transitionClass} ${isClosing ? 'modal-closing' : ''}`} closeButtonColor="#dc3545">
        <div className="modal-login">
          <div className="modal-left-orange">
            <div className="welcome-text">
              <h2>Ainda não marcou presença no estúdio?</h2>
              <p>Cadastre-se e comece a planejar sua nova tattoo!</p>
              <button className="btn-fazer-cadastro" onClick={onSwitchToCadastro}>Fazer cadastro</button>
            </div>
          </div>

          <div className="modal-right-form">
            <form onSubmit={handleSubmit} className="login-form" noValidate>
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
                  <button type="button" className="password-toggle" onClick={togglePasswordVisibility} style={{ minWidth:'24px', minHeight:'24px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span className="material-symbols-outlined">
                      {showPassword ? (
                        'visibility_off'
                      ) : (
                        'visibility'
                      )}
                    </span>
                  </button>
                </div>
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

              <button type="submit" className="btn-entrar" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#fff',
                  border: '1px solid #dadce0',
                  color: '#3c4043',
                  fontWeight: 600,
                  fontSize: '12px',
                  padding: '8px 16px',
                  width: '100%',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '12px',
                  transition: 'background-color 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={e => Object.assign(e.currentTarget.style, { backgroundColor: '#f7f7f7', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' })}
                onMouseOut={e => Object.assign(e.currentTarget.style, { backgroundColor: '#fff', boxShadow: 'none' })}
              >
                <img 
                  src={GoogleLogo}
                  alt="Google logo" 
                  style={{ width: '18px', height: '18px' }} 
                />
                Entrar com Google
              </button>

              {/* <div className="forgot-password">
                <a href="#esqueci-senha">A tinta apagou na memória? Redefina sua senha</a>
              </div> */}
            </form>
          </div>
        </div>
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
