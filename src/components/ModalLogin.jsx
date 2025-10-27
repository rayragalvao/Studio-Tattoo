import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ModalLoginConcluido from './ModalLoginConcluido';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../FirebaseConfig.js";

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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado com Google:", user);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro no login com Google:", error);
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
            <div className="form-groupL">
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

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-google"
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                color: "#000",
                padding: "15px 90px",
                borderRadius: "10px",
                border: "1px solid #5a1414",
                cursor: "pointer",
                fontWeight: "500",
                gap: "10px",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.9-1.6-37-4.7-54.7H272v103.6h146.9c-6.3 33.9-25.2 62.8-53.9 82l87 67.3c50.7-46.7 80.5-115.8 80.5-198.2z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c72.6 0 133.5-24 178-65.4l-87-67.3c-24.1 16.2-55 25.8-91 25.8-69.9 0-129.2-47.2-150.4-110.6l-88.1 68.1c43.7 86.4 133.8 149.4 238.5 149.4z"
                  fill="#34A853"
                />
                <path
                  d="M121.5 323.8c-10.3-30.3-10.3-63.7 0-94l-88.1-68.1c-38.8 76.2-38.8 166.3 0 242.5l88.1-80.4z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.7c37.4-.6 72.6 13.5 99.7 39.7l74.5-74.5C403.1 24.6 342.1 0 272 0 167.3 0 77.2 63 33.5 149.4l88.1 68.1c21.2-63.4 80.5-110.6 150.4-109.8z"
                  fill="#EA4335"
                />
              </svg>
              Entrar com Google
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
