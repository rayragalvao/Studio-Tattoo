import React, { useState, useEffect } from "react";
import "../styles/formulario.css";

const Formulario = ({
  titulo = "Do esboço ao real: Seu projeto começa aqui.",
  subtitulo = "Conte sua ideia, nós criamos a arte.",
  campos = [],
  onSubmit,
  submitButtonText = "Enviar orçamento",
  className = "",
  initialValues = {}, // Recebe valores iniciais do card
}) => {
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    campos.forEach((campo) => {
      initialData[campo.name] =
        initialValues[campo.name] !== undefined
          ? initialValues[campo.name]
          : campo.type === "file"
          ? null
          : "";
    });
    return initialData;
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagemReferencia: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    campos.forEach((campo) => {
      if (campo.required) {
        const value = formData[campo.name];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[campo.name] =
            campo.errorMessage || `${campo.label} é obrigatório`;
        } else if (campo.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[campo.name] = "Email inválido";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const renderField = (campo) => {
    const inputClass = errors[campo.name] ? "error" : "";

    switch (campo.type) {
      case "textarea":
        return (
          <textarea
            id={campo.name}
            name={campo.name}
            value={formData[campo.name] || ""}
            onChange={handleInputChange}
            placeholder={campo.placeholder}
            rows={campo.rows || 4}
            className={inputClass}
          />
        );

      case "select":
        return (
          <select
            id={campo.name}
            name={campo.name}
            value={formData[campo.name] || ""}
            onChange={handleInputChange}
            className={inputClass}
          >
            {campo.options?.map((opcao, index) => (
              <option key={index} value={index === 0 ? "" : opcao}>
                {opcao}
              </option>
            ))}
          </select>
        );

      case "file":
        return (
          <div className="file-upload-container">
            <input
              type="file"
              id={campo.name}
              name={campo.name}
              onChange={handleFileChange}
              accept={campo.accept || "image/*"}
              className="file-input"
            />
            <div className="file-upload-area">
              <p>{campo.fileText || "📷 Clique para enviar arquivo"}</p>
              <p>{campo.fileSubtext || "Arraste e solte ou clique para selecionar"}</p>
            </div>
            {formData[campo.name] && (
              <p className="file-selected">
                Arquivo selecionado: {formData[campo.name].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type={campo.type || "text"}
            id={campo.name}
            name={campo.name}
            value={
              campo.type === "number" && formData[campo.name] !== ""
                ? Number(formData[campo.name])
                : formData[campo.name] || ""
            }
            onChange={handleInputChange}
            placeholder={campo.placeholder}
            className={inputClass}
          />
        );
    }
  };

  return (
    <section className={`orcamento-section ${className}`}>
      <div className="orcamento-container">
        {(titulo || subtitulo) && (
          <div className="orcamento-header">
            {titulo && <h1>{titulo}</h1>}
            {subtitulo && <p>{subtitulo}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="orcamento-form">
          {campos.map((campo) => (
            <div key={campo.name} className="form-group">
              <label htmlFor={campo.name}>
                {campo.label}
                {campo.required && <span className="required">*</span>}
              </label>

              {renderField(campo)}

              {errors[campo.name] && (
                <span className="error-message">{errors[campo.name]}</span>
              )}
            </div>
          ))}

          <button type="submit" className="submit-button">
            {submitButtonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Formulario;
