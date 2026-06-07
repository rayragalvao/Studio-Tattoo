import React, { useState, useEffect } from 'react';
import './orcamentoDetail.css';

const OrcamentoDetail = ({ orcamento, onEnviar }) => {
  const [valorCentavos, setValorCentavos] = useState('');
  const [valorExibido, setValorExibido] = useState('');
  const [tempo, setTempo] = useState('');
  const [erroValor, setErroValor] = useState(false);
  const [erroTempo, setErroTempo] = useState(false);

  useEffect(() => {
    if (orcamento?.valor) {
      const centavos = Math.round(orcamento.valor * 100);
      setValorCentavos(String(centavos));
      setValorExibido((orcamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    } else {
      setValorCentavos('');
      setValorExibido('');
    }

    const tempoFormatado = orcamento?.tempo
      ? (typeof orcamento.tempo === 'string' ? orcamento.tempo : orcamento.tempo.toString())
      : '';

    setTempo(tempoFormatado);
    setErroValor(false);
    setErroTempo(false);
  }, [orcamento]);

  const handleValorChange = (e) => {
    const num = e.target.value.replace(/\D/g, '');
    setValorCentavos(num);
    if (num) {
      setValorExibido((Number(num) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    } else {
      setValorExibido('');
    }
    setErroValor(false);
  };

  const formatarTempo = (value) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    if (num.length <= 2) return num + 'h';
    const horas = num.slice(0, -2);
    const minutos = num.slice(-2);
    return `${horas}h${minutos}min`;
  };

  const handleTempoChange = e => {
    const num = e.target.value.replace(/\D/g, '');
    if (num.length <= 4) {
      setTempo(formatarTempo(e.target.value));
      setErroTempo(false);
    }
  };

  const validar = () => {
    const vOk = valorCentavos && Number(valorCentavos) > 0;
    const tOk = tempo && tempo.trim() !== '';
    setErroValor(!vOk);
    setErroTempo(!tOk);
    return vOk && tOk;
  };

  const enviar = () => {
    if (validar()) {
      // Envia o valor real (dividido por 100) para o backend
      const valorReal = Number(valorCentavos) / 100;
      onEnviar?.(orcamento, { valor: String(valorReal), tempo });
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
          <label>Valor da tatuagem*</label>
          <input
            type="text"
            placeholder="Ex: R$ 1.000,00"
            value={valorExibido}
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
          <span className="info-label">Nome:</span> <span className="info-value">{orcamento.nome}</span><br />
          <span className="info-label">Email:</span> <span className="info-value">{orcamento.email}</span>
        </div>
        <div className="info-section">
          <h3 className="section-title">Informações do orçamento</h3>
          <span className="info-label">Tamanho:</span> <span className="info-value">{orcamento.tamanho || '-'}</span><br />
          <span className="info-label">Local:</span> <span className="info-value">{orcamento.localCorpo || '-'}</span>
        </div>
      </div>

      <div className="descricao-section" style={{ marginBottom: '16px' }}>
        <span className="info-label">Descrição/Ideia:</span>
        <div className="descricao-box">{orcamento.ideia || orcamento.descricao || 'Sem descrição'}</div>
      </div>

      <div className="referencia-section" style={{ marginBottom: '20px' }}>
        <span className="info-label">Imagens de Referência:</span>
        <div className="referencia-box">
          {orcamento.imagemReferencia && orcamento.imagemReferencia.length > 0 ? (
            <div className="referencias-grid">
              {orcamento.imagemReferencia.map((img, idx) => {
                const imgPath = img.replace(/\\/g, '/');
                const imgUrl = `http://34.199.8.137/api/${imgPath}`;
                return (
                  <img key={idx} src={imgUrl} alt={`Referência ${idx + 1}`} className="referencia-image" />
                );
              })}
            </div>
          ) : (
            <span className="sem-referencia">Sem imagem de referência</span>
          )}
        </div>
      </div>

      <div className="orc-detail-actions">
        <button className="btn-primary" onClick={enviar}>Enviar orçamento</button>
        <button className="btn-secondary" onClick={() => { }}>Cancelar</button>
      </div>
    </section>
  );
};

export default OrcamentoDetail;
