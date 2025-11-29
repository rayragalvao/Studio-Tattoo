import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import OrcamentoService from "../../../services/OrcamentoService";
import "./meusOrcamentos.css";

export const MeusOrcamentos = () => {
  const { user } = useAuth();
  const [orcamentos, setOrcamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarOrcamentos();
  }, [user]);

  const carregarOrcamentos = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const dados = await OrcamentoService.buscarOrcamentosUsuario(user.id);
      console.log("Orçamentos recebidos do backend:", dados);
      setOrcamentos(dados || []);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      setError("Erro ao carregar orçamentos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (codigoOrcamento) => {
    setExpandedId(expandedId === codigoOrcamento ? null : codigoOrcamento);
    if (codigoOrcamento) {
      const orc = orcamentos.find(o => o.codigoOrcamento === codigoOrcamento);
      console.log("Orçamento selecionado:", orc);
    }
  };

  const getStatusClass = (status) => {
    console.log("Status recebido:", status);
    const statusMap = {
      'AGUARDANDO_RESPOSTA': 'pendente',
      'RESPONDIDO': 'aprovado',
      'CANCELADO': 'rejeitado',
      'PENDENTE': 'pendente',
      'APROVADO': 'aprovado',
      'REJEITADO': 'rejeitado'
    };
    const classe = statusMap[status] || 'pendente';
    console.log("Classe retornada:", classe);
    return classe;
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'AGUARDANDO_RESPOSTA': 'Pendente',
      'RESPONDIDO': 'Aprovado',
      'CANCELADO': 'Rejeitado'
    };
    return labelMap[status] || status;
  };

  const formatarTempo = (tempo) => {
    if (!tempo) return '--';
    return tempo;
  };

  const formatarValor = (valor) => {
    if (!valor) return '--';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="meus-orcamentos">
        <h2>Meus Orçamentos</h2>
        <div className="loading-container">
          <p>Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-orcamentos">
        <h2>Meus Orçamentos</h2>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={carregarOrcamentos} className="btn-retry">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (orcamentos.length === 0) {
    return (
      <div className="meus-orcamentos">
        <h2>Meus Orçamentos</h2>
        <div className="empty-state">
          <p>Você ainda não possui orçamentos solicitados.</p>
        </div>
      </div>
    );
  }

  if (expandedId) {
    const orcamentoSelecionado = orcamentos.find(o => o.codigoOrcamento === expandedId);
    
    if (!orcamentoSelecionado) return null;

    return (
      <div className="meus-orcamentos">
        <div className="orcamento-detalhes-fullscreen">
          <div className="detalhes-container">
            <button 
              className="btn-voltar" 
              onClick={() => toggleExpand(null)}
            >
              ← 
            </button>

            <div className="status-header">
              <span className="status-label">Status:</span>
              <span className={`status-value ${getStatusClass(orcamentoSelecionado.status)}`}>
                {getStatusLabel(orcamentoSelecionado.status)}
              </span>
            </div>

            <div className="info-columns">
              <div className="info-column">
                <h3 className="column-title">Informações do orçamento</h3>
                
                <div className="info-row">
                  <span className="info-label-orange">Tamanho:</span>
                  <span className="info-text">{orcamentoSelecionado.tamanho ? `${orcamentoSelecionado.tamanho}cm` : 'Não informado'}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Local do corpo:</span>
                  <span className="info-text">{orcamentoSelecionado.localCorpo || 'Não informado'}</span>
                </div>

                <div className="info-block">
                  <span className="info-label-orange">Descrição:</span>
                  <p className="info-text">{orcamentoSelecionado.ideia || 'Não informada'}</p>
                </div>

                <div className="info-block">
                  <span className="info-label-orange">Referência:</span>
                  {(() => {
                    console.log("imagemReferencia:", orcamentoSelecionado.imagemReferencia);
                    console.log("É array?", Array.isArray(orcamentoSelecionado.imagemReferencia));
                    console.log("Tem length?", orcamentoSelecionado.imagemReferencia?.length);
                    
                    if (orcamentoSelecionado.imagemReferencia && orcamentoSelecionado.imagemReferencia.length > 0) {
                      return (
                        <div className="imagens-grid">
                          {orcamentoSelecionado.imagemReferencia.map((img, index) => {
                            const imageUrl = img.startsWith('http') 
                              ? img 
                              : `http://localhost:8080/${img.replace(/\\/g, '/')}`;
                            
                            console.log(`Tentando carregar imagem ${index}:`, imageUrl);
                            return (
                              <div key={index} className="imagem-box">
                                <img 
                                  src={imageUrl} 
                                  alt={`Referência ${index + 1}`}
                                  onLoad={() => console.log('Imagem carregada com sucesso:', imageUrl)}
                                  onError={(e) => {
                                    console.error('ERRO ao carregar imagem:', imageUrl);
                                    console.error('Detalhes do erro:', e);
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#999;"><p>❌</p><p style="font-size:12px;text-align:center;padding:10px;">Erro ao carregar imagem</p></div>';
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return <div className="imagem-box-placeholder"></div>;
                    }
                  })()}
                </div>
              </div>

              <div className="info-column">
                <h3 className="column-title">Informações da resposta</h3>
                
                <div className="info-row">
                  <span className="info-label-orange">Valor:</span>
                  <span className="info-text info-orange">
                    {orcamentoSelecionado.valor ? formatarValor(orcamentoSelecionado.valor) : '--'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Tempo estimado:</span>
                  <span className="info-text info-orange">
                    {orcamentoSelecionado.tempo ? formatarTempo(orcamentoSelecionado.tempo) : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meus-orcamentos">
      <h2>Meus Orçamentos</h2>
      <div className="orcamentos-lista">
        {orcamentos.map((orcamento) => (
          <div
            key={orcamento.codigoOrcamento}
            className="orcamento-card"
            onClick={() => toggleExpand(orcamento.codigoOrcamento)}
          >
            <div className="orcamento-header">
              <div className="orcamento-header-info">
                <h3>Código: {orcamento.codigoOrcamento}</h3>
                <span className={`status-badge ${getStatusClass(orcamento.status)}`}>
                  {getStatusLabel(orcamento.status)}
                </span>
              </div>
              <span className="expand-icon">
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

