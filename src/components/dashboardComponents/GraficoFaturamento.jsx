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
import './graficoFaturamento.css';

// Registrar componentes do Chart.js
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const GraficoFaturamento = ({ dados }) => {
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

    return (
        <div className="grafico-wrapper">
            <Bar 
                data={chartData} 
                options={chartOptions} 
            />
        </div>
    );
};

export default GraficoFaturamento;