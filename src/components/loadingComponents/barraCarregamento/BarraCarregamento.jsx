import React from 'react';
import './barraCarregamento.css';

export const BarraCarregamento = () => {
  return (
    <div className="barra-wrapper" aria-live="polite" aria-busy="true">
      <div className="barra" />
    </div>
  );
};
