import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/card-resposta.css';

const CardResposta = ({ 
  tipo = 'sucesso', 
  titulo, 
  mensagem, 
  codigo, 
  botaoTexto = 'Fechar', 
  onClose, 
  className = '' 
}) => {
  const location = useLocation();
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const getIcone = () => {
    switch (tipo) {
      case 'sucesso':
        return '✓';
      case 'erro':
        return '✕';
      case 'aviso':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  const getNomePagina = () => {
    const path = location.pathname;
    switch (path) {
      case '/orcamento':
        return 'orçamento';
      case '/agendamento':
        return 'agendamento';
      default:
        return 'solicitação';
    }
  };

  return (
    <div className="card-resposta-overlay" onClick={handleOverlayClick}>
      <div className="card-resposta-container">
        <div className={`card-resposta card-resposta--${tipo} ${className}`}>
          <div className={`card-resposta-icone card-resposta-icone--${tipo}`}>
            {getIcone()}
          </div>
          
          <h2 className="card-resposta-titulo">{titulo}</h2>
          
          <p className="card-resposta-mensagem">{mensagem}</p>
          
          {codigo && (
            <div className={`card-resposta-codigo card-resposta-codigo--${tipo}`}>
              <span>Código do seu {getNomePagina()}: </span>
              <strong>{codigo}</strong>
            </div>
          )}
          
          <button 
            className={`card-resposta-botao card-resposta-botao--${tipo}`}
            onClick={onClose}
          >
            {botaoTexto}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardResposta;