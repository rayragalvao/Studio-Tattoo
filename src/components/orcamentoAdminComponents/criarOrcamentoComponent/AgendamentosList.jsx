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
  const formatarDataHora = (dataHora) => {
    if (!dataHora) return 'Data não definida';
    const dt = new Date(dataHora);
    const dia = String(dt.getDate()).padStart(2, '0');
    const mes = String(dt.getMonth() + 1).padStart(2, '0');
    const hora = String(dt.getHours()).padStart(2, '0');
    const min = String(dt.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} - ${hora}:${min}`;
  };

  return (
    <aside className="agend-list">
      <h2 className="agend-list-title">Agendamentos</h2>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '-4px',
        marginBottom: '12px',
        display: 'flex',
        gap: '12px',
        paddingLeft: '4px',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffc107', display: 'inline-block' }}></span>
          Aguardando
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block' }}></span>
          Confirmado
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2196f3', display: 'inline-block' }}></span>
          Concluído
        </span>
      </div>

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
        <div className="agend-filtros">
          <div className="filtro-group">
            <label>Status:</label>
            <select value={filtros.status} onChange={e => onAtualizarFiltro('status', e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="AGUARDANDO">Aguardando</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="PENDENTE">Pendente</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <button className="btn-limpar-filtros" onClick={onLimparFiltros}>Limpar</button>
        </div>
      )}

      <div className="agend-list-body">
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
                  <span className={`status-dot ${item.status === 'CONFIRMADO' ? 'green' : item.status === 'CONCLUIDO' ? 'blue' : 'yellow'}`}></span>
                  <div className="agend-item-text">
                    <div className="agend-item-title">{item.emailUsuario || 'Email não informado'}</div>
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
