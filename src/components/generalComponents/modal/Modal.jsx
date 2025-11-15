import React from 'react';

export const Modal = ({ isOpen, onClose, children, transitionClass = "", closeButtonColor = "#222222" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${transitionClass}`}>
        <button 
          className="modal-close" 
          onClick={onClose}
          style={{ color: closeButtonColor }}
        >×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;