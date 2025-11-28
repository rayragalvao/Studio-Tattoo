import React from 'react';
import './orcamentosList.css';

const AdminOrcamentosList = ({ 
  items = [], 
  loading = false, 
  onSelect, 
  selectedId,
  searchTerm = '',
  onSearchChange,
  onToggleFiltros,
  filtrosAbertos = false,
  filtros = { status: 'Todos' },
  onAtualizarFiltro,
  onLimparFiltros,
  onCriarOrcamento
}) => {
  return (
    <aside className="orc-list">
      <h2 className="orc-list-title">Orçamentos</h2>
      <div className="orc-list-header">
        <div className="orc-search-wrapper">
          <span 
            className="icon material-symbols-outlined"
            aria-hidden="true"
          >
            search
          </span>
          <input 
            className="orc-search" 
            placeholder="Pesquisa" 
            aria-label="Pesquisar orçamentos"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          className="btn-filter" 
          aria-label="Filtrar orçamentos"
          onClick={onToggleFiltros}
        >
          <span 
            className="icon material-symbols-outlined"
            aria-hidden="true"
          >
            filter_list
          </span>
        </button>
      </div>

      {filtrosAbertos && (
        <div className="orc-filtros-panel">
          <div className="orc-filtro-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter"
              value={filtros.status}
              onChange={(e) => onAtualizarFiltro('status', e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="respondido">Respondido</option>
            </select>
          </div>
          <button className="orc-btn-limpar-filtros" onClick={onLimparFiltros}>
            Limpar Filtros
          </button>
        </div>
      )}

      <div className="orc-list-items">
        {loading ? (
          <div className="orc-loading">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="orc-empty">Nenhum orçamento</div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className={`orc-item ${selectedId === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
            >
              <div className="orc-item-header">
                <div className="orc-item-left">
                  <span className={`status-dot ${item.status === 'respondido' ? 'green' : 'yellow'}`}></span>
                  <div className="orc-item-text">
                    <div className="orc-item-title">{item.nome} - {item.status}</div>
                    <div className="orc-item-sub">{item.email}</div>
                  </div>
                </div>
                <button
                  className="orc-item-info-btn"
                  aria-label="Ver informações"
                  onClick={(e) => { e.stopPropagation(); onSelect(item); }}
                >
                  <span 
                    className="icon material-symbols-outlined"
                    aria-hidden="true"
                  >
                    info
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="orc-list-footer">
        <button className="btn-criar-orcamento" onClick={onCriarOrcamento}>Criar orçamento</button>
      </div>
    </aside>
  );
};

export default AdminOrcamentosList;
