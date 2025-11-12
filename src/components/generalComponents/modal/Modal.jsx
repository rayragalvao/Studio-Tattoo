import React from 'react';

export const Modal = ({ isOpen, onClose, children, transitionClass = ""}) => {
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
        >×</button>
        {children}
      </div>
    </div>
  );
};