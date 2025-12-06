import React, { useState, useEffect } from 'react';
import './agendamentoDetail.css';
import OrcamentoService from '../../../services/OrcamentoService';

const AgendamentoDetail = ({ agendamento, onConfirmar, onCancelar }) => {
  const [imagensReferencia, setImagensReferencia] = useState([]);

  useEffect(() => {
    // Buscar as imagens do orçamento quando o agendamento mudar
    if (agendamento?.codigoOrcamento) {
      carregarImagensDoOrcamento(agendamento.codigoOrcamento);
    }
  }, [agendamento?.codigoOrcamento]);

  const carregarImagensDoOrcamento = async (codigoOrcamento) => {
    try {
      const orcamento = await OrcamentoService.buscarOrcamento(codigoOrcamento);
      console.log('🖼️ Orçamento carregado com imagens:', orcamento);
      if (orcamento.imagemReferencia && Array.isArray(orcamento.imagemReferencia)) {
        setImagensReferencia(orcamento.imagemReferencia);
        console.log('✅ Imagens carregadas:', orcamento.imagemReferencia);
      } else {
        setImagensReferencia([]);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar imagens do orçamento:', error);
      setImagensReferencia([]);
    }
  };
  if (!agendamento) {
    return (
      <section className="agend-detail empty">
        <p>Selecione um agendamento à esquerda para ver os detalhes.</p>
      </section>
    );
  }

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Data não disponível';
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} - ${hora}:${min}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'AGUARDANDO': 'Aguardando confirmação',
      'CONFIRMADO': 'Confirmado',
      'CANCELADO': 'Cancelado',
      'CONCLUIDO': 'Concluído',
      'PENDENTE': 'Pendente'
    };
    return labels[status] || status;
  };

  const formatarTamanho = (tamanho) => {
    if (!tamanho) return 'Não informado';
    return `${tamanho}cm`;
  };

  const formatarValor = (valor) => {
    if (!valor) return 'Não informado';
    return parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Dados do orçamento podem vir diretamente no agendamento (DTO) ou dentro de agendamento.orcamento (objeto completo)
  const orcamento = agendamento.orcamento || agendamento;
  const usuario = agendamento.usuario || {};

  console.log('📋 Renderizando AgendamentoDetail:', agendamento);
  console.log('📦 Orçamento:', orcamento);
  console.log('👤 Usuário:', usuario);

  return (
    <section className="agend-detail">
      {/* Status no topo */}
      <div className="status-header">
        <span className="status-label">Status:</span>
        <span className="status-value">{getStatusLabel(agendamento.status)}</span>
        {agendamento.status !== 'CONFIRMADO' && agendamento.status !== 'CANCELADO' && agendamento.status !== 'CONCLUIDO' && (
          <button className="btn-confirmar-top" onClick={() => onConfirmar?.(agendamento.id)}>
            Confirmar agendamento
          </button>
        )}
      </div>

      {/* Informações do agendamento */}
      <div className="info-block">
        <h3 className="block-title">Informações do agendamento</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Cliente:</span>
            <span className="value">{agendamento.nomeUsuario || usuario.nome || 'Não informado'}</span>
          </div>
          <div className="info-item">
            <span className="label">Tempo estimado:</span>
            <span className="value">{orcamento.tempo || 'Não informado'}</span>
          </div>
          <div className="info-item">
            <span className="label">Valor:</span>
            <span className="value">{formatarValor(orcamento.valor)}</span>
          </div>
          <div className="info-item">
            <span className="label">Data/Horário:</span>
            <span className="value">{formatarDataHora(agendamento.dataHora)}</span>
          </div>
        </div>
      </div>

      {/* Informações do orçamento */}
      <div className="info-block">
        <h3 className="block-title">Informações do orçamento</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Tamanho:</span>
            <span className="value">{formatarTamanho(agendamento.tamanho || orcamento.tamanho)}</span>
          </div>
          <div className="info-item">
            <span className="label">Local do corpo:</span>
            <span className="value">{agendamento.localCorpo || orcamento.localCorpo || 'Não informado'}</span>
          </div>
          {(agendamento.cores || orcamento.cores) && (
            <div className="info-item">
              <span className="label">Cores:</span>
              <span className="value">{agendamento.cores || orcamento.cores}</span>
            </div>
          )}
        </div>

        {(agendamento.ideia || orcamento.ideia) && (
          <div className="descricao-block">
            <span className="label">Descrição:</span>
            <p className="descricao-text">{agendamento.ideia || orcamento.ideia}</p>
          </div>
        )}

        {imagensReferencia && imagensReferencia.length > 0 ? (
          <div className="referencia-block">
            <span className="label">Referência:</span>
            <div className="referencia-placeholder">
              <div className="referencias-grid">
                {imagensReferencia.map((img, idx) => {
                  const imgPath = img.replace(/\\/g, '/');
                  const imgUrl = `http://localhost:8080/${imgPath}`;
                  return (
                    <img 
                      key={idx} 
                      src={imgUrl} 
                      alt={`Referência ${idx + 1}`} 
                      className="referencia-img"
                      onError={(e) => {
                        console.error('❌ Erro ao carregar imagem:', imgUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="referencia-block">
            <span className="label">Referência:</span>
            <div className="referencia-placeholder">
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Nenhuma imagem de referência
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botões de ação no rodapé */}
      <div className="action-buttons">
        {agendamento.status !== 'CONCLUIDO' && agendamento.status !== 'CANCELADO' && (
          <button className="btn-completar" onClick={() => onConfirmar?.(agendamento.id)}>
            Completar agendamento
          </button>
        )}
        {agendamento.status !== 'CANCELADO' && (
          <button className="btn-cancelar-bottom" onClick={() => onCancelar?.(agendamento.id)}>
            Cancelar agendamento
          </button>
        )}
      </div>
    </section>
  );
};

export default AgendamentoDetail;
