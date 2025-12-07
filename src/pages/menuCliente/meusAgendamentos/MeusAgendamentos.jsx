import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AgendamentoService from "../../../services/AgendamentoService";
import { Calendario } from "../../../components/agendamentoComponents/calendario/Calendario";
import { Notificacao } from "../../../components/generalComponents/notificacao/Notificacao";
import "./meusAgendamentos.css";

export const MeusAgendamentos = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [recarregarDatas, setRecarregarDatas] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [notificacao, setNotificacao] = useState({
    visivel: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: ""
  });

  useEffect(() => {
    carregarAgendamentos();
  }, [user]);

  const carregarAgendamentos = async () => {
    if (!user || !user.id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dados = await AgendamentoService.buscarAgendamentosUsuario(user.id);
      setAgendamentos(dados || []);
    } catch (error) {
      setError("Erro ao carregar agendamentos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return "Não informado";
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHora = (dataISO) => {
    if (!dataISO) return "--:--";
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'CONFIRMADO': 'confirmado',
      'PENDENTE': 'pendente',
      'CANCELADO': 'cancelado',
      'CONCLUIDO': 'concluido'
    };
    return statusMap[status] || 'pendente';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'CONFIRMADO': 'Confirmado',
      'PENDENTE': 'Pendente',
      'CANCELADO': 'Cancelado',
      'CONCLUIDO': 'Concluído'
    };
    return labelMap[status] || status;
  };

  const abrirModalEditar = (agendamento) => {
    setAgendamentoEditando(agendamento);
    const data = new Date(agendamento.dataHora);
    const dataFormatada = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
    setDataSelecionada(dataFormatada);
    // Formatar horário no mesmo formato usado pelos botões (HH:mm)
    const horarioFormatado = `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
    setHorarioSelecionado(horarioFormatado);
    setModalEditar(true);
  };

  const fecharModalEditar = () => {
    setModalEditar(false);
    setAgendamentoEditando(null);
    setDataSelecionada(null);
    setHorarioSelecionado("");
  };

  const abrirModalExcluir = (agendamento) => {
    setAgendamentoEditando(agendamento);
    setModalExcluir(true);
  };

  const fecharModalExcluir = () => {
    setModalExcluir(false);
    setAgendamentoEditando(null);
  };

  const handleSalvarEdicao = async () => {
    if (!dataSelecionada || !horarioSelecionado) {
      setNotificacao({
        visivel: true,
        tipo: "aviso",
        titulo: "Campos obrigatórios",
        mensagem: "Por favor, selecione uma data e um horário."
      });
      return;
    }

    setSalvando(true);
    try {
      const dataHoraCompleta = `${dataSelecionada}T${horarioSelecionado}:00`;
      
      await AgendamentoService.atualizarAgendamento(agendamentoEditando.id, {
        emailUsuario: agendamentoEditando.emailUsuario,
        codigoOrcamento: agendamentoEditando.codigoOrcamento,
        dataHora: dataHoraCompleta,
        status: agendamentoEditando.status
      });

      await carregarAgendamentos();
      setRecarregarDatas(prev => prev + 1);
      fecharModalEditar();
      setNotificacao({
        visivel: true,
        tipo: "sucesso",
        titulo: "Sucesso!",
        mensagem: "Agendamento atualizado com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      setNotificacao({
        visivel: true,
        tipo: "erro",
        titulo: "Erro",
        mensagem: error.message || "Erro ao atualizar agendamento. Tente novamente."
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async () => {
    setSalvando(true);
    try {
      await AgendamentoService.deletarAgendamento(agendamentoEditando.id);
      await carregarAgendamentos();
      setRecarregarDatas(prev => prev + 1);
      fecharModalExcluir();
      setExpandedId(null);
      setNotificacao({
        visivel: true,
        tipo: "sucesso",
        titulo: "Sucesso!",
        mensagem: "Agendamento excluído com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setNotificacao({
        visivel: true,
        tipo: "erro",
        titulo: "Erro",
        mensagem: error.message || "Erro ao excluir agendamento. Tente novamente."
      });
    } finally {
      setSalvando(false);
    }
  };

  const gerarHorariosDisponiveis = () => {
    return [
      "09:00", "10:00", "11:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00"
    ];
  };

  if (isLoading) {
    return (
      <div className="meus-agendamentos">
        <h2>Meus Agendamentos</h2>
        <div className="loading-container">
          <p>Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meus-agendamentos">
        <h2>Meus Agendamentos</h2>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={carregarAgendamentos} className="btn-retry">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (agendamentos.length === 0) {
    return (
      <div className="meus-agendamentos">
        <h2>Meus Agendamentos</h2>
        <div className="empty-state">
          <p>Você ainda não possui agendamentos.</p>
        </div>
      </div>
    );
  }

  if (expandedId) {
    const agendamentoSelecionado = agendamentos.find(a => a.id === expandedId);
    
    if (!agendamentoSelecionado) return null;

    return (
      <div className="meus-agendamentos">
        <div className="agendamento-detalhes-fullscreen">
          <div className="detalhes-container">
            <button 
              className="btn-voltar" 
              onClick={() => toggleExpand(null)}
            >
              ← 
            </button>

            <div className="status-header">
              <span className="status-label">Status:</span>
              <span className={`status-value ${getStatusClass(agendamentoSelecionado.status)}`}>
                {getStatusLabel(agendamentoSelecionado.status)}
              </span>
            </div>

            <div className="info-columns">
              <div className="info-column">
                <h3 className="column-title">Informações do agendamento</h3>
                
                <div className="info-row">
                  <span className="info-label-orange">Data:</span>
                  <span className="info-text">{formatarData(agendamentoSelecionado.dataHora)}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Horário:</span>
                  <span className="info-text">{formatarHora(agendamentoSelecionado.dataHora)}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Código do Orçamento:</span>
                  <span className="info-text">{agendamentoSelecionado.codigoOrcamento || 'Não informado'}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Email:</span>
                  <span className="info-text">{agendamentoSelecionado.emailUsuario || user.email}</span>
                </div>

                {agendamentoSelecionado.observacoes && (
                  <div className="info-block">
                    <span className="info-label-orange">Observações:</span>
                    <p className="info-text">{agendamentoSelecionado.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="info-column">
                <h3 className="column-title">Detalhes adicionais</h3>
                
                <div className="info-row">
                  <span className="info-label-orange">Data de criação:</span>
                  <span className="info-text">{formatarData(agendamentoSelecionado.dataHora)}</span>
                </div>

                <div className="info-row">
                  <span className="info-label-orange">Status do agendamento:</span>
                  <span className={`info-text info-orange ${getStatusClass(agendamentoSelecionado.status)}`}>
                    {getStatusLabel(agendamentoSelecionado.status)}
                  </span>
                </div>
              </div>
            </div>

            {(agendamentoSelecionado.status === 'PENDENTE') && (
              <div className="acoes-agendamento">
                <button 
                  className="btn-editar"
                  onClick={() => abrirModalEditar(agendamentoSelecionado)}
                >
                  Editar
                </button>
                <button 
                  className="btn-excluir"
                  onClick={() => abrirModalExcluir(agendamentoSelecionado)}
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {modalEditar && (
          <div className="modal-overlay-agendamento" onClick={fecharModalEditar}>
            <div className="modal-content-agendamento modal-editar" onClick={(e) => e.stopPropagation()}>
              <h3>Editar Agendamento</h3>
              
              <div className="form-edicao">
                <div className="calendario-horarios-container-modal">
                  <div className="campo-edicao calendario-group-modal">
                    <label>
                      Selecione a nova data:
                      <span className="required">*</span>
                    </label>
                    <Calendario
                      onDataSelecionada={(data) => {
                        setDataSelecionada(data);
                        setRecarregarDatas(prev => prev + 1);
                      }}
                      dataSelecionada={dataSelecionada}
                      recarregarDatas={recarregarDatas}
                    />
                  </div>

                  <div className="campo-edicao horarios-group-modal">
                    <label>
                      Horários Disponíveis:
                      <span className="required">*</span>
                    </label>
                    {dataSelecionada ? (
                      <div className="horarios-grid-modal">
                        {gerarHorariosDisponiveis().map((hora) => (
                          <button
                            key={hora}
                            type="button"
                            className={`horario-btn-modal ${
                              horarioSelecionado === hora ? 'selected' : ''
                            }`}
                            onClick={() => setHorarioSelecionado(hora)}
                          >
                            {hora}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="selecione-data-modal">
                        <p>Selecione uma data para ver os horários disponíveis</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-acoes">
                  <button 
                    onClick={handleSalvarEdicao} 
                    className="btn-salvar"
                    disabled={salvando || !dataSelecionada || !horarioSelecionado}
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

        {modalExcluir && (
          <div className="modal-overlay-agendamento" onClick={fecharModalExcluir}>
            <div className="modal-content-agendamento modal-confirmacao" onClick={(e) => e.stopPropagation()}>
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este agendamento?</p>
              <p className="aviso-exclusao">Esta ação não pode ser desfeita.</p>
              
              <div className="modal-acoes">
                <button 
                  onClick={handleExcluir} 
                  className="btn-confirmar-exclusao"
                  disabled={salvando}
                >
                  {salvando ? 'Excluindo...' : 'Sim, excluir'}
                </button>
                <button 
                  onClick={fecharModalExcluir} 
                  className="btn-cancelar"
                  disabled={salvando}
                >
                  Cancelar
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
    <div className="meus-agendamentos">
      <h2>Meus Agendamentos</h2>
      <div className="agendamentos-lista">
        {agendamentos.map((agendamento) => (
          <div
            key={agendamento.id}
            className="agendamento-card"
            onClick={() => toggleExpand(agendamento.id)}
          >
            <div className="agendamento-header-info">
              <h3>{formatarData(agendamento.dataHora)} - {formatarHora(agendamento.dataHora)}</h3>
              <span className={`status-badge ${getStatusClass(agendamento.status)}`}>
                {getStatusLabel(agendamento.status)}
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
