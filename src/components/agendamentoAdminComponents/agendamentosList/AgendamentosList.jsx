import React from 'react';
import './agendamentosList.css';

const AgendamentosList = ({
  items = [],
  loading = false,
  selectedId,
  onSelect,
  searchTerm,
  onSearchChange,
  filtrosAbertos,
  onToggleFiltros,
  filtros,
  onAtualizarFiltro,
  onLimparFiltros,
  onCriarAgendamento
}) => {
  
  const getStatusColor = (status) => {
    const colors = {
      'AGUARDANDO': 'yellow',
      'CONFIRMADO': 'green',
      'CANCELADO': 'red',
      'CONCLUIDO': 'blue',
      'PENDENTE': 'yellow'
    };
    return colors[status] || 'yellow';
  };

  const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Data não disponível';
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <aside className="agend-list">
      <h2 className="agend-list-title">Agendamentos</h2>
      <div className="agend-list-header">
        <div className="agend-search-wrapper">
          <span className="icon material-symbols-outlined" aria-hidden="true">search</span>
          <input
            className="agend-search"
            placeholder="Pesquisa"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Pesquisar agendamentos"
          />
        </div>
        <button className="btn-filter" onClick={onToggleFiltros} aria-label="Filtrar agendamentos">
          <span className="icon material-symbols-outlined" aria-hidden="true">filter_list</span>
        </button>
      </div>
      
      {filtrosAbertos && (
        <div className="agend-filtros-panel">
          <div className="agend-filtro-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filtros.status}
              onChange={e => onAtualizarFiltro('status', e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="CANCELADO">Cancelado</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>
          <button className="agend-btn-limpar-filtros" onClick={onLimparFiltros}>Limpar Filtros</button>
        </div>
      )}
      
      <div className="agend-list-items">
        {loading ? (
          <div className="agend-loading">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="agend-empty">Nenhum agendamento</div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className={`agend-item ${selectedId === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div className="agend-item-header">
                <div className="agend-item-left">
                  <span className={`status-dot ${getStatusColor(item.status)}`}></span>
                  <div className="agend-item-text">
                    <div className="agend-item-title">{item.nomeUsuario || item.emailUsuario}</div>
                    <div className="agend-item-sub">{formatarDataHora(item.dataHora)}</div>
                  </div>
                </div>
                <button
                  className="agend-item-info-btn"
                  aria-label="Ver informações"
                  onClick={e => { e.stopPropagation(); onSelect(item); }}
                >
                  <span className="icon material-symbols-outlined" aria-hidden="true">info</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="agend-list-footer">
        <button className="btn-criar-agendamento" onClick={onCriarAgendamento}>Criar agendamento</button>
      </div>
    </aside>
  );
};

export default AgendamentosList;
