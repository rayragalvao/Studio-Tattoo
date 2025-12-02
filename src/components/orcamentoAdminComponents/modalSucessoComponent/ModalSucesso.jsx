import React from 'react';
import './modalSucesso.css';

const ModalSucesso = ({ isOpen, onClose, mensagem }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-sucesso-overlay" onClick={handleOverlayClick}>
      <div className="modal-sucesso-content">
        <div className="modal-sucesso-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none"/>
            <path d="M8 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="modal-sucesso-titulo">Sucesso!</h2>
        <p className="modal-sucesso-mensagem">{mensagem || 'Operação realizada com sucesso!'}</p>
        <button className="modal-sucesso-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalSucesso;