/* eslint-disable no-unused-vars */
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notificacao from "../components/Notificacao";
import CardResposta from "../components/CardResposta";
import "../styles/global.css";
import "../styles/estoque.css";
import React, { useEffect, useState, useCallback } from "react";
import api from "../service/api";

const Estoque = () => {
    const url = "/estoque";
    const [adicionarEstoque, setAdicionarEstoque] = useState(false);
    const [informacoesItem, setInformacoesItem] = useState(false);
    const [itensEstoque, setItensEstoque] = useState([]);
    const [itensEstoqueExibir, setItensEstoqueExibir] = useState(itensEstoque);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [qtdParaAtualizar, setQtdParaAtualizar] = useState(0);
    const [tipoOperacao, setTipoOperacao] = useState("adicionar");

    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState({
        unidadeMedida: "Todas",
        alertaEstoque: "Todos",
        ordenarPor: "nome"
    });
    const [notificacao, setNotificacao] = useState({
        visivel: false,
        tipo: 'sucesso',
        titulo: '',
        mensagem: ''
    });

    const [carregando, setCarregando] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState(false);
    const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);

    useEffect(() => {
        if (itensEstoque.length <= 0) {
            setCarregando(true);
        }
        api.get(url)
            .then(response => {
                setItensEstoque(response.data);
                setItensEstoqueExibir(response.data);

                console.log(response.data);
                setCarregando(false);

                let itensEstoqueBaixo = response.data.filter(item =>
                    item.quantidade <= (item.minAviso || 0)
                );
                if (itensEstoqueBaixo.length > 0) {
                    mostrarNotificacao(
                        'aviso',
                        'Estoque Baixo',
                        itensEstoqueBaixo.length + ' itens estão com estoque baixo.'
                    );
                }
            })
            .catch(error => {
                setCarregando(false);
                console.error('Erro ao buscar itens de estoque:', error);
            });
    }, [itensEstoque.length]);

    function mostrarNotificacao(tipo, titulo, mensagem) {
        setNotificacao({
            visivel: true,
            tipo,
            titulo,
            mensagem
        });
    }

    function fecharNotificacao() {
        setNotificacao(prev => ({
            ...prev,
            visivel: false
        }));
    };

    function validarFormulario() {
        const erros = [];
        
        if (!itemSelecionado.nome?.trim()) {
            erros.push('Nome é obrigatório');
        }
        
        if (!itemSelecionado.quantidade || itemSelecionado.quantidade < 0) {
            erros.push('Quantidade deve ser um número positivo');
        }
        
        if (!itemSelecionado.minAviso && itemSelecionado.minAviso !== 0) {
            erros.push('Mínimo em estoque é obrigatório');
        }
        
        if (itemSelecionado.minAviso < 0) {
            erros.push('Mínimo em estoque deve ser um número positivo');
        }
        
        if (!itemSelecionado.unidadeMedida) {
            erros.push('Unidade de medida é obrigatória');
        }
        
        return erros;
    }

    function cadastrarItem() {
        const erros = validarFormulario();
        
        if (erros.length > 0) {
            mostrarNotificacao(
                'erro',
                'Dados Inválidos',
                erros.join(' | ')
            );
            return;
        }

        console.log("Item a ser cadastrado:", itemSelecionado);
        setCarregando(true);
        
        api.post(url, itemSelecionado)
            .then(response => {
                console.log("Item cadastrado com sucesso:", response.data);

                mostrarNotificacao(
                    'sucesso', 
                    'Item Cadastrado!', 
                    `${itemSelecionado.nome} foi adicionado ao estoque.`
                );

                setItensEstoque([...itensEstoque, response.data]);
                setItensEstoqueExibir([...itensEstoqueExibir, response.data]);
                
                // Fechar formulário e limpar dados
                setAdicionarEstoque(false);
                setItemSelecionado(null);
            })
            .catch(error => {
                console.error('Erro ao cadastrar item:', error);

                mostrarNotificacao(
                    'erro', 
                    'Erro ao Cadastrar', 
                    error.response?.data?.message || 'Erro interno do servidor'
                );
            })
            .finally(() => {
                setCarregando(false);
            });
    }

    function mostrarConfirmacaoExcluir() {
        setMostrarConfirmacaoExclusao(true);
    }

    function excluirItem() {
        console.log("Item a ser excluído:", itemSelecionado);
        setCarregando(true);
        
        api.delete(`${url}/${itemSelecionado.id}`)
            .then(response => {
                console.log("Item excluído com sucesso:", response.data);
                const itensAtualizados = itensEstoque.filter(item => item.id !== itemSelecionado.id);
                setItensEstoque(itensAtualizados);
                setItensEstoqueExibir(itensAtualizados);

                mostrarNotificacao(
                    'sucesso',
                    'Item Excluído',
                    `${itemSelecionado.nome} foi removido do estoque.`
                );

                // Fechar modais e limpar
                setMostrarConfirmacaoExclusao(false);
                setInformacoesItem(false);
                setItemSelecionado(null);
            })
            .catch(error => {
                console.error('Erro ao excluir item:', error);
                mostrarNotificacao(
                    'erro',
                    'Erro ao Excluir',
                    error.response?.data?.message || 'Erro interno do servidor'
                );
            })
            .finally(() => {
                setCarregando(false);
            });
    }

    function cancelarExclusao() {
        setMostrarConfirmacaoExclusao(false);
    }

    function atualizarItem(){
        const erros = validarFormulario();
        
        if (erros.length > 0) {
            mostrarNotificacao(
                'erro',
                'Dados Inválidos',
                erros.join('. ')
            );
            return;
        }

        console.log("Item a ser atualizado:", itemSelecionado);
        setCarregando(true);
        
        api.put(`${url}/${itemSelecionado.id}`, itemSelecionado)
            .then(response => {
                console.log("Item atualizado com sucesso:", response.data);
                const itensAtualizados = itensEstoque.map(item =>
                    item.id === itemSelecionado.id ? response.data : item
                );
                setItensEstoque(itensAtualizados);
                setItensEstoqueExibir(itensAtualizados);

                mostrarNotificacao(
                    'sucesso',
                    'Item Atualizado',
                    'As informações do item foram atualizadas com sucesso.'
                );

                setAdicionarEstoque(false);
                setItemSelecionado(null);
            })
            .catch(error => {
                console.error('Erro ao atualizar item:', error);
                mostrarNotificacao(
                    'erro',
                    'Erro ao Atualizar',
                    error.response?.data?.message || 'Erro interno do servidor'
                );
            })
            .finally(() => {
                setCarregando(false);
            });
    }

    function atualizarQuantidade(operacao){
        let qtdAtualizada = Number(itemSelecionado.quantidade);
        let qtdParaAdicionar = Number(qtdParaAtualizar);

        if (isNaN(qtdParaAdicionar) || qtdParaAdicionar <= 0) {
            mostrarNotificacao(
                'erro',
                'Quantidade Inválida',
                'Por favor, insira uma quantidade válida para atualizar.'
            );
            return;
        }

        if (operacao === "soma") {
            qtdAtualizada = qtdAtualizada + qtdParaAdicionar;
        } else if (operacao === "subtrair") {
            if (qtdAtualizada < qtdParaAdicionar) {
                alert("Quantidade insuficiente em estoque");
                return;
            }
            qtdAtualizada = qtdAtualizada - qtdParaAdicionar;
        }

        console.log("Quantidade atualizada para:", qtdAtualizada);

        api.patch(`${url}/${itemSelecionado.id}/${qtdAtualizada}`)
            .then(response => {
                console.log("Quantidade atualizada com sucesso:", response.data);
                
                const itensAtualizados = itensEstoque.map(item =>
                    item.id === itemSelecionado.id ? { ...item, quantidade: qtdAtualizada } : item
                );
                setItensEstoque(itensAtualizados);
                setItensEstoqueExibir(itensAtualizados);

                mostrarNotificacao(
                    'sucesso',
                    'Estoque Atualizado',
                    'A quantidade de itens foi atualizada com sucesso.'
                );

                setQtdParaAtualizar(0);
                setItemSelecionado(response.data);
                document.getElementById('inputAtualizarQtd').value = '';
            })
            .catch(error => {
                console.error('Erro ao atualizar quantidade do item:', error);
                mostrarNotificacao(
                    'erro',
                    'Erro ao Atualizar',
                    error.response.data.message
                );
            });
    }

    function toggleFiltros() {
        setFiltrosAbertos(!filtrosAbertos);
    }

    const aplicarFiltros = useCallback(() => {
        let itensFiltrados = [...itensEstoque];

        // Filtro por texto
        const pesquisa = document.getElementById('pesquisa')?.value || '';
        if (pesquisa) {
            itensFiltrados = itensFiltrados.filter(item =>
                item.nome.toLowerCase().includes(pesquisa.toLowerCase())
            );
        }

        // Filtro por unidade de medida
        if (filtros.unidadeMedida !== "Todas") {
            itensFiltrados = itensFiltrados.filter(item =>
                item.unidadeMedida?.toLowerCase() === filtros.unidadeMedida.toLowerCase()
            );
        }

        // Filtro por alerta de estoque
        if (filtros.alertaEstoque === "alerta") {
            itensFiltrados = itensFiltrados.filter(item =>
                item.quantidade <= (item.minAviso || 0)
            );
        } else if (filtros.alertaEstoque === "ok") {
            itensFiltrados = itensFiltrados.filter(item =>
                item.quantidade >= (item.minAviso || 0)
            );
        } 

        // Ordenação
        itensFiltrados.sort((a, b) => {
            switch (filtros.ordenarPor) {
                case "nome":
                    return a.nome.localeCompare(b.nome);
                case "quantidade":
                    return b.quantidade - a.quantidade;
                case "alerta":
                    return (a.quantidade < a.minAviso) ? -1 : 1;
                default:
                    return 0;
            }
        });

        if (JSON.stringify(itensFiltrados) !== JSON.stringify(itensEstoqueExibir)) {
            setItensEstoqueExibir(itensFiltrados);
        }

        if (filtros.unidadeMedida !== "Todas" || filtros.alertaEstoque !== "Todos") {
            setFiltrosAtivos(true);
            return;
        } else {
            setFiltrosAtivos(false);
        }
    }, [itensEstoque, filtros, itensEstoqueExibir]);

    // Aplicar filtros sempre que mudarem
    useEffect(() => {
        if (itensEstoque.length > 0) {
            aplicarFiltros();
        }
    }, [itensEstoque, filtros, aplicarFiltros]);

    function atualizarFiltro(campo, valor) {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    function limparFiltros() {
        setFiltros({
            unidadeMedida: "Todas",
            alertaEstoque: "Todos",
            ordenarPor: "nome"
        });
        document.getElementById('pesquisa').value = '';
        setItensEstoqueExibir(itensEstoque);

        setFiltrosAtivos(false);
    }

    function mostrarAdicionarEstoque(tipo) {
        setTipoOperacao(tipo);

        if (tipo === "adicionar") {
            setItemSelecionado({
                nome: '',
                quantidade: 0,
                minAviso: 0,
                unidadeMedida: 'Unidades'
            });
        }

        if (informacoesItem) {
            setInformacoesItem(false);
        }

        setTimeout(() => {
            const cardAddEstoque = document.getElementById('card-add-estoque');
            if (cardAddEstoque) {
                cardAddEstoque.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 150);
        setAdicionarEstoque(true);
    }

    function cancelarAdicionarEstoque() {
        setItemSelecionado(null);
        setAdicionarEstoque(false);
    }

    function mostrarInformacoesItem(item) {
        if (adicionarEstoque) {
            setAdicionarEstoque(false);
        }

        setInformacoesItem(true);
        setItemSelecionado(item);

        setTimeout(() => {
            const cardInformacoes = document.getElementById('card-informacoes-item');
            if (cardInformacoes) {
                cardInformacoes.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }, 150);
    }

    function fecharInformacoesItem() {
        setItemSelecionado(null);
        setInformacoesItem(false);
    }

    // Função para navegação por teclado
    function handleKeyDown(event, action, ...args) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action(...args);
        }
    }

    // Função para fechar modais com ESC
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                if (mostrarConfirmacaoExclusao) {
                    cancelarExclusao();
                } else if (adicionarEstoque) {
                    cancelarAdicionarEstoque();
                } else if (informacoesItem) {
                    fecharInformacoesItem();
                } else if (filtrosAbertos) {
                    setFiltrosAbertos(false);
                }
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [adicionarEstoque, informacoesItem, filtrosAbertos, mostrarConfirmacaoExclusao]);

  return (
    <>
        <Notificacao
            tipo={notificacao.tipo}
            titulo={notificacao.titulo}
            mensagem={notificacao.mensagem}
            visivel={notificacao.visivel}
            onFechar={fecharNotificacao}
            duracao={4000}
        />
      <Navbar />
        <h1 className="h1-estoque"> Estoque </h1>
        <div className="section-estoque">
            <div className="card-estoque pesquisa-estoque">
                <div className="div-barra-pesquisa">
                    <div className="input-barra-pesquisa">
                        <input
                            type="text"
                            placeholder="Pesquisa"
                            className="input-estoque"
                            id="pesquisa"
                            aria-label="Pesquisar itens do estoque"
                            aria-describedby="search-help"
                            onChange={(e) => aplicarFiltros()}
                        />
                        <span 
                            className="icon material-symbols-outlined"
                            aria-hidden="true"
                        >
                            search
                        </span>
                        <span id="search-help" className="sr-only">
                            Digite o nome do item para filtrar a lista
                        </span>
                    </div>
                
                    <button 
                        className={`bt-filtro ${filtrosAbertos ? 'ativo' : ''}`}
                        onClick={toggleFiltros}
                        aria-label={filtrosAbertos ? "Fechar painel de filtros" : "Abrir painel de filtros"}
                        aria-expanded={filtrosAbertos}
                        aria-controls="painel-filtros"
                    >
                        <span 
                            className="icon material-symbols-outlined"
                            aria-hidden="true"
                        >
                            filter_list
                        </span>
                    </button>
                </div>

                {/* Painel de Filtros */}
                { filtrosAbertos && (
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
                                onChange={(e) => atualizarFiltro('unidadeMedida', e.target.value)}
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
                                onChange={(e) => atualizarFiltro('alertaEstoque', e.target.value)}
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
                                onChange={(e) => atualizarFiltro('ordenarPor', e.target.value)}
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
                                    aplicarFiltros();
                                    setFiltrosAbertos(false);
                                }}
                                aria-label="Aplicar filtros selecionados e fechar painel"
                            >
                                Aplicar Filtros
                            </button>

                            <button 
                                className="btn-limpar-filtros"
                                onClick={limparFiltros}
                                aria-label="Remover todos os filtros aplicados"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                )}

                
                {/* Indicador de filtros ativos */}
                <div className="filtros-ativos">
                    { filtrosAtivos && (
                        <>
                            <span className="fonte-negrito">Filtros ativos: </span>
                            {filtros.unidadeMedida !== "Todas" && (
                                <span className="tag-filtro">{filtros.unidadeMedida}</span>
                            )}
                            {filtros.unidadeMedida !== "Todas" && filtros.alertaEstoque !== "Todos" && (
                                <span className="tag-filtro-separador"> | </span>
                            )}
                            {filtros.alertaEstoque !== "Todos" && (
                                <span className="tag-filtro">
                                    {filtros.alertaEstoque === "alerta" ? "Estoque Baixo" : "Estoque OK"}
                                </span>
                            )}
                        </>
                    )}
                </div>
                { carregando ? (
                    <div className="carregando">
                        Carregando materiais...
                    </div>
                ) : itensEstoqueExibir.length === 0 ? (
                    <div className="nenhum-item">
                        Nenhum item encontrado.
                    </div>
                ) : (
                    <div 
                        className="container-itens"
                        role="list"
                        aria-label={`Lista de itens do estoque - ${itensEstoqueExibir.length} itens encontrados`}
                    >
                        {itensEstoqueExibir.map((item, index) => (
                            <div 
                                className={`item ${item.quantidade <= item.minAviso ? "item-alerta" : ""}`} 
                                key={index}
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
                                    onClick={() => { mostrarInformacoesItem(item) }} 
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
                        ))}
                    </div>
                )}

                <button 
                    className="submit-button" 
                    onClick={() => mostrarAdicionarEstoque("adicionar")}
                    aria-label="Abrir formulário para adicionar novo item ao estoque"
                >
                    Adicionar um novo item
                </button>
            </div>

            
                {adicionarEstoque && (
                    <div 
                        className="card-estoque adicionar-estoque"
                        id="card-add-estoque"
                        role="dialog"
                        aria-labelledby="form-title"
                        aria-describedby="form-description"
                    >
                        <h2 id="form-title">
                            {'adicionar' === tipoOperacao ? 'Adicionar novo item' : 'Editar informações'}
                        </h2>
                        <p id="form-description" className="sr-only">
                            {tipoOperacao === 'adicionar' 
                                ? 'Formulário para adicionar um novo item ao estoque' 
                                : 'Formulário para editar informações de um item existente'
                            }
                        </p>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                tipoOperacao === "adicionar" ? cadastrarItem() : atualizarItem();
                            }}
                            noValidate
                        >
                        <div>
                            <label 
                                className="fonte-negrito"
                                htmlFor="item-nome"
                            >
                                Nome<span className="campo-obrigatorio">*</span>
                            </label>
                            <input
                                type="text"
                                id="item-nome"
                                value={itemSelecionado.nome || ''}
                                placeholder="Digite o nome do item"
                                required
                                minLength="2"
                                maxLength="100"
                                aria-required="true"
                                aria-describedby="nome-help"
                                disabled={carregando}
                                onChange={(e) => setItemSelecionado({...itemSelecionado, nome: e.target.value})}
                            />
                            <span id="nome-help" className="sr-only">
                                Campo obrigatório. Digite o nome do material ou ferramenta.
                            </span>
                        </div>

                        <div>
                            <label 
                                className="fonte-negrito"
                                htmlFor="item-quantidade"
                            >
                                Quantidade<span className="campo-obrigatorio">*</span>
                            </label>
                            <input
                                type="number"
                                id="item-quantidade"
                                value={itemSelecionado.quantidade || ''}
                                placeholder="Digite a quantidade"
                                required
                                min="0"
                                max="999999"
                                step="1"
                                aria-required="true"
                                aria-describedby="quantidade-help"
                                disabled={carregando}
                                onChange={(e) => setItemSelecionado({...itemSelecionado, quantidade: Number(e.target.value)})}
                            />
                            <span id="quantidade-help" className="sr-only">
                                Campo obrigatório. Digite a quantidade atual em estoque.
                            </span>
                        </div>

                        <div className="input-duplo">
                            <div>
                                <label 
                                    className="fonte-negrito"
                                    htmlFor="item-minimo"
                                >
                                    Mínimo em estoque<span className="campo-obrigatorio">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="item-minimo"
                                    value={itemSelecionado.minAviso || ''}
                                    placeholder="Digite o número desejado"
                                    min="0"
                                    max="999999"
                                    step="1"
                                    required
                                    aria-required="true"
                                    aria-describedby="minimo-help"
                                    disabled={carregando}
                                    onChange={(e) => setItemSelecionado({...itemSelecionado, minAviso: Number(e.target.value)})}
                                />
                                <span id="minimo-help" className="sr-only">
                                    Quantidade mínima antes de exibir alerta de estoque baixo.
                                </span>
                            </div>

                            <div>
                                <label 
                                    className="fonte-negrito"
                                    htmlFor="item-unidade-medida"
                                >
                                    Unidade de medida<span className="campo-obrigatorio">*</span>
                                </label>
                                <select 
                                    id="item-unidade-medida" 
                                    value={itemSelecionado.unidadeMedida || ''} 
                                    required
                                    aria-required="true"
                                    aria-describedby="unidade-help"
                                    disabled={carregando}
                                    onChange={(e) => setItemSelecionado({...itemSelecionado, unidadeMedida: e.target.value})}
                                >
                                    <span id="unidade-help" className="sr-only">
                                        Campo obrigatório. Selecione como o item é medido.
                                    </span>
                                    <option value="">Selecione uma opção</option>
                                    <option value="Unidades">Unidades</option>
                                    <option value="Litros">Litros</option>
                                    <option value="Mililitros">Mililitros</option>
                                    <option value="Folhas">Folhas</option>
                                    <option value="Rolos">Rolos</option>
                                    <option value="Kilogramas">Kilogramas</option>
                                    <option value="Caixas">Caixas</option>
                                </select>
                            </div>
                        </div>

                        <div className="botoes">
                            <button 
                                className="submit-button" 
                                type="submit"
                                disabled={carregando}
                                aria-label={tipoOperacao === "adicionar" 
                                    ? "Adicionar item ao estoque" 
                                    : "Salvar alterações do item"
                                }
                            >
                                {carregando 
                                    ? (tipoOperacao === "adicionar" ? "Adicionando..." : "Salvando...")
                                    : (tipoOperacao === "adicionar" ? "Adicionar ao estoque" : "Salvar alterações")
                                }
                            </button>
                            <button 
                                className="submit-button cancel-button" 
                                type="button"
                                onClick={cancelarAdicionarEstoque}
                                disabled={carregando}
                                aria-label="Cancelar e fechar formulário"
                            >
                                Cancelar
                            </button>
                        </div>
                        </form>
                    </div>
                )}

                {informacoesItem && (
                    <div 
                        id="card-informacoes-item"
                        className="card-estoque informacoes-estoque"
                        role="dialog"
                        aria-labelledby="info-title"
                        aria-describedby="info-description"
                    >
                        <h2 id="info-title">
                            Atualizar item
                        </h2>
                        <p id="info-description" className="sr-only">
                            Informações detalhadas e opções para atualizar {itemSelecionado?.nome}
                        </p>
                        <div className="linha">
                            <div>
                                <p className="fonte-negrito">Nome do item</p>
                                <p>{itemSelecionado.nome}</p>
                            </div>

                            <div>
                                <p className="fonte-negrito">Minimo em estoque</p>
                                <p>{itemSelecionado.minAviso == null ? "Não definido" : itemSelecionado.minAviso}</p>
                            </div>
                        </div>

                        <div className="linha">
                            <div>
                                <p className="fonte-negrito">Unidade de medida</p>
                                <p>{itemSelecionado.unidadeMedida}</p>
                            </div>

                            <div>
                                <p className="fonte-negrito">Em estoque</p>
                                <p>{itemSelecionado.quantidade}</p>
                            </div>
                        </div>

                        <div className="campos-quantidade">
                            <div>
                                <label 
                                    className="fonte-negrito"
                                    htmlFor="inputAtualizarQtd"
                                >
                                    Quantidade para adicionar/remover
                                </label>
                                <input
                                    type="number"
                                    placeholder="Digite a quantidade desejada"
                                    id="inputAtualizarQtd"
                                    min="1"
                                    aria-describedby="quantidade-update-help"
                                    onChange={(e) => setQtdParaAtualizar(e.target.value)}
                                />
                                <span id="quantidade-update-help" className="sr-only">
                                    Digite a quantidade que deseja adicionar ou remover do estoque atual.
                                </span>
                            </div>

                            <div className="botoes" role="group" aria-label="Ações de quantidade">
                                <button 
                                    className="submit-button adicionar-qtd-button" 
                                    onClick={() => atualizarQuantidade("soma")}
                                    aria-label={`Adicionar ${qtdParaAtualizar || 0} unidades ao estoque de ${itemSelecionado?.nome || 'item'}`}
                                    disabled={!qtdParaAtualizar || qtdParaAtualizar <= 0}
                                >
                                    <span 
                                        className="material-symbols-outlined"
                                        aria-hidden="true"
                                    >
                                        add_2
                                    </span>
                                    <span className="sr-only">Adicionar ao estoque</span>
                                </button>
                                <button 
                                    className="submit-button remover-qtd-button" 
                                    onClick={() => atualizarQuantidade("subtrair")}
                                    aria-label={`Remover ${qtdParaAtualizar || 0} unidades do estoque de ${itemSelecionado?.nome || 'item'}`}
                                    disabled={!qtdParaAtualizar || qtdParaAtualizar <= 0}
                                >
                                    <span 
                                        className="material-symbols-outlined"
                                        aria-hidden="true"
                                    >
                                        check_indeterminate_small
                                    </span>
                                    <span className="sr-only">Remover do estoque</span>
                                </button>
                            </div>
                        </div>

                        <div className="botoes" role="group" aria-label="Ações do item">
                            <button 
                                className="submit-button" 
                                onClick={() => mostrarAdicionarEstoque("editar")}
                                aria-label={`Editar informações de ${itemSelecionado?.nome}`}
                            >
                                Editar informações
                            </button>
                            <button 
                                className="submit-button excluir-button" 
                                onClick={mostrarConfirmacaoExcluir}
                                disabled={carregando}
                                aria-label={`Excluir ${itemSelecionado?.nome} do estoque`}
                                aria-describedby="delete-warning"
                            >
                                Excluir item
                            </button>
                            <span id="delete-warning" className="sr-only">
                                Atenção: Esta ação não pode ser desfeita.
                            </span>
                        </div>
                    </div>
                )}
            
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {mostrarConfirmacaoExclusao && itemSelecionado && (
            <CardResposta
                tipo="aviso"
                titulo="Confirmar Exclusão"
                mensagem={`Tem certeza que deseja excluir "${itemSelecionado.nome}" do estoque? Esta ação não pode ser desfeita.`}
                botaoTexto={carregando ? "Excluindo..." : "Sim, Excluir"}
                onClose={cancelarExclusao}
                className="modal-confirmacao-exclusao"
            >
                <div className="botoes-confirmacao">
                    <button 
                        className="submit-button cancel-button"
                        onClick={cancelarExclusao}
                        disabled={carregando}
                        aria-label="Cancelar exclusão"
                    >
                        Cancelar
                    </button>
                    <button 
                        className="submit-button"
                        onClick={excluirItem}
                        disabled={carregando}
                        aria-label={`Confirmar exclusão de ${itemSelecionado.nome}`}
                    >
                        {carregando ? "Excluindo..." : "Sim, Excluir"}
                    </button>
                </div>
            </CardResposta>
        )}

      <Footer />
    </>
  );
};

export default Estoque;