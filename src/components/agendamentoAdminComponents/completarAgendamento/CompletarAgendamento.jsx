import React, { useState } from "react";
import "./completarAgendamento.css";

const CompletarAgendamento = ({ agendamento, onClose, onSalvar }) => {
  const [tempoDuracao, setTempoDuracao] = useState("");
  const [pagamentoFeito, setPagamentoFeito] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [errors, setErrors] = useState({});

  // Passa dados automaticamente quando mudam
  React.useEffect(() => {
    const payload = {
      tempoDuracao: tempoDuracao ? parseInt(tempoDuracao, 10) : null,
      pagamentoFeito: pagamentoFeito === "sim" ? true : pagamentoFeito === "nao" ? false : null,
      formaPagamento: pagamentoFeito === "sim" ? formaPagamento : null,
      isValid: !!tempoDuracao && !!pagamentoFeito && (pagamentoFeito === "nao" || !!formaPagamento)
    };
    onSalvar(payload);
  }, [tempoDuracao, pagamentoFeito, formaPagamento, onSalvar]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="modal-overlay-completar">
      <div className="modal-content-completar">
        <h2>Completar agendamento</h2>
        
        <form>
          <div className="form-group-completar">
            <label>Digite o tempo da sessão em minutos*</label>
            <input
              type="number"
              placeholder="Digite o tempo"
              value={tempoDuracao}
              onChange={(e) => {
                setTempoDuracao(e.target.value);
                setErrors((prev) => ({ ...prev, tempoDuracao: "" }));
              }}
              min="1"
            />
            {errors.tempoDuracao && (
              <small className="error-text">{errors.tempoDuracao}</small>
            )}
          </div>

          <div className="form-group-completar">
            <label>Pagamento foi feito?*</label>
            <select
              value={pagamentoFeito}
              onChange={(e) => {
                setPagamentoFeito(e.target.value);
                setErrors((prev) => ({ ...prev, pagamentoFeito: "" }));
                if (e.target.value === "nao") {
                  setFormaPagamento("");
                }
              }}
            >
              <option value="">Selecione uma opção</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
            {errors.pagamentoFeito && (
              <small className="error-text">{errors.pagamentoFeito}</small>
            )}
          </div>

          {pagamentoFeito === "sim" && (
            <div className="form-group-completar">
              <label>Forma de pagamento*</label>
              <select
                value={formaPagamento}
                onChange={(e) => {
                  setFormaPagamento(e.target.value);
                  setErrors((prev) => ({ ...prev, formaPagamento: "" }));
                }}
              >
                <option value="">Selecione uma opção</option>
                <option value="PIX">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão</option>
              </select>
              {errors.formaPagamento && (
                <small className="error-text">{errors.formaPagamento}</small>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompletarAgendamento;
