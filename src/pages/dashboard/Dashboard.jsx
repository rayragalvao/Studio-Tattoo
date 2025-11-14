import React from 'react';
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
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const dados = [
    5000, 7500, 12000, 8500, 15000, 9000, 
    11000, 13500, 16000, 14000, 18000, 20000
];

const chartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
        {
            label: 'Faturamento',
            data: dados,
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
    const proximoAgendamento = {
        nome: 'Eduarda',
        valor: 'R$ 100,00',
        data: '12/10/2025',
        horario: '10:30'
    };

    const agendamentosDia = [
        { nome: 'Eduarda', valor: 'R$ 100,00', horario: '10:30' },
        { nome: 'João', valor: 'R$ 40,00', horario: '14:00' },
    ];

    const alertasEstoque = [
        { item: 'Luvas', unidades: 2 },
        { item: 'Agulhas', unidades: 5 },
        { item: 'Tinta Preta', unidades: 3 },
        { item: 'Papel Toalha', unidades: 4 }
    ];

    const orcamentosPendentes = 2;
    
    const { user } = useAuth();
    const navigate = useNavigate();

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
        <p className="nome-cliente">{proximoAgendamento.nome} - {proximoAgendamento.valor}</p>
        <p className="data-hora">{proximoAgendamento.data} - {proximoAgendamento.horario}</p>
        <button className="btn-agendar-action">▶</button>
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
                        <ul className="lista-agendamentos">
                            {agendamentosDia.map((ag, index) => (
                                <li key={index} className="item-agendamento">
                                    <div>
                                        <span className="info-principal">{ag.nome} - {ag.valor}</span>
                                        <span className="info-secundaria">{proximoAgendamento.data} - {ag.horario}</span>
                                    </div>
                                    <button className="btn-agendar-action">🕒</button>
                                </li>
                            ))}
                        </ul>
                    </DashboardCard>
                    
                    <DashboardCard 
                        titulo={`Itens do estoque em alerta (${alertasEstoque.length})`} 
                        className="alerta-estoque-card"
                    >
                        <div className="alertas-scroll-container">
                            {alertasEstoque.map((alerta, index) => (
                                <div key={index} className="alerta-item-destaque">
                                    <p className="item-nome-alerta">{alerta.item}</p>
                                    <p className="item-quantidade-alerta">{alerta.unidades} unidades sobrando</p>
                                </div>
                            ))}
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
            
            <Footer />
        </>
    );
};

export default Dashboard;