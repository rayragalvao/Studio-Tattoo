import React from "react";
import "../alertaCustomizado/alertaCustomizado.css";

const ModalCadastroConcluido = ({ 
  isVisible, 
  onClose
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
        <div className="alerta-body">
          <p className="alerta-mensagem">
            Cadastro realizado com sucesso!
          </p>
        </div>
        
        <div className="alerta-footer">
          <button 
            className="alerta-botao success"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCadastroConcluido;