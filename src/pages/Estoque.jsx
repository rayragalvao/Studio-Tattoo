/* eslint-disable no-unused-vars */
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notificacao from "../components/Notificacao";
import "../styles/global.css";
import "../styles/estoque.css";
import React, { useEffect, useState } from "react";
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

    // Aplicar filtros sempre que mudarem
    useEffect(() => {
        if (itensEstoque.length > 0) {
            aplicarFiltros();
        }
    }, [itensEstoque]);

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

    function cadastrarItem() {
        console.log("Item a ser cadastrado:", itemSelecionado);
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
            })
            .catch(error => {
                console.error('Erro ao cadastrar item:', error);

                mostrarNotificacao(
                    'erro', 
                    'Erro ao Cadastrar', 
                    error.response.data.message
                );

            });
    }

    function excluirItem() {
        console.log("Item a ser excluído:", itemSelecionado);
        api.delete(`${url}/${itemSelecionado.id}`)
            .then(response => {
                console.log("Item excluído com sucesso:", response.data);
                const itensAtualizados = itensEstoque.filter(item => item.id !== itemSelecionado.id);
                setItensEstoque(itensAtualizados);
                setItensEstoqueExibir(itensAtualizados);

                aplicarFiltros();
            })
            .catch(error => {
                console.error('Erro ao excluir item:', error);
            });
    }

    function atualizarItem(){
        console.log("Item a ser atualizado:", itemSelecionado);
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

                aplicarFiltros();
            })
            .catch(error => {
                console.error('Erro ao atualizar item:', error);
                mostrarNotificacao(
                    'erro',
                    'Erro ao Atualizar',
                    error.response.data.message
                );
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

    function aplicarFiltros() {
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
    }

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
    }

    function fecharInformacoesItem() {
        setItemSelecionado(null);
        setInformacoesItem(false);
    }

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
        <div className="section-estoque">
            <div className="card-estoque pesquisa-estoque">
                <h2> Estoque </h2>
                <div className="div-barra-pesquisa">
                    <div className="input-barra-pesquisa">
                        <input
                            type="text"
                            placeholder="Pesquisa"
                            className="input-estoque"
                            id="pesquisa"
                            onChange={(e) => aplicarFiltros()}
                        />
                        <span className="icon material-symbols-outlined">
                            search
                        </span>
                    </div>
                
                    <button 
                        className={`bt-filtro ${filtrosAbertos ? 'ativo' : ''}`}
                        onClick={toggleFiltros}
                    >
                        <span className="icon material-symbols-outlined">
                            filter_list
                        </span>
                    </button>
                </div>

                {/* Painel de Filtros */}
                { filtrosAbertos && (
                    <div className="painel-filtros">
                        <div className="filtro-grupo">
                            <label className="fonte-negrito">Unidade de Medida</label>
                            <select 
                                value={filtros.unidadeMedida}
                                onChange={(e) => atualizarFiltro('unidadeMedida', e.target.value)}
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
                            <label className="fonte-negrito">Status do Estoque</label>
                            <select 
                                value={filtros.alertaEstoque}
                                onChange={(e) => atualizarFiltro('alertaEstoque', e.target.value)}
                            >
                                <option value="Todos">Todos</option>
                                <option value="alerta">Estoque Baixo</option>
                                <option value="ok">Estoque OK</option>
                            </select>
                        </div>

                        <div className="filtro-grupo">
                            <label className="fonte-negrito">Ordenar Por</label>
                            <select 
                                value={filtros.ordenarPor}
                                onChange={(e) => atualizarFiltro('ordenarPor', e.target.value)}
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
                            >
                                Aplicar Filtros
                            </button>

                            <button 
                                className="btn-limpar-filtros"
                                onClick={limparFiltros}
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
                    <div className="container-itens">
                        {itensEstoqueExibir.map((item, index) => (
                            <div className={`item ${item.quantidade <= item.minAviso ? "item-alerta" : ""}`} key={index}>
                                <div>
                                    <p className="fonte-negrito">{item.nome}</p>
                                    <p>{item.quantidade} {item.unidadeMedida}</p>
                                </div>
                                <button className="bt-info" onClick={() => { mostrarInformacoesItem(item) }} disabled={filtrosAbertos}>
                                    <span className="icon material-symbols-outlined">
                                        info
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button className="submit-button" onClick={() => mostrarAdicionarEstoque("adicionar")}>
                    Adicionar um novo item
                </button>
            </div>

            
                {adicionarEstoque && (
                    <div className="card-estoque adicionar-estoque">
                        <h2>
                            {'adicionar' === tipoOperacao ? 'Adicionar novo item' : 'Editar informações'}
                        </h2>
                        <div>
                            <label className="fonte-negrito">Nome</label>
                            <input
                                type="text"
                                value={itemSelecionado.nome || ''}
                                placeholder="Digite o nome do item"
                                required
                                onChange={(e) => setItemSelecionado({...itemSelecionado, nome: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="fonte-negrito">Quantidade</label>
                            <input
                                type="number"
                                value={itemSelecionado.quantidade || ''}
                                placeholder="Digite a quantidade"
                                required
                                onChange={(e) => setItemSelecionado({...itemSelecionado, quantidade: e.target.value})}
                            />
                        </div>

                        <div className="input-duplo">
                            <div>
                                <label className="fonte-negrito">Mínimo em estoque</label>
                                <input
                                    type="number"
                                    value={itemSelecionado.minAviso || ''}
                                    placeholder="Digite o número desejado"
                                    onChange={(e) => setItemSelecionado({...itemSelecionado, minAviso: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="fonte-negrito">Unidade de medida</label>
                                <select 
                                    id="unidadeMedida" 
                                    value={itemSelecionado.unidadeMedida || ''} 
                                    onChange={(e) => setItemSelecionado({...itemSelecionado, unidadeMedida: e.target.value})}
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
                            </div>
                        </div>

                        <div className="botoes">
                            <button className="submit-button" type="submit" onClick={tipoOperacao === "adicionar" ? cadastrarItem : atualizarItem}>
                                {tipoOperacao === "adicionar" ? "Adicionar ao estoque" : "Salvar alterações"}
                            </button>
                            <button className="submit-button cancel-button" onClick={cancelarAdicionarEstoque}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {informacoesItem && (
                    <div className="card-estoque informacoes-estoque">
                        <h2>
                            Atualizar item
                        </h2>
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
                                <label className="fonte-negrito">Quantidade</label>
                                <input
                                    type="number"
                                    placeholder="Digite a quantidade desejada"
                                    id="inputAtualizarQtd"
                                    onChange={(e) => setQtdParaAtualizar(e.target.value)}
                                />
                            </div>

                            <div className="botoes">
                                <button className="submit-button adicionar-qtd-button" onClick={() => atualizarQuantidade("soma")}>
                                    <span className="material-symbols-outlined">
                                        add_2
                                    </span>
                                </button>
                                <button className="submit-button remover-qtd-button" onClick={() => atualizarQuantidade("subtrair")}>
                                    <span className="material-symbols-outlined">
                                        check_indeterminate_small
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="botoes">
                            <button className="submit-button" onClick={() => mostrarAdicionarEstoque("editar")}>
                                Editar informações
                            </button>
                            <button className="submit-button excluir-button" onClick={excluirItem}>
                                Excluir item
                            </button>
                        </div>
                    </div>
                )}
            {/* <div className="container-cards">
            </div> */}
        </div>
      <Footer />
    </>
  );
};

export default Estoque;