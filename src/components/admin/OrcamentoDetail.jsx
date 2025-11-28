import React, { useState, useEffect } from 'react';
import './orcamentoDetail.css';

const AdminOrcamentoDetail = ({ orcamento, onUpdateStatus }) => {
  const [valor, setValor] = useState('');
  const [tempo, setTempo] = useState('');
  const [erroValor, setErroValor] = useState(false);
  const [erroTempo, setErroTempo] = useState(false);

  // Reseta os campos quando mudar de orçamento
  useEffect(() => {
    setValor('');
    setTempo('');
    setErroValor(false);
    setErroTempo(false);
  }, [orcamento?.id]);

  const formatarValor = (value) => {
    // Remove tudo que não é número
    const numero = value.replace(/\D/g, '');
    
    if (!numero || numero === '0') return '';
    
    // Converte para número e formata
    const valorNumerico = Number(numero) / 100;
    
    return valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleValorChange = (e) => {
    const valorFormatado = formatarValor(e.target.value);
    setValor(valorFormatado);
    setErroValor(false);
  };

  const formatarTempo = (value) => {
    // Remove tudo que não é número
    const numero = value.replace(/\D/g, '');
    
    if (numero.length === 0) return '';
    if (numero.length <= 2) return numero + 'h';
    
    const horas = numero.slice(0, -2);
    const minutos = numero.slice(-2);
    
    return `${horas}h${minutos}min`;
  };

  const handleTempoChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    if (apenasNumeros.length <= 4) {
      const tempoFormatado = formatarTempo(e.target.value);
      setTempo(tempoFormatado);
      setErroTempo(false);
    }
  };

  const validarCampos = () => {
    const valorValido = valor && valor.trim() !== '' && valor !== 'R$ 0,00';
    const tempoValido = tempo && tempo.trim() !== '';
    
    setErroValor(!valorValido);
    setErroTempo(!tempoValido);
    
    return valorValido && tempoValido;
  };

  const handleEnviarOrcamento = () => {
    if (validarCampos()) {
      onUpdateStatus(orcamento.id, 'respondido', { valor, tempo });
    }
  };

  if (!orcamento) {
    return (
      <section className="orc-detail empty">
        <p>Selecione um orçamento à esquerda para ver os detalhes.</p>
      </section>
    );
  }

  return (
    <section className="orc-detail">
      <h2 className="detail-title">Informe os valores</h2>
      <div className="fields-grid">
        <div className="field-group">
          <label>Valor do tatuagem*</label>
          <input 
            type="text" 
            placeholder="Ex: R$ 500,00" 
            value={valor}
            onChange={handleValorChange}
            className={erroValor ? 'input-error' : ''}
          />
          {erroValor && <span className="error-message">Campo obrigatório</span>}
        </div>
        <div className="field-group">
          <label>Tempo estimado da sessão*</label>
          <input 
            type="text" 
            placeholder="Ex: 3h30min" 
            value={tempo}
            onChange={handleTempoChange}
            className={erroTempo ? 'input-error' : ''}
          />
          {erroTempo && <span className="error-message">Campo obrigatório</span>}
        </div>
      </div>

      <div className="info-sections-grid">
        <div className="info-section">
          <h3 className="section-title">Informações do cliente</h3>
          <div className="info-group">
            <div className="info-labels-row">
              <span className="info-label">Nome:</span>
              <span className="info-label">Email:</span>
            </div>
            <div className="info-values-row">
              <span className="info-value">{orcamento.nome}</span>
              <span className="info-value">{orcamento.email}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3 className="section-title">Informações do orçamento</h3>
          <div className="info-group">
            <div className="info-labels-row">
              <span className="info-label">Tamanho:</span>
              <span className="info-label">Local do corpo:</span>
            </div>
            <div className="info-values-row">
              <span className="info-value">{orcamento.tamanho || '-'}</span>
              <span className="info-value">{orcamento.localCorpo || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="descricao-section">
        <span className="info-label">Descrição:</span>
        <div className="descricao-box">{orcamento.ideia || orcamento.descricao || 'Sem descrição'}</div>
      </div>

      <div className="referencia-section">
        <span className="info-label">Referência:</span>
        <div className="referencia-box">
          {orcamento.imagemReferencia ? (
            <img 
              src={orcamento.imagemReferencia} 
              alt="Referência da tatuagem" 
              className="referencia-image"
            />
          ) : (
            <span className="sem-referencia">Sem imagem de referência</span>
          )}
        </div>
      </div>

      <div className="orc-detail-actions">
        <button className="btn-primary" onClick={handleEnviarOrcamento}>Enviar orçamento</button>
        <button className="btn-secondary" onClick={() => onUpdateStatus(orcamento.id, 'cancelado')}>Cancelar orçamento</button>
      </div>
    </section>
  );
};

export default AdminOrcamentoDetail;
