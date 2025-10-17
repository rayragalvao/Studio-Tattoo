import React, { useState, useEffect } from "react";
import "../styles/calendario.css";

const Calendario = ({ onDataSelecionada, dataSelecionada }) => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [datasDisponiveis, setDatasDisponiveis] = useState(new Set());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const gerarDatasDisponiveis = (mes, ano) => {
    const datasLivres = new Set();
    const hoje = new Date();
    const primeiroDiaMes = new Date(ano, mes, 1);
    const ultimoDiaMes = new Date(ano, mes + 1, 0);

    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      const data = new Date(ano, mes, dia);
      
      if (data < hoje.setHours(0, 0, 0, 0)) continue;
      
      const tresMesesFuturo = new Date();
      tresMesesFuturo.setMonth(tresMesesFuturo.getMonth() + 3);
      if (data > tresMesesFuturo) continue;

      const diaSemana = data.getDay();
      
      if (diaSemana === 0) continue;
      
      const datasOcupadas = [5, 12, 19, 26];
      if (datasOcupadas.includes(dia)) continue;

      datasLivres.add(`${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`);
    }

    return datasLivres;
  };

  useEffect(() => {
    const mes = mesAtual.getMonth();
    const ano = mesAtual.getFullYear();
    const novasDatasDisponiveis = gerarDatasDisponiveis(mes, ano);
    setDatasDisponiveis(novasDatasDisponiveis);
  }, [mesAtual]);

  const obterPrimeiroDiaSemana = () => {
    const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
    return primeiroDia.getDay();
  };

  const obterDiasNoMes = () => {
    return new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  };

  const navegarMes = (direcao) => {
    const novoMes = new Date(mesAtual);
    novoMes.setMonth(mesAtual.getMonth() + direcao);
    setMesAtual(novoMes);
  };

  const podeNavegar = (direcao) => {
    const hoje = new Date();
    const novoMes = new Date(mesAtual);
    novoMes.setMonth(mesAtual.getMonth() + direcao);

    if (direcao === -1) {
      return novoMes.getMonth() >= hoje.getMonth() && novoMes.getFullYear() >= hoje.getFullYear();
    } else {
      const tresMesesFuturo = new Date();
      tresMesesFuturo.setMonth(tresMesesFuturo.getMonth() + 3);
      return novoMes <= tresMesesFuturo;
    }
  };

  const formatarDataParaComparacao = (dia) => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  };

  const handleDiaClick = (dia) => {
    const dataFormatada = formatarDataParaComparacao(dia);
    
    if (datasDisponiveis.has(dataFormatada)) {
      onDataSelecionada(dataFormatada);
    }
  };

  const renderizarDias = () => {
    const dias = [];
    const primeiroDiaSemana = obterPrimeiroDiaSemana();
    const diasNoMes = obterDiasNoMes();

    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(<div key={`vazio-${i}`} className="dia-calendario vazio"></div>);
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataFormatada = formatarDataParaComparacao(dia);
      const disponivel = datasDisponiveis.has(dataFormatada);
      const selecionado = dataSelecionada === dataFormatada;

      dias.push(
        <div
          key={dia}
          className={`dia-calendario ${disponivel ? 'disponivel' : 'indisponivel'} ${selecionado ? 'selecionado' : ''}`}
          onClick={() => handleDiaClick(dia)}
        >
          {dia}
        </div>
      );
    }

    return dias;
  };

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <button
          type="button"
          className="nav-btn"
          onClick={() => navegarMes(-1)}
          disabled={!podeNavegar(-1)}
        >
          ←
        </button>
        
        <h3 className="mes-ano">
          {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
        </h3>
        
        <button
          type="button"
          className="nav-btn"
          onClick={() => navegarMes(1)}
          disabled={!podeNavegar(1)}
        >
          →
        </button>
      </div>

      <div className="dias-semana">
        {diasSemana.map(dia => (
          <div key={dia} className="dia-semana">
            {dia}
          </div>
        ))}
      </div>

      <div className="grade-calendario">
        {renderizarDias()}
      </div>

      <div className="legenda-calendario">
        <div className="legenda-item">
          <div className="cor-disponivel"></div>
          <span>Disponível</span>
        </div>
        <div className="legenda-item">
          <div className="cor-indisponivel"></div>
          <span>Indisponível</span>
        </div>
        <div className="legenda-item">
          <div className="cor-selecionado"></div>
          <span>Selecionado</span>
        </div>
      </div>
    </div>
  );
};

export default Calendario;