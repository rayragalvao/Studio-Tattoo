import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import OrcamentoService from "../../../services/OrcamentoService";
import { Notificacao } from "../../../components/generalComponents/notificacao/Notificacao";
import "./meusOrcamentos.css";

export const MeusOrcamentos = () => {
  const { user } = useAuth();
  const [orcamentos, setOrcamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [notificacao, setNotificacao] = useState({
    visivel: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: ""
  });
  const [formEdicao, setFormEdicao] = useState({
    tamanho: "",
    localCorpo: "",
    cores: "",
    ideia: ""
  });
  const [orcamentoTemAgendamento, setOrcamentoTemAgendamento] = useState(false);

  useEffect(() => {
    carregarOrcamentos();
  }, [user]);

  const carregarOrcamentos = async () => {
    if (!user || !user.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const dados = await OrcamentoService.buscarOrcamentosUsuario(user.id);
      setOrcamentos(dados || []);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      let mensagemErro = "Erro ao carregar orçamentos. Tente novamente.";
      
      if (error.response?.status === 500) {
        mensagemErro = "Erro no servidor. Verifique se o backend está rodando corretamente.";
      } else if (error.response?.status === 401) {
        mensagemErro = "Sessão expirada. Faça login novamente.";
      } else if (!error.response) {
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      }
      
      setError(mensagemErro);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (codigoOrcamento) => {
    setExpandedId(expandedId === codigoOrcamento ? null : codigoOrcamento);
    if (codigoOrcamento) {
      const orc = orcamentos.find(o => o.codigoOrcamento === codigoOrcamento);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'AGUARDANDO_RESPOSTA': 'pendente',
      'RESPONDIDO': 'aprovado',
      'CANCELADO': 'rejeitado',
      'PENDENTE': 'pendente',
      'APROVADO': 'aprovado',
      'REJEITADO': 'rejeitado'
    };
    const classe = statusMap[status] || 'pendente';
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

  const abrirModalEditar = (orcamento) => {
    setOrcamentoEditando(orcamento);
    // Converte a string de cores em array (ex: "preto, vermelho" -> ["preto", "vermelho"])
    const coresArray = orcamento.cores ? 
      orcamento.cores.toLowerCase().split(',').map(c => c.trim()) : 
      [];
    setFormEdicao({
      tamanho: orcamento.tamanho || "",
      localCorpo: orcamento.localCorpo || "",
      cores: coresArray,
      ideia: orcamento.ideia || ""
    });
    setModalEditar(true);
  };

  const fecharModalEditar = () => {
    setModalEditar(false);
    setOrcamentoEditando(null);
    setFormEdicao({
      tamanho: "",
      localCorpo: "",
      cores: [],
      ideia: ""
    });
  };

  const abrirModalExcluir = async (orcamento) => {
    setOrcamentoEditando(orcamento);
    const temAgendamento = await OrcamentoService.verificarSeTemAgendamento(orcamento.codigoOrcamento);
    setOrcamentoTemAgendamento(temAgendamento);
    setModalExcluir(true);
  };

  const fecharModalExcluir = () => {
    setModalExcluir(false);
    setOrcamentoEditando(null);
    setOrcamentoTemAgendamento(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEdicao(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormEdicao(prev => {
      const novasCores = checked
        ? [...prev.cores, value]
        : prev.cores.filter(cor => cor !== value);
      return {
        ...prev,
        cores: novasCores
      };
    });
  };

  const handleSalvarEdicao = async () => {
    if (!formEdicao.tamanho || !formEdicao.localCorpo || !formEdicao.ideia) {
      setNotificacao({
        visivel: true,
        tipo: "aviso",
        titulo: "Campos obrigatórios",
        mensagem: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (!formEdicao.cores || formEdicao.cores.length === 0) {
      setNotificacao({
        visivel: true,
        tipo: "aviso",
        titulo: "Selecione uma cor",
        mensagem: "Por favor, selecione pelo menos uma cor."
      });
      return;
    }

    const tamanhoNumero = parseFloat(formEdicao.tamanho);
    if (isNaN(tamanhoNumero) || tamanhoNumero <= 0) {
      setNotificacao({
        visivel: true,
        tipo: "aviso",
        titulo: "Tamanho inválido",
        mensagem: "O tamanho deve ser um número válido maior que zero."
      });
      return;
    }

    setSalvando(true);
    try {
      const dadosAtualizacao = {
        tamanho: tamanhoNumero,
        localCorpo: formEdicao.localCorpo.trim(),
        cores: Array.isArray(formEdicao.cores) ? formEdicao.cores.join(', ') : formEdicao.cores,
        ideia: formEdicao.ideia.trim()
      };

      await OrcamentoService.atualizar(
        orcamentoEditando.codigoOrcamento, 
        dadosAtualizacao
      );

      await carregarOrcamentos();
      fecharModalEditar();
      setNotificacao({
        visivel: true,
        tipo: "sucesso",
        titulo: "Sucesso!",
        mensagem: "Orçamento atualizado com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      console.error("Detalhes do erro:", error.response?.data);
      setNotificacao({
        visivel: true,
        tipo: "erro",
        titulo: "Erro",
        mensagem: error.response?.data?.message || error.message || "Erro ao atualizar orçamento. Tente novamente."
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = async () => {
    setSalvando(true);
    try {
      await OrcamentoService.cancelar(orcamentoEditando.codigoOrcamento);
      await carregarOrcamentos();
      fecharModalCancelar();
      setExpandedId(null);
      setNotificacao({
        visivel: true,
        tipo: "sucesso",
        titulo: "Sucesso!",
        mensagem: "Orçamento cancelado com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao cancelar orçamento:", error);
      setNotificacao({
        visivel: true,
        tipo: "erro",
        titulo: "Erro",
        mensagem: error.message || "Erro ao cancelar orçamento. Tente novamente."
      });
    } finally {
      setSalvando(false);
    }
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
                  <span className="info-label-orange">Código:</span>
                  <span className="info-text">{orcamentoSelecionado.codigoOrcamento}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Tamanho:</span>
                  <span className="info-text">{orcamentoSelecionado.tamanho ? `${orcamentoSelecionado.tamanho}cm` : 'Não informado'}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Local do corpo:</span>
                  <span className="info-text">{orcamentoSelecionado.localCorpo || 'Não informado'}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Cores:</span>
                  <span className="info-text">{orcamentoSelecionado.cores || 'Não informado'}</span>
                </div>

                <div className="info-block">
                  <span className="info-label-orange">Descrição:</span>
                  <p className="info-text">{orcamentoSelecionado.ideia || 'Não informada'}</p>
                </div>

                <div className="info-block">
                  <span className="info-label-orange">Referência:</span>
                  {(() => {
                    if (orcamentoSelecionado.imagemReferencia && orcamentoSelecionado.imagemReferencia.length > 0) {
                      return (
                        <div className="imagens-grid">
                          {orcamentoSelecionado.imagemReferencia.map((img, index) => {
                            let imageUrl;
                            if (img.startsWith('http')) {
                              imageUrl = img;
                            } else {
                              const cleanPath = img.replace(/\\/g, '/');
                              imageUrl = `http://localhost:8080/${cleanPath}`;
                            }
                            
                            return (
                              <div key={index} className="imagem-box">
                                <a 
                                  href={imageUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="imagem-link"
                                  title="Clique para abrir a imagem em uma nova aba"
                                >
                                  <img 
                                    src={imageUrl} 
                                    alt={`Referência ${index + 1}`}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const parent = e.target.parentElement.parentElement;
                                      const fallback = document.createElement('div');
                                      fallback.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#999;background:#f5f5f5;border:1px dashed #ddd;border-radius:8px;padding:20px;cursor:pointer;';
                                      fallback.innerHTML = '<p style="font-size:24px;margin:0;">🔗</p><p style="font-size:12px;text-align:center;margin:8px 0 0 0;">Imagem externa</p><p style="font-size:10px;text-align:center;margin:4px 0 0 0;color:#666;">Clique para visualizar</p>';
                                      parent.innerHTML = '';
                                      parent.appendChild(fallback);
                                    }}
                                  />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <div className="imagem-box-placeholder">
                          <p style="color:#999;font-size:14px;text-align:center;">Nenhuma imagem de referência anexada</p>
                        </div>
                      );
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

            <div className="acoes-agendamento">
              <button 
                className="btn-editar"
                onClick={() => abrirModalEditar(orcamentoSelecionado)}
              >
                Editar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => abrirModalCancelar(orcamentoSelecionado)}
                disabled={orcamentoSelecionado.status === 'CANCELADO'}
              >
                {orcamentoSelecionado.status === 'CANCELADO' ? 'Cancelado' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>

        {modalEditar && (
          <div className="modal-overlay-orcamento" onClick={fecharModalEditar}>
            <div className="modal-content-orcamento modal-editar-orcamento" onClick={(e) => e.stopPropagation()}>
              <h3>Editar Orçamento</h3>
              
              <div className="form-edicao">
                <div className="campos-edicao-orcamento">
                  <div className="campo-edicao">
                    <label>
                      Tamanho (cm):
                      <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="tamanho"
                      value={formEdicao.tamanho}
                      onChange={handleInputChange}
                      placeholder="Ex: 10"
                      className="input-edicao"
                    />
                  </div>

                  <div className="campo-edicao">
                    <label>
                      Local do corpo:
                      <span className="required">*</span>
                    </label>
                    <select
                      name="localCorpo"
                      value={formEdicao.localCorpo}
                      onChange={handleInputChange}
                      className="input-edicao"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Braço">Braço</option>
                      <option value="Antebraço">Antebraço</option>
                      <option value="Perna">Perna</option>
                      <option value="Costas">Costas</option>
                      <option value="Costelas">Costelas</option>
                      <option value="Abdômen">Abdômen</option>
                      <option value="Glúteos">Glúteos</option>
                      <option value="Meio dos seios">Meio dos seios</option>
                      <option value="Cotovelo">Cotovelo</option>
                      <option value="Ombro">Ombro</option>
                      <option value="Punho">Punho</option>
                      <option value="Tornozelo">Tornozelo</option>
                      <option value="Pescoço">Pescoço</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div className="campo-edicao">
                    <label>
                      Cores:
                      <span className="required">*</span>
                    </label>
                    <div className="checkbox-group-edicao">
                      <label className="checkbox-item-edicao">
                        <input
                          type="checkbox"
                          value="preto"
                          checked={formEdicao.cores.includes('preto')}
                          onChange={handleCheckboxChange}
                        />
                        Preto
                      </label>
                      <label className="checkbox-item-edicao">
                        <input
                          type="checkbox"
                          value="vermelho"
                          checked={formEdicao.cores.includes('vermelho')}
                          onChange={handleCheckboxChange}
                        />
                        Vermelho
                      </label>
                    </div>
                  </div>

                  <div className="campo-edicao">
                    <label>
                      Descrição:
                      <span className="required">*</span>
                    </label>
                    <textarea
                      name="ideia"
                      value={formEdicao.ideia}
                      onChange={handleInputChange}
                      placeholder="Descreva sua ideia..."
                      className="textarea-edicao"
                      rows="4"
                    />
                  </div>
                </div>

                <div className="modal-acoes">
                  <button 
                    onClick={handleSalvarEdicao} 
                    className="btn-salvar"
                    disabled={salvando}
                  >
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button 
                    onClick={fecharModalEditar} 
                    className="btn-cancelar"
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalCancelar && (
          <div className="modal-overlay-orcamento" onClick={fecharModalCancelar}>
            <div className="modal-content-orcamento modal-confirmacao" onClick={(e) => e.stopPropagation()}>
              <h3>Confirmar Cancelamento</h3>
              <p>Tem certeza que deseja cancelar este orçamento?</p>
              {orcamentoTemAgendamento && (
                <p className="aviso-exclusao">
                  ⚠️ Este orçamento possui um agendamento vinculado. Considere cancelar o agendamento também.
                </p>
              )}
              <p className="aviso-exclusao">O orçamento ficará marcado como CANCELADO.</p>
              
              <div className="modal-acoes">
                <button 
                  onClick={handleCancelar} 
                  className="btn-confirmar-exclusao"
                  disabled={salvando}
                >
                  {salvando ? 'Cancelando...' : 'Sim, cancelar'}
                </button>
                <button 
                  onClick={fecharModalCancelar} 
                  className="btn-cancelar"
                  disabled={salvando}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        <Notificacao
          visivel={notificacao.visivel}
          tipo={notificacao.tipo}
          titulo={notificacao.titulo}
          mensagem={notificacao.mensagem}
          onFechar={() => setNotificacao({ ...notificacao, visivel: false })}
        />
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
            <div className="orcamento-header-info">
              <h3>Código: {orcamento.codigoOrcamento}</h3>
              <span className={`status-badge ${getStatusClass(orcamento.status)}`}>
                {getStatusLabel(orcamento.status)}
              </span>
            </div>
            <span className="expand-icon material-symbols-outlined">
              info
            </span>
          </div>
        ))}
      </div>

      <Notificacao
        visivel={notificacao.visivel}
        tipo={notificacao.tipo}
        titulo={notificacao.titulo}
        mensagem={notificacao.mensagem}
        onFechar={() => setNotificacao({ ...notificacao, visivel: false })}
      />
    </div>
  );
};


