import React from 'react';
import './paginacaoEstoque.css';

export const PaginacaoEstoque = ({
    paginaAtual,
    totalPaginas,
    totalItens,
    tamanhoPagina,
    onMudarPagina,
    onMudarTamanhoPagina,
    carregando = false
}) => {
    if (totalPaginas <= 1 && totalItens <= tamanhoPagina) return null;

    const inicio = paginaAtual * tamanhoPagina + 1;
    const fim = Math.min((paginaAtual + 1) * tamanhoPagina, totalItens);

    const gerarPaginas = () => {
        const paginas = [];
        const delta = 1;
        const esquerda = paginaAtual - delta;
        const direita = paginaAtual + delta;

        for (let i = 0; i < totalPaginas; i++) {
            if (i === 0 || i === totalPaginas - 1 || (i >= esquerda && i <= direita)) {
                paginas.push(i);
            }
        }

        const comEllipsis = [];
        let anterior = null;
        for (const pagina of paginas) {
            if (anterior !== null && pagina - anterior > 1) {
                comEllipsis.push('...');
            }
            comEllipsis.push(pagina);
            anterior = pagina;
        }
        return comEllipsis;
    };

    return (
        <div className="paginacao-container" role="navigation" aria-label="Paginação do estoque">

            <div className="paginacao-tamanho">
                <label htmlFor="tamanho-pagina">Itens</label>
                <select
                    id="tamanho-pagina"
                    value={tamanhoPagina}
                    onChange={(e) => onMudarTamanhoPagina(Number(e.target.value))}
                    disabled={carregando}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="paginacao-controles">
                <button
                    className="paginacao-btn"
                    onClick={() => onMudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 0 || carregando}
                    aria-label="Página anterior"
                >
                    <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                </button>

                {gerarPaginas().map((item, index) =>
                    item === '...' ? (
                        <span key={`ellipsis-${index}`} className="paginacao-ellipsis" aria-hidden="true">
                            ...
                        </span>
                    ) : (
                        <button
                            key={item}
                            className={`paginacao-btn paginacao-numero ${item === paginaAtual ? 'ativo' : ''}`}
                            onClick={() => onMudarPagina(item)}
                            disabled={carregando}
                            aria-label={`Página ${item + 1}`}
                            aria-current={item === paginaAtual ? 'page' : undefined}
                        >
                            {item + 1}
                        </button>
                    )
                )}

                <button
                    className="paginacao-btn"
                    onClick={() => onMudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas - 1 || carregando}
                    aria-label="Próxima página"
                >
                    <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </button>
            </div>

            <p className="paginacao-info" aria-live="polite">
                {inicio}–{fim} de <span className="fonte-negrito">{totalItens}</span>
            </p>

        </div>
    );
};
