import React from 'react';
import './cardEstoque.css';

export const CardEstoque = ({ 
    tipo, 
    item, 
    onSubmit, 
    onCancel, 
    onExcluir, 
    onEditar,
    onAtualizarQuantidade,
    qtdParaAtualizar,
    setQtdParaAtualizar,
    carregando = false,
    setItemSelecionado
}) => {
    const isFormulario = tipo === 'adicionar' || tipo === 'editar';
    const isInformacoes = tipo === 'informacoes';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    const handleInputChange = (field, value) => {
        if (setItemSelecionado && item) {
            setItemSelecionado({ ...item, [field]: value });
        }
    };

    if (isFormulario) {
        return (
            <div 
                className="card-estoque adicionar-estoque"
                id="card-add-estoque"
                role="dialog"
                aria-labelledby="form-title"
                aria-describedby="form-description"
            >
                <h2 id="form-title">
                    {tipo === 'adicionar' ? 'Adicionar novo item' : 'Editar informações'}
                </h2>
                <p id="form-description" className="sr-only">
                    {tipo === 'adicionar' 
                        ? 'Formulário para adicionar um novo item ao estoque' 
                        : 'Formulário para editar informações de um item existente'
                    }
                </p>
                
                <form onSubmit={handleSubmit} noValidate>
                    <div>
                        <label className="fonte-negrito" htmlFor="item-nome">
                            Nome<span className="campo-obrigatorio">*</span>
                        </label>
                        <input
                            type="text"
                            id="item-nome"
                            value={item?.nome || ''}
                            placeholder="Digite o nome do item"
                            required
                            minLength="2"
                            maxLength="100"
                            aria-required="true"
                            aria-describedby="nome-help"
                            disabled={carregando}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                        />
                        <span id="nome-help" className="sr-only">
                            Campo obrigatório. Digite o nome do material ou ferramenta.
                        </span>
                    </div>

                    <div>
                        <label className="fonte-negrito" htmlFor="item-quantidade">
                            Quantidade<span className="campo-obrigatorio">*</span>
                        </label>
                        <input
                            type="number"
                            id="item-quantidade"
                            value={item?.quantidade || ''}
                            placeholder="Digite a quantidade"
                            required
                            min="0"
                            max="999999"
                            step="1"
                            aria-required="true"
                            aria-describedby="quantidade-help"
                            disabled={carregando}
                            onChange={(e) => handleInputChange('quantidade', Number(e.target.value))}
                        />
                        <span id="quantidade-help" className="sr-only">
                            Campo obrigatório. Digite a quantidade atual em estoque.
                        </span>
                    </div>

                    <div className="input-duplo">
                        <div>
                            <label className="fonte-negrito" htmlFor="item-minimo">
                                Mínimo em estoque<span className="campo-obrigatorio">*</span>
                            </label>
                            <input
                                type="number"
                                id="item-minimo"
                                value={item?.minAviso || ''}
                                placeholder="Digite o número desejado"
                                min="0"
                                max="999999"
                                step="1"
                                required
                                aria-required="true"
                                aria-describedby="minimo-help"
                                disabled={carregando}
                                onChange={(e) => handleInputChange('minAviso', Number(e.target.value))}
                            />
                            <span id="minimo-help" className="sr-only">
                                Quantidade mínima antes de exibir alerta de estoque baixo.
                            </span>
                        </div>

                        <div>
                            <label className="fonte-negrito" htmlFor="item-unidade-medida">
                                Unidade de medida<span className="campo-obrigatorio">*</span>
                            </label>
                            <select 
                                id="item-unidade-medida" 
                                value={item?.unidadeMedida || ''} 
                                required
                                aria-required="true"
                                aria-describedby="unidade-help"
                                disabled={carregando}
                                onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
                            >
                                <option value="">Selecione uma opção</option>
                                <option value="Unidades">Unidades</option>
                                <option value="Litros">Litros</option>
                                <option value="Mililitros">Mililitros</option>
                                <option value="Folhas">Folhas</option>
                                <option value="Rolos">Rolos</option>
                                <option value="Kilogramas">Kilogramas</option>
                                <option value="Caixas">Caixas</option>
                            </select>
                            <span id="unidade-help" className="sr-only">
                                Campo obrigatório. Selecione como o item é medido.
                            </span>
                        </div>
                    </div>

                    <div className="botoes">
                        <button 
                            className="submit-button" 
                            type="submit"
                            disabled={carregando}
                            aria-label={tipo === "adicionar" 
                                ? "Adicionar item ao estoque" 
                                : "Salvar alterações do item"
                            }
                        >
                            {carregando 
                                ? (tipo === "adicionar" ? "Adicionando..." : "Salvando...")
                                : (tipo === "adicionar" ? "Adicionar ao estoque" : "Salvar alterações")
                            }
                        </button>
                        <button 
                            className="submit-button cancel-button" 
                            type="button"
                            onClick={onCancel}
                            disabled={carregando}
                            aria-label="Cancelar e fechar formulário"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (isInformacoes) {
        return (
            <div 
                id="card-informacoes-item"
                className="card-estoque informacoes-estoque"
                role="dialog"
                aria-labelledby="info-title"
                aria-describedby="info-description"
            >
                <h2 id="info-title">Atualizar item</h2>
                <p id="info-description" className="sr-only">
                    Informações detalhadas e opções para atualizar {item?.nome}
                </p>
                
                <div className="linha">
                    <div>
                        <p className="fonte-negrito">Nome do item</p>
                        <p>{item?.nome}</p>
                    </div>
                    <div>
                        <p className="fonte-negrito">Mínimo em estoque</p>
                        <p>{item?.minAviso == null ? "Não definido" : item.minAviso}</p>
                    </div>
                </div>

                <div className="linha">
                    <div>
                        <p className="fonte-negrito">Unidade de medida</p>
                        <p>{item?.unidadeMedida}</p>
                    </div>
                    <div>
                        <p className="fonte-negrito">Em estoque</p>
                        <p>{item?.quantidade}</p>
                    </div>
                </div>

                <div className="campos-quantidade">
                    <div>
                        <label className="fonte-negrito" htmlFor="inputAtualizarQtd">
                            Quantidade para adicionar/remover
                        </label>
                        <input
                            type="number"
                            placeholder="Digite a quantidade desejada"
                            id="inputAtualizarQtd"
                            min="1"
                            aria-describedby="quantidade-update-help"
                            onChange={(e) => setQtdParaAtualizar && setQtdParaAtualizar(e.target.value)}
                        />
                        <span id="quantidade-update-help" className="sr-only">
                            Digite a quantidade que deseja adicionar ou remover do estoque atual.
                        </span>
                    </div>

                    <div className="botoes" role="group" aria-label="Ações de quantidade">
                        <button 
                            className="submit-button adicionar-qtd-button" 
                            onClick={() => onAtualizarQuantidade && onAtualizarQuantidade("soma")}
                            aria-label={`Adicionar ${qtdParaAtualizar || 0} unidades ao estoque de ${item?.nome || 'item'}`}
                            disabled={!qtdParaAtualizar || qtdParaAtualizar <= 0}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">
                                add_2
                            </span>
                            <span className="sr-only">Adicionar ao estoque</span>
                        </button>
                        <button 
                            className="submit-button remover-qtd-button" 
                            onClick={() => onAtualizarQuantidade && onAtualizarQuantidade("subtrair")}
                            aria-label={`Remover ${qtdParaAtualizar || 0} unidades do estoque de ${item?.nome || 'item'}`}
                            disabled={!qtdParaAtualizar || qtdParaAtualizar <= 0}
                        >
                            <span className="material-symbols-outlined" aria-hidden="true">
                                check_indeterminate_small
                            </span>
                            <span className="sr-only">Remover do estoque</span>
                        </button>
                    </div>
                </div>

                <div className="botoes" role="group" aria-label="Ações do item">
                    <button 
                        className="submit-button" 
                        onClick={onEditar}
                        aria-label={`Editar informações de ${item?.nome}`}
                    >
                        Editar informações
                    </button>
                    <button 
                        className="submit-button excluir-button" 
                        onClick={onExcluir}
                        disabled={carregando}
                        aria-label={`Excluir ${item?.nome} do estoque`}
                        aria-describedby="delete-warning"
                    >
                        Excluir item
                    </button>
                    <span id="delete-warning" className="sr-only">
                        Atenção: Esta ação não pode ser desfeita.
                    </span>
                </div>
            </div>
        );
    }

    return null;
};