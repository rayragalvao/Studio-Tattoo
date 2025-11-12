import React from 'react';
import './painelFiltros.css';

export const PainelFiltros = ({ 
    filtrosAbertos,
    filtros,
    onAtualizarFiltro,
    onAplicarFiltros,
    onLimparFiltros,
    onFechar
}) => {
    if (!filtrosAbertos) return null;

    return (
        <div 
            className="painel-filtros"
            id="painel-filtros"
            role="region"
            aria-label="Painel de filtros do estoque"
        >
            <div className="filtro-grupo">
                <label 
                    className="fonte-negrito"
                    htmlFor="filtro-unidade-medida"
                >
                    Unidade de Medida
                </label>
                <select 
                    id="filtro-unidade-medida"
                    value={filtros.unidadeMedida}
                    onChange={(e) => onAtualizarFiltro('unidadeMedida', e.target.value)}
                    aria-label="Filtrar por unidade de medida"
                >
                    <option value="Todas">Todas</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Litros">Litros</option>
                    <option value="Mililitros">Mililitros</option>
                    <option value="Folhas">Folhas</option>
                    <option value="Rolos">Rolos</option>
                    <option value="Kilogramas">Kilogramas</option>
                    <option value="Caixas">Caixas</option>
                </select>
            </div>

            <div className="filtro-grupo">
                <label 
                    className="fonte-negrito"
                    htmlFor="filtro-status-estoque"
                >
                    Status do Estoque
                </label>
                <select 
                    id="filtro-status-estoque"
                    value={filtros.alertaEstoque}
                    onChange={(e) => onAtualizarFiltro('alertaEstoque', e.target.value)}
                    aria-label="Filtrar por status do estoque"
                >
                    <option value="Todos">Todos</option>
                    <option value="alerta">Estoque Baixo</option>
                    <option value="ok">Estoque OK</option>
                </select>
            </div>

            <div className="filtro-grupo">
                <label 
                    className="fonte-negrito"
                    htmlFor="filtro-ordenacao"
                >
                    Ordenar Por
                </label>
                <select 
                    id="filtro-ordenacao"
                    value={filtros.ordenarPor}
                    onChange={(e) => onAtualizarFiltro('ordenarPor', e.target.value)}
                    aria-label="Ordenar lista de itens"
                >
                    <option value="Nome">Nome (A-Z)</option>
                    <option value="Quantidade">Quantidade (Maior)</option>
                    <option value="Alerta">Alertas Primeiro</option>
                </select>
            </div>

            <div className="filtro-acoes">
                <button 
                    className="btn-filtrar"
                    onClick={() => {
                        onAplicarFiltros();
                        onFechar();
                    }}
                    aria-label="Aplicar filtros selecionados e fechar painel"
                >
                    Aplicar Filtros
                </button>

                <button 
                    className="btn-limpar-filtros"
                    onClick={onLimparFiltros}
                    aria-label="Remover todos os filtros aplicados"
                >
                    Limpar Filtros
                </button>
            </div>
        </div>
    );
};