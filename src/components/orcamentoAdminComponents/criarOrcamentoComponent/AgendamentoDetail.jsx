import React from 'react';
import './agendamentoDetail.css';

const AgendamentoDetail = ({ agendamento, onConfirmar, onCancelar }) => {
  if (!agendamento) return null;

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Não definida';
    const dt = new Date(dataHora);
    const dia = String(dt.getDate()).padStart(2, '0');
    const mes = String(dt.getMonth() + 1).padStart(2, '0');
    const ano = dt.getFullYear();
    const hora = String(dt.getHours()).padStart(2, '0');
    const min = String(dt.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${min}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'AGUARDANDO': 'Aguardando confirmação',
      'CONFIRMADO': 'Confirmado',
      'CONCLUIDO': 'Concluído',
      'PENDENTE': 'Pendente',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    if (status === 'CONFIRMADO') return 'status-confirmado';
    if (status === 'CONCLUIDO') return 'status-confirmado';
    if (status === 'CANCELADO') return 'status-cancelado';
    return 'status-aguardando';
  };

  return (
    <section className="agend-detail">
      <div className={`agend-detail-status ${getStatusClass(agendamento.status)}`}>
        <span className="status-label">Status:</span>
        <span className="status-value">{getStatusLabel(agendamento.status)}</span>
      </div>

      <div className="agend-detail-section">
        <h3>Informações do agendamento</h3>
        
        <div className="agend-detail-row">
          <span className="label-orange">Cliente:</span>
          <span className="value">{agendamento.nomeUsuario || agendamento.emailUsuario || 'Não informado'}</span>
        </div>

        <div className="agend-detail-row">
          <span className="label-orange">Tempo estimado:</span>
          <span className="value">{agendamento.orcamento?.tempo || 'Não informado'}</span>
        </div>

        <div className="agend-detail-row">
          <span className="label-orange">Valor:</span>
          <span className="value">{agendamento.orcamento?.valor ? `R$ ${parseFloat(agendamento.orcamento.valor).toFixed(2).replace('.', ',')}` : 'Não informado'}</span>
        </div>

        <div className="agend-detail-row">
          <span className="label-orange">Data/Horário:</span>
          <span className="value">{formatarDataHora(agendamento.dataHora)}</span>
        </div>
      </div>

      <div className="agend-detail-section">
        <h3>Informações do orçamento</h3>
        
        <div className="agend-detail-row">
          <span className="label-orange">Tamanho:</span>
          <span className="value">{agendamento.orcamento?.tamanho ? `${agendamento.orcamento.tamanho}cm` : 'Não informado'}</span>
        </div>

        <div className="agend-detail-row">
          <span className="label-orange">Local do corpo:</span>
          <span className="value">{agendamento.orcamento?.localCorpo || 'Não informado'}</span>
        </div>

        <div className="agend-detail-block">
          <span className="label-orange">Descrição:</span>
          <p className="value-block">{agendamento.orcamento?.ideia || 'Não informada'}</p>
        </div>

        <div className="agend-detail-block">
          <span className="label-orange">Referência:</span>
          {agendamento.orcamento?.imagemReferencia && agendamento.orcamento.imagemReferencia.length > 0 ? (
            <div className="referencias-grid">
              {agendamento.orcamento.imagemReferencia.map((img, idx) => {
                const imgPath = img.replace(/\\/g, '/');
                const imgUrl = `http://localhost:8080/${imgPath}`;
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

      <div className="agend-detail-actions">
        {(agendamento.status === 'AGUARDANDO' || agendamento.status === 'PENDENTE') && (
          <button className="btn-primary" onClick={() => onConfirmar(agendamento.id)}>
            Confirmar agendamento
          </button>
        )}
        {agendamento.status !== 'CANCELADO' && (
          <button className="btn-secondary" onClick={() => onCancelar(agendamento.id)}>
            Cancelar agendamento
          </button>
        )}
      </div>
    </section>
  );
};

export default AgendamentoDetail;
