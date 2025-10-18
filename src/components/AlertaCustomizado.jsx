import React from "react";
import "../styles/alerta-customizado.css";

const AlertaCustomizado = ({ 
  isVisible, 
  onClose, 
  titulo = "Sucesso!", 
  mensagem, 
  tipo = "success",
  botaoTexto = "OK" 
}) => {
  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcone = () => {
    switch (tipo) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "✓";
    }
  };

  return (
    <div className="alerta-backdrop" onClick={handleBackdropClick}>
      <div className={`alerta-modal ${tipo}`}>
        <div className="alerta-header">
          <div className="alerta-icone">
            {getIcone()}
          </div>
          <h3 className="alerta-titulo">{titulo}</h3>
        </div>
        
        <div className="alerta-body">
          <p className="alerta-mensagem">{mensagem}</p>
        </div>
        
        <div className="alerta-footer">
          <button 
            className="alerta-botao"
            onClick={onClose}
          >
            {botaoTexto}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertaCustomizado;