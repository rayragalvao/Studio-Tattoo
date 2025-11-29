import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import AgendamentoService from "../../../services/AgendamentoService";
import "./meusAgendamentos.css";

export const MeusAgendamentos = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarAgendamentos();
  }, [user]);

  const carregarAgendamentos = async () => {
    if (!user || !user.id) {
      console.log("Usuário não está logado ou ID não disponível:", user);
      return;
    }

    console.log("Carregando agendamentos para o usuário ID:", user.id);
    setIsLoading(true);
    setError(null);

    try {
      const dados = await AgendamentoService.buscarAgendamentosUsuario(user.id);
      console.log("Agendamentos recebidos do backend:", dados);
      setAgendamentos(dados || []);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      console.error("Detalhes do erro:", error.response?.data);
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
          </div>
        </div>
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
            <div className="agendamento-header">
              <div className="agendamento-header-info">
                <h3>{formatarData(agendamento.dataHora)} - {formatarHora(agendamento.dataHora)}</h3>
                <span className={`status-badge ${getStatusClass(agendamento.status)}`}>
                  {getStatusLabel(agendamento.status)}
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
