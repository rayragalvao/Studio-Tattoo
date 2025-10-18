import React from "react";
import "../styles/alerta-customizado.css";

const ModalLoginConcluido = ({ 
  isVisible, 
  onClose, 
  emailUsuario = "usuário" 
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="alerta-backdrop" onClick={handleBackdropClick}>
      <div className="alerta-modal success">
        <div className="alerta-header">
          <div className="alerta-icone">
            🎊
          </div>
          <h3 className="alerta-titulo">Login Realizado!</h3>
        </div>
        
        <div className="alerta-body">
          <p className="alerta-mensagem">
            Bem-vindo de volta! Você foi autenticado com sucesso.
          </p>
          <p className="alerta-mensagem-secundaria">
            Agora você pode agendar sua próxima sessão e acompanhar seus projetos.
          </p>
        </div>
        
        <div className="alerta-footer">
          <button 
            className="alerta-botao success"
            onClick={onClose}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginConcluido;