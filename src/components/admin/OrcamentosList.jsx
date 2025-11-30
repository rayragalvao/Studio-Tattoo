import React from 'react';
import './orcamentosList.css';

const OrcamentosList = ({
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
  onCriarOrcamento
}) => {
  return (
    <aside className="orc-list">
      <h2 className="orc-list-title">Orçamentos</h2>
      <div className="orc-list-header">
        <div className="orc-search-wrapper">
          <span className="icon material-symbols-outlined" aria-hidden="true">search</span>
          <input
            className="orc-search"
            placeholder="Pesquisa"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Pesquisar orçamentos"
          />
        </div>
        <button className="btn-filter" onClick={onToggleFiltros} aria-label="Filtrar orçamentos">
          <span className="icon material-symbols-outlined" aria-hidden="true">filter_list</span>
        </button>
      </div>
      {filtrosAbertos && (
        <div className="orc-filtros-panel">
          <div className="orc-filtro-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filtros.status}
              onChange={e => onAtualizarFiltro('status', e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Respondido</option>
            </select>
          </div>
          <button className="orc-btn-limpar-filtros" onClick={onLimparFiltros}>Limpar Filtros</button>
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
              key={item.codigo_orcamento || item.codigoOrcamento || item.id}
              className={`orc-item ${selectedId === (item.codigo_orcamento || item.codigoOrcamento || item.id) ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div className="orc-item-header">
                <div className="orc-item-left">
                  <span className={`status-dot ${item.status === 'APROVADO' ? 'green' : 'yellow'}`}></span>
                  <div className="orc-item-text">
                    <div className="orc-item-title">{item.nome}</div>
                    <div className="orc-item-sub">{item.email}</div>
                  </div>
                </div>
                <button
                  className="orc-item-info-btn"
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
      <div className="orc-list-footer">
        <button className="btn-criar-orcamento" onClick={onCriarOrcamento}>Criar orçamento</button>
      </div>
    </aside>
  );
};

export default OrcamentosList;
