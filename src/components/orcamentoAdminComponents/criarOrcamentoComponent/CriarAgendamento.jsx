import React, { useState } from "react";
import agendamentoService from "../../../services/AgendamentoService.js";
import { Calendario } from "../../agendamentoComponents/calendario/Calendario.jsx";
import { AlertaCustomizado } from "../../generalComponents/alertaCustomizado/AlertaCustomizado.jsx";
import { useAuth } from "../../../contexts/AuthContext";

const CriarAgendamento = ({ onClose, onAgendamentoCriado }) => {
  const { user } = useAuth();

  const [codigoOrcamento, setCodigoOrcamento] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showAlerta, setShowAlerta] = useState(false);
  const [alertaConfig, setAlertaConfig] = useState({
    tipo: "success",
    titulo: "",
    mensagem: "",
  });

  const gerarHorariosDisponiveis = () => {
    return [
      "09:00", "10:00", "11:00",
      "13:00", "14:00", "15:00",
      "16:00", "17:00", "18:00"
    ];
  };

  const handleCodigoChange = (e) => {
    const valor = e.target.value;
    setCodigoOrcamento(valor);

    if (errors.codigoOrcamento) {
      setErrors((prev) => ({ ...prev, codigoOrcamento: "" }));
    }
  };

  const handleDataChange = (data) => {
    setDataSelecionada(data);
    setHorarioSelecionado("");

    if (data) {
      setHorariosDisponiveis(gerarHorariosDisponiveis(data));
    } else {
      setHorariosDisponiveis([]);
    }

    if (errors.dataSelecionada) {
      setErrors((prev) => ({ ...prev, dataSelecionada: "" }));
    }
  };

  const handleHorarioChange = (horario) => {
    setHorarioSelecionado(horario);

    if (errors.horarioSelecionado) {
      setErrors((prev) => ({ ...prev, horarioSelecionado: "" }));
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

    if (!validateForm()) return;

    if (!user?.email) {
      setAlertaConfig({
        tipo: "error",
        titulo: "Login Necessário",
        mensagem:
          "Você precisa estar logado para fazer um agendamento. Por favor, faça login e tente novamente.",
      });
      setShowAlerta(true);
      return;
    }

    try {
      setLoading(true);

      const isCodigoValido = await agendamentoService.validarCodigoOrcamento(
        codigoOrcamento
      );

      if (!isCodigoValido) {
        setErrors({
          codigoOrcamento:
            "Código de orçamento inválido ou já possui agendamento",
        });

        setAlertaConfig({
          tipo: "error",
          titulo: "Código Inválido",
          mensagem:
            "O código do orçamento não foi encontrado ou já possui um agendamento cadastrado.",
        });
        setShowAlerta(true);
        setLoading(false);
        return;
      }

      const [hora, minuto] = horarioSelecionado.split(":");
      const dataHoraCompleta = `${dataSelecionada}T${hora.padStart(
        2,
        "0"
      )}:${minuto.padStart(2, "0")}:00`;

      const dados = {
        emailUsuario: user.email,
        codigoOrcamento,
        dataHora: dataHoraCompleta,
      };

      await agendamentoService.criarAgendamento(dados);

      setAlertaConfig({
        tipo: "success",
        titulo: "Agendamento Confirmado!",
        mensagem: `Sua sessão foi agendada para o dia ${new Date(
          dataSelecionada + "T00:00:00"
        ).toLocaleDateString("pt-BR")} às ${horarioSelecionado}.`,
      });
      setShowAlerta(true);

      setTimeout(() => {
        onAgendamentoCriado();
      }, 1200);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);

      let mensagem = "Ocorreu um erro ao criar o agendamento.";

      if (error.response?.status === 409) {
        mensagem = "Este código já possui um agendamento.";
        setErrors({ codigoOrcamento: mensagem });
      }

      setAlertaConfig({
        tipo: "error",
        titulo: "Erro ao Agendar",
        mensagem,
      });
      setShowAlerta(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlerta = () => {
    setShowAlerta(false);

    if (alertaConfig.tipo === "success") {
      limparFormulario();
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          width: "90%",
          maxWidth: 520,
          position: "relative",
          maxHeight: "95vh",
          overflowY: "auto",
          color: "#000",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#B70D07",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            width: 36,
            height: 36,
            borderRadius: "50%",
          }}
        >
          ×
        </button>

        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#000" }}>
          Criar Agendamento
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Código */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: "#000" }}>
              Código do Orçamento *
            </label>
            <input
              type="text"
              value={codigoOrcamento}
              onChange={handleCodigoChange}
              className={errors.codigoOrcamento ? "error" : ""}
              style={{
                width: "100%",
                padding: 10,
                border: errors.codigoOrcamento
                  ? "2px solid #ef4444"
                  : "1px solid #ccc",
                borderRadius: 6,
                color: "#000",
                background: "#f3f4f6",
              }}
            />
            {errors.codigoOrcamento && (
              <small style={{ color: "#ef4444" }}>
                {errors.codigoOrcamento}
              </small>
            )}
          </div>

          {/* Data */}
          <div style={{ marginBottom: 8, textAlign: "center", color: "#000" }}>
            <label style={{ fontWeight: 800, color: "#000" }}>Selecione uma data*</label>

            <div style={{ display: "flex", justifyContent: "center", marginTop: -12 }}>
              <div style={{ transform: "scale(0.88)" }}>
                <Calendario
                  onDataSelecionada={handleDataChange}
                  dataSelecionada={dataSelecionada}
                />
              </div>
            </div>

            {errors.dataSelecionada && (
              <small style={{ color: "#ef4444" }}>{errors.dataSelecionada}</small>
            )}
          </div>

          {/* Horários */}
          <div style={{ marginBottom: 16, color: "#000" }}>
            <label style={{ fontWeight: 800, color: "#000" }}>
              Horários Disponíveis *
            </label>

            {horariosDisponiveis.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  marginTop: 10,
                  padding: 10,
                  background: "#f8f9fa",
                  borderRadius: 8,
                  border: "2px solid #e9ecef",
                }}
              >
                {horariosDisponiveis.map((hora) => (
                  <button
                    key={hora}
                    type="button"
                    onClick={() => handleHorarioChange(hora)}
                    onMouseEnter={(e) => {
                      if (horarioSelecionado !== hora) {
                        e.target.style.background = "#d1fae5";
                        e.target.style.borderColor = "#6ee7b7";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (horarioSelecionado !== hora) {
                        e.target.style.background = "#ecfdf5";
                        e.target.style.borderColor = "#d1fae5";
                      }
                    }}
                    style={{
                      padding: "8px 6px",
                      border: horarioSelecionado === hora
                        ? "2px solid #059669"
                        : "2px solid #d1fae5",
                      borderRadius: 5,
                      background: horarioSelecionado === hora
                        ? "#059669"
                        : "#ecfdf5",
                      color: horarioSelecionado === hora
                        ? "#fff"
                        : "#1f2937",
                      fontFamily: "'Martel Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                    }}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            ) : dataSelecionada ? (
              <p style={{ color: "#444" }}>
                Não há horários disponíveis para esta data.
              </p>
            ) : (
              <p style={{ color: "#444" }}>
                Selecione uma data para ver os horários disponíveis.
              </p>
            )}

            {errors.horarioSelecionado && (
              <small style={{ color: "#ef4444" }}>
                {errors.horarioSelecionado}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !codigoOrcamento ||
              !dataSelecionada ||
              !horarioSelecionado
            }
            style={{
              width: "100%",
              padding: 12,
              background: "#870c0e",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Martel Sans', sans-serif",
            }}
          >
            {loading ? "Criando..." : "Confirmar Agendamento"}
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
    </div>
  );
};

export default CriarAgendamento;
