/* eslint-disable no-unused-vars */
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Footer } from "../../components/generalComponents/footer/Footer";
import { Notificacao } from "../../components/generalComponents/notificacao/Notificacao";
import { CardResposta } from "../../components/generalComponents/cardResposta/CardResposta";
import { ItemEstoque } from "../../components/estoqueComponents/itemEstoque/ItemEstoque";
import { CardEstoque } from "../../components/estoqueComponents/cardEstoque/CardEstoque";
import { PainelFiltros } from "../../components/estoqueComponents/painelFiltros/PainelFiltros";
import "../../styles/global.css";
import "./estoque.css";
import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api.js";

export const Estoque = () => {
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
                <PainelFiltros
                    filtrosAbertos={filtrosAbertos}
                    filtros={filtros}
                    onAtualizarFiltro={atualizarFiltro}
                    onAplicarFiltros={aplicarFiltros}
                    onLimparFiltros={limparFiltros}
                    onFechar={() => setFiltrosAbertos(false)}
                />

                
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
                            <ItemEstoque
                                key={index}
                                item={item}
                                onMostrarInformacoes={mostrarInformacoesItem}
                                filtrosAbertos={filtrosAbertos}
                            />
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
                    <CardEstoque
                        tipo={tipoOperacao}
                        item={itemSelecionado}
                        onSubmit={tipoOperacao === "adicionar" ? cadastrarItem : atualizarItem}
                        onCancel={cancelarAdicionarEstoque}
                        carregando={carregando}
                        setItemSelecionado={setItemSelecionado}
                    />
                )}

                {informacoesItem && (
                    <CardEstoque
                        tipo="informacoes"
                        item={itemSelecionado}
                        onEditar={() => mostrarAdicionarEstoque("editar")}
                        onExcluir={mostrarConfirmacaoExcluir}
                        onAtualizarQuantidade={atualizarQuantidade}
                        qtdParaAtualizar={qtdParaAtualizar}
                        setQtdParaAtualizar={setQtdParaAtualizar}
                        carregando={carregando}
                    />
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