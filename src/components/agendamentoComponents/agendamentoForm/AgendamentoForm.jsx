import React, { useState } from "react";
import "./agendamentoForm.css";
import { Calendario } from "../calendario/Calendario";
import { AlertaCustomizado } from "../../generalComponents/alertaCustomizado/AlertaCustomizado";
import AgendamentoService from "../../../services/AgendamentoService";
import { useAuth } from "../../../contexts/AuthContext";

export const AgendamentoForm = () => {
  const { user } = useAuth();
  const [codigoOrcamento, setCodigoOrcamento] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});
  const [showAlerta, setShowAlerta] = useState(false);
  const [alertaConfig, setAlertaConfig] = useState({
    tipo: "success",
    titulo: "",
    mensagem: ""
  });
  const [enviando, setEnviando] = useState(false);

  const gerarHorariosDisponiveis = (data) => {
    const horariosBase = [
      "09:00", "10:00", "11:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00"
    ];
    
    return horariosBase;
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

    if (!user?.email) {
      setAlertaConfig({
        tipo: "error",
        titulo: "Erro de Autenticação",
        mensagem: "Você precisa estar logado para fazer um agendamento."
      });
      setShowAlerta(true);
      return;
    }

    try {
      setEnviando(true);

      // Primeiro valida o código de orçamento
      const isCodigoValido = await AgendamentoService.validarCodigoOrcamento(codigoOrcamento);
      
      if (!isCodigoValido) {
        setErrors({
          codigoOrcamento: "Código de orçamento inválido ou já possui agendamento"
        });
        setAlertaConfig({
          tipo: "error",
          titulo: "Código Inválido",
          mensagem: "O código do orçamento não foi encontrado ou já possui um agendamento cadastrado."
        });
        setShowAlerta(true);
        setEnviando(false);
        return;
      }

      // Combina data e horário no formato LocalDateTime esperado pelo backend
      const [hora, minuto] = horarioSelecionado.split(':');
      const dataHoraCompleta = `${dataSelecionada}T${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}:00`;

      const dadosAgendamento = {
        emailUsuario: user.email,
        codigoOrcamento: codigoOrcamento,
        dataHora: dataHoraCompleta
      };

      await AgendamentoService.criarAgendamento(dadosAgendamento);
      
      setAlertaConfig({
        tipo: "success",
        titulo: "Agendamento Confirmado!",
        mensagem: `Sua sessão foi agendada para o dia ${new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')} às ${horarioSelecionado}. Você receberá uma confirmação em breve.`
      });
      setShowAlerta(true);
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      
      let mensagemErro = "Ocorreu um erro ao criar o agendamento. Tente novamente.";
      let tituloErro = "Erro ao Agendar";
      
      // Tratamento específico de erros
      if (error.response?.status === 409) {
        // Conflito - código já possui agendamento
        tituloErro = "Código Já Agendado";
        mensagemErro = "Este código de orçamento já possui um agendamento cadastrado.";
        setErrors({
          codigoOrcamento: "Este código já possui agendamento"
        });
      } else if (error.response?.status === 404 || error.message?.includes("não encontrado")) {
        // Código não encontrado
        tituloErro = "Código Não Encontrado";
        mensagemErro = "O código do orçamento informado não foi encontrado no sistema. Verifique se digitou corretamente.";
        setErrors({
          codigoOrcamento: "Código não encontrado"
        });
      } else if (error.response?.status === 400) {
        // Erro de validação
        tituloErro = "Dados Inválidos";
        mensagemErro = error.response.data || "Os dados do agendamento são inválidos. Verifique as informações e tente novamente.";
      } else if (error.message) {
        mensagemErro = error.message;
      } else if (error.response?.data) {
        mensagemErro = error.response.data;
      }
      
      setAlertaConfig({
        tipo: "error",
        titulo: tituloErro,
        mensagem: mensagemErro
      });
      setShowAlerta(true);
    } finally {
      setEnviando(false);
    }
  };

  const handleCloseAlerta = () => {
    setShowAlerta(false);
    if (alertaConfig.tipo === "success") {
      limparFormulario();
    }
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

          <div className="calendario-horarios-container">
            <div className="form-group calendario-group">
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

            <div className="form-group horarios-group">
              <label>
                Horários Disponíveis
                <span className="required">*</span>
              </label>
              {horariosDisponiveis.length > 0 ? (
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
              ) : dataSelecionada ? (
                <div className="no-horarios">
                  <p>Não há horários disponíveis para esta data.</p>
                  <p>Por favor, selecione outra data.</p>
                </div>
              ) : (
                <div className="selecione-data">
                  <p>Selecione uma data para ver os horários disponíveis</p>
                </div>
              )}
              {errors.horarioSelecionado && (
                <span className="error-message">
                  {errors.horarioSelecionado}
                </span>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={!codigoOrcamento || !dataSelecionada || !horarioSelecionado || enviando}
          >
            {enviando ? 'Confirmando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>

      <AlertaCustomizado
        isVisible={showAlerta}
        onClose={handleCloseAlerta}
        tipo={alertaConfig.tipo}
        titulo={alertaConfig.titulo}
        mensagem={alertaConfig.mensagem}
        botaoTexto="Entendi"
      />
    </section>
  );
};