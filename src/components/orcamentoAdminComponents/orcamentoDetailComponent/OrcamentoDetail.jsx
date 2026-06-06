import React, { useState, useEffect } from 'react';
import './orcamentoDetail.css';

const OrcamentoDetail = ({ orcamento, onEnviar }) => {
  const [valor, setValor] = useState('');
  const [tempo, setTempo] = useState('');
  const [erroValor, setErroValor] = useState(false);
  const [erroTempo, setErroTempo] = useState(false);

  useEffect(()=>{ 
    console.log('🔄 useEffect executado - orçamento:', orcamento);
    console.log('💰 Campo valor no orçamento:', orcamento?.valor);
    console.log('⏰ Campo tempo no orçamento:', orcamento?.tempo);
    
    // Se o orçamento tem valor, formata como moeda
    const valorFormatado = orcamento?.valor 
      ? orcamento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '';
    
    // Se o orçamento tem tempo, converte de Time para formato legível
    const tempoFormatado = orcamento?.tempo 
      ? (typeof orcamento.tempo === 'string' ? orcamento.tempo : orcamento.tempo.toString())
      : '';
    
    setValor(valorFormatado); 
    setTempo(tempoFormatado); 
    setErroValor(false); 
    setErroTempo(false);
    
    console.log('✅ Estados definidos - valor:', valorFormatado, 'tempo:', tempoFormatado);
    
    if(orcamento) {
      console.log('🔍 Orçamento selecionado completo:', orcamento);
      console.log('📝 Ideia:', orcamento.ideia);
      console.log('📐 Tamanho:', orcamento.tamanho);
      console.log('💰 Valor atual:', orcamento.valor);
      console.log('⏰ Tempo atual:', orcamento.tempo);
      console.log('📋 Todas as propriedades:', Object.keys(orcamento));
      console.log('🖼️ imagemReferencia:', orcamento.imagemReferencia);
      console.log('🔢 Tipo:', typeof orcamento.imagemReferencia);
      console.log('📦 É array?', Array.isArray(orcamento.imagemReferencia));
    }
  }, [orcamento]);

  const formatarValor = (value) => {
  const numero = value.replace(/\D/g, '');
  if (!numero) return '';
  const valorNumerico = Number(numero);
  return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
  const handleValorChange = e => { setValor(formatarValor(e.target.value)); setErroValor(false); };

  const formatarTempo = (value) => {
    const num = value.replace(/\D/g,'');
    if(!num) return '';
    if(num.length <=2) return num + 'h';
    const horas = num.slice(0,-2); const minutos = num.slice(-2);
    return `${horas}h${minutos}min`;
  };
  const handleTempoChange = e => { const num = e.target.value.replace(/\D/g,''); if(num.length<=4){ setTempo(formatarTempo(e.target.value)); setErroTempo(false);} };

  const validar = () => {
    const vOk = valor && valor !== 'R$ 0,00';
    const tOk = tempo && tempo.trim() !== '';
    setErroValor(!vOk); setErroTempo(!tOk);
    return vOk && tOk;
  };

  const enviar = () => { 
    if(validar()){ 
      console.log('📤 OrcamentoDetail.enviar - Enviando para onEnviar:');
      console.log('  - valor:', valor);
      console.log('  - tempo:', tempo);
      onEnviar?.(orcamento, { valor, tempo }); 
    } 
  };

  if(!orcamento){ return <section className="orc-detail empty"><p>Selecione um orçamento à esquerda para ver os detalhes.</p></section>; }

  return (
    <section className="orc-detail">
      <h2 className="detail-title">Informe os valores</h2>
      <div className="fields-grid">
        <div className="field-group">
          <label>Valor da tatuagem*</label>
          <input type="text" placeholder="Ex: R$ 500,00" value={valor} onChange={handleValorChange} className={erroValor? 'input-error':''} />
          {erroValor && <span className="error-message">Campo obrigatório</span>}
        </div>
        <div className="field-group">
          <label>Tempo estimado da sessão*</label>
          <input type="text" placeholder="Ex: 3h30min" value={tempo} onChange={handleTempoChange} className={erroTempo? 'input-error':''} />
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

      <div className="descricao-section" style={{ marginBottom:'16px' }}>
        <span className="info-label">Descrição/Ideia:</span>
        <div className="descricao-box">{orcamento.ideia || orcamento.descricao || 'Sem descrição'}</div>
      </div>

      <div className="referencia-section" style={{ marginBottom:'20px' }}>
        <span className="info-label">Imagens de Referência:</span>
        <div className="referencia-box">
          {orcamento.imagemReferencia && orcamento.imagemReferencia.length > 0 ? (
            <div className="referencias-grid">
              {orcamento.imagemReferencia.map((img, idx) => {
                // Converter barras invertidas do Windows para barras normais
                const imgPath = img.replace(/\\/g, '/');
                const imgUrl = `http://34.199.8.137/api/${imgPath}`;
                console.log(`🖼️ Carregando imagem ${idx + 1}:`, imgUrl);
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
        <button className="btn-secondary" onClick={()=>{ /* cancelar */ }}>Cancelar</button>
      </div>
    </section>
  );
};

export default OrcamentoDetail;
