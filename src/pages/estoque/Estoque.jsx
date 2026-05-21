/* eslint-disable no-unused-vars */
import { Navbar } from "../../components/generalComponents/navbar/Navbar";
import { Footer } from "../../components/generalComponents/footer/Footer";
import { Notificacao } from "../../components/generalComponents/notificacao/Notificacao";
import { CardResposta } from "../../components/generalComponents/cardResposta/CardResposta";
import { ItemEstoque } from "../../components/estoqueComponents/itemEstoque/ItemEstoque";
import { CardEstoque } from "../../components/estoqueComponents/cardEstoque/CardEstoque";
import { PainelFiltros } from "../../components/estoqueComponents/painelFiltros/PainelFiltros";
import { PaginacaoEstoque } from "../../components/estoqueComponents/paginacaoEstoque/paginacaoEstoque";
import "../../styles/global.css";
import "./estoque.css";
import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../services/api.js";
import estoqueService from "../../services/EstoqueService.js";

export const Estoque = () => {
    const url = "/estoque";

    // ── Estados de UI ────────────────────────────────────────────────────────
    const [adicionarEstoque, setAdicionarEstoque] = useState(false);
    const [informacoesItem, setInformacoesItem] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [qtdParaAtualizar, setQtdParaAtualizar] = useState(0);
    const [tipoOperacao, setTipoOperacao] = useState("adicionar");
    const [carregando, setCarregando] = useState(false);
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtrosAtivos, setFiltrosAtivos] = useState(false);
    const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);

    // ── Estados de dados ─────────────────────────────────────────────────────
    const [itensEstoque, setItensEstoque] = useState([]);

    // ── Estados de paginação ─────────────────────────────────────────────────
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [tamanhoPagina, setTamanhoPagina] = useState(10);

    // ── Estados de filtros ───────────────────────────────────────────────────
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [filtros, setFiltros] = useState({
        unidadeMedida: "Todas",
        alertaEstoque: "Todos",
        ordenarPor: "nome"
    });

    // ── Notificação ──────────────────────────────────────────────────────────
    const [notificacao, setNotificacao] = useState({
        visivel: false,
        tipo: 'sucesso',
        titulo: '',
        mensagem: ''
    });

    // Ref para debounce da pesquisa
    const debounceRef = useRef(null);

    // ── Busca paginada do backend ─────────────────────────────────────────────
    const buscarItens = useCallback((pagina = 0, tamanho = tamanhoPagina, nome = termoPesquisa) => {
        setCarregando(true);
        estoqueService.listarPaginado(pagina, tamanho, nome)
            .then(data => {
                // data é o Page do Spring: { content, totalElements, totalPages, number, size }
                setItensEstoque(data.content || []);
                setTotalPaginas(data.totalPages || 0);
                setTotalItens(data.totalElements || 0);
                setPaginaAtual(data.number || 0);

                // Aviso de estoque baixo (checado sobre a página atual)
                const itensEstoqueBaixo = (data.content || []).filter(item =>
                    item.quantidade <= (item.minAviso || 0)
                );
                if (itensEstoqueBaixo.length > 0) {
                    mostrarNotificacao(
                        'aviso',
                        'Estoque Baixo',
                        `${itensEstoqueBaixo.length} ${itensEstoqueBaixo.length === 1 ? 'item está' : 'itens estão'} com estoque baixo nesta página.`
                    );
                }
            })
            .catch(error => {
                console.error('Erro ao buscar itens de estoque:', error);
                mostrarNotificacao('erro', 'Erro ao Carregar', 'Não foi possível buscar os itens do estoque.');
            })
            .finally(() => {
                setCarregando(false);
            });
    }, [tamanhoPagina, termoPesquisa]);

    // Carrega ao montar
    useEffect(() => {
        buscarItens(0, tamanhoPagina, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Handlers de paginação ────────────────────────────────────────────────
    function mudarPagina(novaPagina) {
        buscarItens(novaPagina, tamanhoPagina, termoPesquisa);
    }

    function mudarTamanhoPagina(novoTamanho) {
        setTamanhoPagina(novoTamanho);
        buscarItens(0, novoTamanho, termoPesquisa);
    }

    // ── Pesquisa com debounce ────────────────────────────────────────────────
    function handlePesquisa(e) {
        const valor = e.target.value;
        setTermoPesquisa(valor);

        // Cancela o debounce anterior e cria um novo (300ms)
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            buscarItens(0, tamanhoPagina, valor);
        }, 300);
    }

    // ── Filtros (unidadeMedida e alertaEstoque são aplicados localmente
    //    sobre a página atual, pois o backend só suporta filtro por nome) ─────
    const itensExibir = (() => {
        let lista = [...itensEstoque];

        if (filtros.unidadeMedida !== "Todas") {
            lista = lista.filter(item =>
                item.unidadeMedida?.toLowerCase() === filtros.unidadeMedida.toLowerCase()
            );
        }

        if (filtros.alertaEstoque === "alerta") {
            lista = lista.filter(item => item.quantidade <= (item.minAviso || 0));
        } else if (filtros.alertaEstoque === "ok") {
            lista = lista.filter(item => item.quantidade > (item.minAviso || 0));
        }

        lista.sort((a, b) => {
            const aEmAlerta = a.quantidade <= (a.minAviso || 0);
            const bEmAlerta = b.quantidade <= (b.minAviso || 0);
            if (aEmAlerta && !bEmAlerta) return -1;
            if (!aEmAlerta && bEmAlerta) return 1;
            switch (filtros.ordenarPor) {
                case "quantidade": return b.quantidade - a.quantidade;
                case "alerta": return (a.quantidade <= (a.minAviso || 0)) ? -1 : 1;
                default: return a.nome.localeCompare(b.nome);
            }
        });

        return lista;
    })();

    useEffect(() => {
        setFiltrosAtivos(
            filtros.unidadeMedida !== "Todas" || filtros.alertaEstoque !== "Todos"
        );
    }, [filtros]);

    // ── Notificação ──────────────────────────────────────────────────────────
    function mostrarNotificacao(tipo, titulo, mensagem) {
        setNotificacao({ visivel: true, tipo, titulo, mensagem });
    }

    function fecharNotificacao() {
        setNotificacao(prev => ({ ...prev, visivel: false }));
    }

    // ── Validação ────────────────────────────────────────────────────────────
    function validarFormulario() {
        const erros = [];
        if (!itemSelecionado.nome?.trim()) erros.push('Nome é obrigatório');
        if (!itemSelecionado.quantidade || itemSelecionado.quantidade < 0) erros.push('Quantidade deve ser um número positivo');
        if (!itemSelecionado.minAviso && itemSelecionado.minAviso !== 0) erros.push('Mínimo em estoque é obrigatório');
        if (itemSelecionado.minAviso < 0) erros.push('Mínimo em estoque deve ser um número positivo');
        if (!itemSelecionado.unidadeMedida) erros.push('Unidade de medida é obrigatória');
        return erros;
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────
    function cadastrarItem() {
        const erros = validarFormulario();
        if (erros.length > 0) {
            mostrarNotificacao('erro', 'Dados Inválidos', erros.join(' | '));
            return;
        }
        setCarregando(true);
        api.post(url, itemSelecionado)
            .then(response => {
                mostrarNotificacao('sucesso', 'Item Cadastrado!', `${itemSelecionado.nome} foi adicionado ao estoque.`);
                setAdicionarEstoque(false);
                setItemSelecionado(null);
                // Volta para a primeira página para ver o novo item
                buscarItens(0, tamanhoPagina, termoPesquisa);
            })
            .catch(error => {
                mostrarNotificacao('erro', 'Erro ao Cadastrar', error.response?.data?.message || 'Erro interno do servidor');
            })
            .finally(() => setCarregando(false));
    }

    function mostrarConfirmacaoExcluir() {
        setMostrarConfirmacaoExclusao(true);
    }

    function excluirItem() {
        setCarregando(true);
        api.delete(`${url}/${itemSelecionado.id}`)
            .then(() => {
                mostrarNotificacao('sucesso', 'Item Excluído', `${itemSelecionado.nome} foi removido do estoque.`);
                setMostrarConfirmacaoExclusao(false);
                setInformacoesItem(false);
                setItemSelecionado(null);
                // Se era o único item da página, volta uma página
                const novaPagina = itensEstoque.length === 1 && paginaAtual > 0
                    ? paginaAtual - 1
                    : paginaAtual;
                buscarItens(novaPagina, tamanhoPagina, termoPesquisa);
            })
            .catch(error => {
                mostrarNotificacao('erro', 'Erro ao Excluir', error.response?.data?.message || 'Erro interno do servidor');
            })
            .finally(() => setCarregando(false));
    }

    function cancelarExclusao() {
        setMostrarConfirmacaoExclusao(false);
    }

    function atualizarItem() {
        const erros = validarFormulario();
        if (erros.length > 0) {
            mostrarNotificacao('erro', 'Dados Inválidos', erros.join('. '));
            return;
        }
        setCarregando(true);
        api.put(`${url}/${itemSelecionado.id}`, itemSelecionado)
            .then(response => {
                mostrarNotificacao('sucesso', 'Item Atualizado', 'As informações do item foram atualizadas com sucesso.');
                setAdicionarEstoque(false);
                setItemSelecionado(null);
                buscarItens(paginaAtual, tamanhoPagina, termoPesquisa);
            })
            .catch(error => {
                mostrarNotificacao('erro', 'Erro ao Atualizar', error.response?.data?.message || 'Erro interno do servidor');
            })
            .finally(() => setCarregando(false));
    }

    function atualizarQuantidade(operacao) {
        let qtdAtualizada = Number(itemSelecionado.quantidade);
        let qtdParaAdicionar = Number(qtdParaAtualizar);

        if (isNaN(qtdParaAdicionar) || qtdParaAdicionar <= 0) {
            mostrarNotificacao('erro', 'Quantidade Inválida', 'Por favor, insira uma quantidade válida para atualizar.');
            return;
        }

        if (operacao === "soma") {
            qtdAtualizada = qtdAtualizada + qtdParaAdicionar;
        } else if (operacao === "subtrair") {
            if (qtdAtualizada < qtdParaAdicionar) {
                mostrarNotificacao('aviso', 'Quantidade Insuficiente', 'Não é possível subtrair mais do que a quantidade atual em estoque.');
                return;
            }
            qtdAtualizada = qtdAtualizada - qtdParaAdicionar;
        }

        api.patch(`${url}/${itemSelecionado.id}/${qtdAtualizada}`)
            .then(response => {
                mostrarNotificacao('sucesso', 'Estoque Atualizado', 'A quantidade de itens foi atualizada com sucesso.');
                setQtdParaAtualizar(0);
                setItemSelecionado(response.data);
                document.getElementById('inputAtualizarQtd').value = '';
                buscarItens(paginaAtual, tamanhoPagina, termoPesquisa);
            })
            .catch(error => {
                mostrarNotificacao('erro', 'Erro ao Atualizar', error.response?.data?.message || 'Erro ao atualizar quantidade');
            });
    }

    // ── Filtros ──────────────────────────────────────────────────────────────
    function toggleFiltros() {
        setFiltrosAbertos(!filtrosAbertos);
    }

    function atualizarFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    }

    function aplicarFiltros() {
        // Filtros locais não precisam rebuscar — itensExibir já os aplica
    }

    function limparFiltros() {
        setFiltros({ unidadeMedida: "Todas", alertaEstoque: "Todos", ordenarPor: "nome" });
        setTermoPesquisa('');
        document.getElementById('pesquisa').value = '';
        buscarItens(0, tamanhoPagina, '');
        setFiltrosAtivos(false);
    }

    // ── Modais ───────────────────────────────────────────────────────────────
    function mostrarAdicionarEstoque(tipo) {
        setTipoOperacao(tipo);
        if (tipo === "adicionar") {
            setItemSelecionado({ nome: '', quantidade: 0, minAviso: 0, unidadeMedida: 'Unidades' });
        }
        if (informacoesItem) setInformacoesItem(false);
        setTimeout(() => {
            document.getElementById('card-add-estoque')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
        setAdicionarEstoque(true);
    }

    function cancelarAdicionarEstoque() {
        setItemSelecionado(null);
        setAdicionarEstoque(false);
    }

    function mostrarInformacoesItem(item) {
        if (adicionarEstoque) setAdicionarEstoque(false);
        setInformacoesItem(true);
        setItemSelecionado(item);
        setTimeout(() => {
            document.getElementById('card-informacoes-item')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }

    function fecharInformacoesItem() {
        setItemSelecionado(null);
        setInformacoesItem(false);
    }

    // ── ESC fecha modais ─────────────────────────────────────────────────────
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                if (mostrarConfirmacaoExclusao) cancelarExclusao();
                else if (adicionarEstoque) cancelarAdicionarEstoque();
                else if (informacoesItem) fecharInformacoesItem();
                else if (filtrosAbertos) setFiltrosAbertos(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [adicionarEstoque, informacoesItem, filtrosAbertos, mostrarConfirmacaoExclusao]);

    // ── Render ───────────────────────────────────────────────────────────────
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
            <h1 className="h1-estoque">Estoque</h1>
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
                                onChange={handlePesquisa}
                            />
                            <span className="icon material-symbols-outlined" aria-hidden="true">search</span>
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
                            <span className="icon material-symbols-outlined" aria-hidden="true">filter_list</span>
                        </button>
                    </div>

                    <PainelFiltros
                        filtrosAbertos={filtrosAbertos}
                        filtros={filtros}
                        onAtualizarFiltro={atualizarFiltro}
                        onAplicarFiltros={() => { aplicarFiltros(); setFiltrosAbertos(false); }}
                        onLimparFiltros={limparFiltros}
                        onFechar={() => setFiltrosAbertos(false)}
                    />

                    <div className="filtros-ativos">
                        {filtrosAtivos && (
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

                    {carregando ? (
                        <div className="carregando">Carregando materiais...</div>
                    ) : itensExibir.length === 0 ? (
                        <div className="nenhum-item">Nenhum item encontrado.</div>
                    ) : (
                        <div
                            className="container-itens"
                            role="list"
                            aria-label={`Lista de itens do estoque — ${totalItens} itens no total`}
                        >
                            {itensExibir.map((item) => (
                                <ItemEstoque
                                    key={item.id}
                                    item={item}
                                    onMostrarInformacoes={mostrarInformacoesItem}
                                    filtrosAbertos={filtrosAbertos}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Paginação ── */}
                    <PaginacaoEstoque
                        paginaAtual={paginaAtual}
                        totalPaginas={totalPaginas}
                        totalItens={totalItens}
                        tamanhoPagina={tamanhoPagina}
                        onMudarPagina={mudarPagina}
                        onMudarTamanhoPagina={mudarTamanhoPagina}
                        carregando={carregando}
                    />

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
