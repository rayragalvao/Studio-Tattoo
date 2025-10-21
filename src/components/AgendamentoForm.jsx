import React, { useState } from "react";
import "../styles/agendamento-form.css";
import Calendario from "./Calendario";
import AlertaCustomizado from "./AlertaCustomizado";

const AgendamentoForm = () => {
  const [codigoOrcamento, setCodigoOrcamento] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});
  const [showAlerta, setShowAlerta] = useState(false);

  const gerarHorariosDisponiveis = (data) => {
    const horariosBase = [
      "09:00", "10:00", "11:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00"
    ];

    const horariosOcupados = ["10:00", "15:00", "17:00"];
    
    return horariosBase.filter(horario => !horariosOcupados.includes(horario));
  };



  const handleCodigoChange = (e) => {
    const valor = e.target.value;
    setCodigoOrcamento(valor);
    
    if (errors.codigoOrcamento) {
      setErrors(prev => ({
        ...prev,
        codigoOrcamento: ""
      }));
    }
  };

  const handleDataChange = (data) => {
    setDataSelecionada(data);
    setHorarioSelecionado("");
    
    if (data) {
      const horariosLivres = gerarHorariosDisponiveis(data);
      setHorariosDisponiveis(horariosLivres);
    } else {
      setHorariosDisponiveis([]);
    }

    if (errors.dataSelecionada) {
      setErrors(prev => ({
        ...prev,
        dataSelecionada: ""
      }));
    }
  };

  const handleHorarioChange = (horario) => {
    setHorarioSelecionado(horario);
    
    if (errors.horarioSelecionado) {
      setErrors(prev => ({
        ...prev,
        horarioSelecionado: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!codigoOrcamento.trim()) {
      newErrors.codigoOrcamento = "Código do orçamento é obrigatório";
    }

    if (!dataSelecionada) {
      newErrors.dataSelecionada = "Data é obrigatória";
    }

    if (!horarioSelecionado) {
      newErrors.horarioSelecionado = "Horário é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const limparFormulario = () => {
    setCodigoOrcamento("");
    setDataSelecionada("");
    setHorarioSelecionado("");
    setHorariosDisponiveis([]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dadosAgendamento = {
      codigoOrcamento,
      data: dataSelecionada,
      horario: horarioSelecionado
    };

    console.log("Dados do agendamento:", dadosAgendamento);
    setShowAlerta(true);
  };

  const handleCloseAlerta = () => {
    setShowAlerta(false);
    limparFormulario();
  };

  return (
    <section className="agendamento-section">
      <div className="agendamento-container">
        <div className="agendamento-header">
          <h1>Agendar Sessão</h1>
          <p>Escolha a data e horário para sua tatuagem</p>
        </div>

        <form onSubmit={handleSubmit} className="agendamento-form">
          <div className="form-group">
            <label htmlFor="codigoOrcamento">
              Código do Orçamento
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="codigoOrcamento"
              name="codigoOrcamento"
              autoComplete="off"
              value={codigoOrcamento}
              onChange={handleCodigoChange}
              placeholder="Digite o código do seu orçamento"
              className={errors.codigoOrcamento ? 'error' : ''}
            />
            {errors.codigoOrcamento && (
              <span className="error-message">
                {errors.codigoOrcamento}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>
              Data Desejada
              <span className="required">*</span>
            </label>
            <Calendario 
              onDataSelecionada={handleDataChange}
              dataSelecionada={dataSelecionada}
            />
            {errors.dataSelecionada && (
              <span className="error-message">
                {errors.dataSelecionada}
              </span>
            )}
          </div>

          {horariosDisponiveis.length > 0 && (
            <div className="form-group">
              <label>
                Horários Disponíveis
                <span className="required">*</span>
              </label>
              <div className="horarios-grid">
                {horariosDisponiveis.map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    className={`horario-btn ${
                      horarioSelecionado === horario ? 'selected' : ''
                    }`}
                    onClick={() => handleHorarioChange(horario)}
                  >
                    {horario}
                  </button>
                ))}
              </div>
              {errors.horarioSelecionado && (
                <span className="error-message">
                  {errors.horarioSelecionado}
                </span>
              )}
            </div>
          )}

          {dataSelecionada && horariosDisponiveis.length === 0 && (
            <div className="form-group">
              <div className="no-horarios">
                <p>Não há horários disponíveis para esta data.</p>
                <p>Por favor, selecione outra data.</p>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={!codigoOrcamento || !dataSelecionada || !horarioSelecionado}
          >
            Confirmar Agendamento
          </button>
        </form>
      </div>

      <AlertaCustomizado
        isVisible={showAlerta}
        onClose={handleCloseAlerta}
        tipo="success"
        titulo="Agendamento Confirmado!"
        mensagem={`Sua sessão foi agendada para o dia ${dataSelecionada ? new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR') : ''} às ${horarioSelecionado}. Você receberá uma confirmação em breve.`}
        botaoTexto="Entendi"
      />
    </section>
  );
};

export default AgendamentoForm;