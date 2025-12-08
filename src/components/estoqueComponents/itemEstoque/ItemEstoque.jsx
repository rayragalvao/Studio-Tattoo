import React from 'react';
import './itemEstoque.css';

export const ItemEstoque = ({ 
    item, 
    onMostrarInformacoes, 
    filtrosAbertos = false 
}) => {
    return (    
        <div 
            className={`item ${item.quantidade <= item.minAviso ? "item-alerta" : ""}`}
            role="listitem"
        >
            <div>
                <p className="fonte-negrito">{item.nome}</p>
                <p>
                    <span className="sr-only">Quantidade em estoque: </span>
                    {item.quantidade} {item.unidadeMedida}
                    {item.quantidade <= item.minAviso && (
                        <span className="sr-only"> - Estoque baixo</span>
                    )}
                </p>
            </div>
            <button 
                className="bt-info" 
                onClick={() => onMostrarInformacoes(item)} 
                disabled={filtrosAbertos}
                aria-label={`Ver informações detalhadas de ${item.nome}`}
                title={`Ver detalhes de ${item.nome}`}
            >
                <span 
                    className="icon material-symbols-outlined"
                    aria-hidden="true"
                >
                    info
                </span>
            </button>
        </div>
    );
};