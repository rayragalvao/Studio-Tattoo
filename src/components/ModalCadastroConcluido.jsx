import React from "react";
import "../styles/alerta-customizado.css";

const ModalCadastroConcluido = ({ 
  isVisible, 
  onClose, 
  nomeUsuario = "usuário" 
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
            🎉
          </div>
          <h3 className="alerta-titulo">Cadastro Concluído!</h3>
        </div>
        
        <div className="alerta-body">
          <p className="alerta-mensagem">
            Parabéns, <strong>{nomeUsuario}</strong>! Sua conta foi criada com sucesso. 
            Bem-vindo ao nosso estúdio de tatuagem!
          </p>
          <p className="alerta-mensagem-secundaria">
            Agora faça seu login para agendar sua próxima tattoo e explorar nosso portfólio.
          </p>
        </div>
        
        <div className="alerta-footer">
          <button 
            className="alerta-botao success"
            onClick={onClose}
          >
            Fazer login agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCadastroConcluido;