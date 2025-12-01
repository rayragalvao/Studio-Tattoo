import React, { useEffect, useState } from 'react'; 
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

import { Navbar } from '../../components/generalComponents/navbar/Navbar';
import { Footer } from '../../components/generalComponents/footer/Footer';
import { useAuth } from '../../contexts/AuthContext';
import DashboardCard from '../../components/generalComponents/dashboardCard/DashboardCard';
import { CardEstoque } from '../../components/estoqueComponents/cardEstoque/CardEstoque';
import '../../components/estoqueComponents/cardEstoque/cardEstoque.css';
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/loadingComponents/loadingSpinner/LoadingSpinner'; 

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            callbacks: {
                label: function(context) {
                    return new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                    }).format(context.parsed.y);
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            border: {
                display: false
            },
            ticks: {
                color: '#888888',
                font: {
                    size: 12
                },
                padding: 8
            }
        },
        y: {
            border: {
                display: false
            },
            position: 'right',
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false
            },
            ticks: {
                color: '#888888',
                padding: 12,
                font: {
                    size: 12
                },
                callback: function(value) {
                    return 'R$' + (value / 1000).toFixed(1) + 'k';
                }
            }
        },
    },
};

const Dashboard = () => {
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const [kpis, setKpis] = useState(null); 
    const [faturamentoDados, setFaturamentoDados] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [itemEstoqueSelecionado, setItemEstoqueSelecionado] = useState(null);
    const [mostrarDetalhesEstoque, setMostrarDetalhesEstoque] = useState(false);
    
    // ✅ NOVO: Estado para gerenciar quantidade a atualizar
    const [qtdParaAtualizar, setQtdParaAtualizar] = useState('');
    
    const chartData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'Faturamento',
                data: faturamentoDados, 
                backgroundColor: function(context) {
                    const index = context.dataIndex;
                    const currentMonth = new Date().getMonth();
                    return index === currentMonth ? '#fb923c' : '#7c3aed';
                },
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 24,
                maxBarThickness: 32,
            },
        ],
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                console.log('📄 Buscando dados do dashboard...');
                
                const kpiResponse = await api.get('/dashboard/kpis');
                console.log('📊 KPIs recebidos do backend:', kpiResponse.data);
                setKpis(kpiResponse.data);

                const faturamentoResponse = await api.get('/dashboard/faturamento-anual');
                console.log('💰 Faturamento recebido:', faturamentoResponse.data);
                setFaturamentoDados(faturamentoResponse.data);

            } catch (error) {
                console.error("❌ Erro ao buscar dados do dashboard:", error);
                setKpis(null);
                setFaturamentoDados([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); 

    // ✅ NOVO: Função para fechar modal e limpar estado
    const fecharModalEstoque = () => {
        setMostrarDetalhesEstoque(false);
        setItemEstoqueSelecionado(null);
        setQtdParaAtualizar('');
    };

    // ✅ NOVO: Função para atualizar quantidade do item
    const handleAtualizarQuantidade = async (operacao) => {
        if (!qtdParaAtualizar || qtdParaAtualizar <= 0) {
            alert('Por favor, digite uma quantidade válida');
            return;
        }

        try {
            const quantidade = parseInt(qtdParaAtualizar);
            const novaQuantidade = operacao === 'soma' 
                ? itemEstoqueSelecionado.quantidade + quantidade
                : itemEstoqueSelecionado.quantidade - quantidade;

            if (novaQuantidade < 0) {
                alert('A quantidade não pode ser negativa');
                return;
            }

            // Atualizar via API (ajuste o endpoint conforme sua API)
            await api.put(`/estoque/${itemEstoqueSelecionado.id}`, {
                ...itemEstoqueSelecionado,
                quantidade: novaQuantidade
            });

            alert(`Quantidade ${operacao === 'soma' ? 'adicionada' : 'removida'} com sucesso!`);
            fecharModalEstoque();
            
            // Recarregar dados do dashboard
            window.location.reload();
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            alert('Erro ao atualizar quantidade. Tente novamente.');
        }
    };

    // ✅ NOVO: Função para editar item
    const handleEditarItem = () => {
        fecharModalEstoque();
        navigate('/estoque', { state: { itemParaEditar: itemEstoqueSelecionado } });
    };

    // ✅ NOVO: Função para excluir item
    const handleExcluirItem = async () => {
        if (!window.confirm(`Tem certeza que deseja excluir "${itemEstoqueSelecionado.nomeProduto}"?`)) {
            return;
        }

        try {
            await api.delete(`/estoque/${itemEstoqueSelecionado.id}`);
            alert('Item excluído com sucesso!');
            fecharModalEstoque();
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            alert('Erro ao excluir item. Tente novamente.');
        }
    };
    

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                    <LoadingSpinner /> 
                    <p style={{ marginTop: '20px', color: '#666' }}>Carregando dados do dashboard...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!kpis) {
        return (
            <>
                <Navbar />
                <div className="dashboard-container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3>⚠️ Erro ao carregar dados</h3>
                        <p>Não foi possível conectar com o servidor.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#fb923c', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const { 
        proximoAgendamento = null,
        orcamentosPendentes = 0, 
        agendamentosDoDia = [], 
        alertasEstoque = [] 
    } = kpis;

    const proximoAgendamentoFormatado = proximoAgendamento ? {
        nome: proximoAgendamento.usuario?.nome || 'Cliente', 
        valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proximoAgendamento.orcamento?.valor || 0),
        data: new Date(proximoAgendamento.dataHora).toLocaleDateString('pt-BR'),
        horario: new Date(proximoAgendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } : { 
        nome: 'Nenhum', 
        valor: 'R$ 0,00', 
        data: 'Sem data', 
        horario: '' 
    };


    return (
        <>
            <Navbar />

            <h1 className="h1-dashboard">Bem-vinda, {user?.nome}</h1>

            <div className="dashboard-container">

                <div className="dashboard-row-kpis">
                    
                    <DashboardCard className="kpi-principal">
                        <div className="agendamento-info-grid">
                           <div className="proximo-agendamento-card">
                                <h3>Próximo agendamento</h3>
                                <div className="proximo-agendamento-bloco-destaque"> 
                                    <p className="nome-cliente">{proximoAgendamentoFormatado.nome} - {proximoAgendamentoFormatado.valor}</p>
                                    <p className="data-hora">{proximoAgendamentoFormatado.data} - {proximoAgendamentoFormatado.horario}</p>
                                </div>
                            </div>
                            <div className="orcamentos-pendentes-card">
                                <h3>Orçamentos aguardando resposta</h3>
                                <p className="numero-pendentes">{orcamentosPendentes}</p>
                            </div>
                        </div>
                    </DashboardCard>

                    <DashboardCard titulo="Faturamento do mês" className="faturamento-card">
                        <div className="grafico-wrapper">
                            <Bar 
                                data={chartData} 
                                options={chartOptions} 
                            />
                        </div>
                    </DashboardCard>
                </div>
                
                <div className="dashboard-row-listas">
                    <DashboardCard titulo="Agendamentos do dia" className="agendamentos-dia-card">
                        <div className="agendamentos-scroll-container">
                            <ul className="lista-agendamentos">
                                {agendamentosDoDia.length === 0 ? (
                                    <li className="item-agendamento-vazio">Nenhum agendamento hoje.</li>
                                ) : (
                                    agendamentosDoDia.map((ag) => (
                                        <li key={ag.id} className="item-agendamento">
                                            <div>
                                                <span className="info-principal">
                                                    {ag.usuario?.nome || 'Cliente'} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ag.orcamento?.valor || 0)}
                                                </span>
                                                <span className="info-secundaria">
                                                    {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <button className="btn-agendar-action">
                                                <span className="material-symbols-outlined">
                                                    alarm
                                                </span>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </DashboardCard>
                    
                    <DashboardCard 
                        titulo={`Itens do estoque em alerta (${alertasEstoque.length})`} 
                        className="alerta-estoque-card"
                    >
                        <div className="alertas-scroll-container">
                            {alertasEstoque.length === 0 ? (
                                <div className="alerta-item-vazio">Estoque em ordem!</div>
                            ) : (
                                alertasEstoque.map((alerta) => (
                                    <div 
                                        key={alerta.id} 
                                        className="alerta-item-destaque"
                                        onClick={() => {
                                            console.log('🔍 Item clicado:', alerta);
                                            setItemEstoqueSelecionado(alerta);
                                            setMostrarDetalhesEstoque(true);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        title={`Clique para ver detalhes de ${alerta.nomeProduto}`}
                                    >
                                        <p className="item-nome-alerta">{alerta.nomeProduto}</p>
                                        <p className="item-quantidade-alerta">
                                            {alerta.quantidade} {alerta.unidadeMedida || 'unidades'} restante{alerta.quantidade !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            className="btn-ver-estoque"
                            onClick={() => navigate('/estoque')}
                        >
                            Ver estoque completo
                        </button>
                    </DashboardCard>
                </div>
                
            </div>
            
            {/* ✅ MODAL CORRIGIDO */}
            {mostrarDetalhesEstoque && itemEstoqueSelecionado && (
                <div 
                    className="modal-overlay" 
                    onClick={fecharModalEstoque}
                >
                    <div 
                        className="modal-content" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="modal-close-button"
                            onClick={fecharModalEstoque}
                            aria-label="Fechar detalhes do item"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        {/* ✅ CardEstoque com todas as props necessárias */}
                        <CardEstoque
                            tipo="informacoes"
                            item={{
                                id: itemEstoqueSelecionado.id,
                                nome: itemEstoqueSelecionado.nomeProduto,
                                quantidade: itemEstoqueSelecionado.quantidade,
                                minAviso: itemEstoqueSelecionado.minAviso,
                                unidadeMedida: itemEstoqueSelecionado.unidadeMedida
                            }}
                            qtdParaAtualizar={qtdParaAtualizar}
                            setQtdParaAtualizar={setQtdParaAtualizar}
                            onEditar={handleEditarItem}
                            onExcluir={handleExcluirItem}
                            onAtualizarQuantidade={handleAtualizarQuantidade}
                        />
                    </div>
                </div>
            )}
            
            <Footer />
        </>
    );
};

export default Dashboard;