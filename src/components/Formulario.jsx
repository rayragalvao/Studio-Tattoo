import React, { useState, useEffect, useRef } from "react"; 
import "../styles/formulario.css";

const Formulario = ({
  titulo = "Do esboço ao real: Seu projeto começa aqui.",
  subtitulo = "Conte sua ideia, nós criamos a arte.",
  campos = [],
  onSubmit,
  submitButtonText = "Enviar orçamento",
  className = "",
  isPortfolioImagem = false, 
  initialValues = {},
}) => {
  const [dadosFormulario, setDadosFormulario] = useState({});
  const [previewImagem, setPreviewImagem] = useState(null);
  const [erros, setErros] = useState({});
  const [containerSize, setContainerSize] = useState({ width: 200, height: 230 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const dadosIniciais = {};
    campos.forEach((campo) => {
      if (campo.type === "file" || campo.type === "checkbox group") {
        dadosIniciais[campo.name] = [];
      } else {
        dadosIniciais[campo.name] = initialValues[campo.name] || "";
      }
      if (campo.type === "select") {
        dadosIniciais[`${campo.name}_outro`] = "";
      }
    });

    if (initialValues.imagem) {
      fetch(initialValues.imagem)
        .then((res) => res.blob())
        .then((blob) => {
          const nomeArquivo = initialValues.titulo?.replace(/\s/g, "_") || "imagem.png";
          const file = new File([blob], nomeArquivo, { type: blob.type });
          dadosIniciais.imagemReferencia = [file];
          setPreviewImagem(URL.createObjectURL(file));
        });
    }

    setDadosFormulario(dadosIniciais);
  }, [initialValues, campos]);

  // Ajusta o tamanho do container baseado na proporção da imagem
  useEffect(() => {
    if (previewImagem) {
      const img = new Image();
      img.src = previewImagem;
      img.onload = () => {
        const proporcao = img.width / img.height;
        const maxWidth = 200; // largura máxima
        setContainerSize({
          width: maxWidth,
          height: maxWidth / proporcao,
        });
      };
    }
  }, [previewImagem]);

  const handleMudancaInput = (evento) => {
    const { name, value } = evento.target;
    setDadosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleMudancaArquivo = (evento) => {
    const { name, files } = evento.target;
    if (files.length > 0) {
      setDadosFormulario((prev) => ({ ...prev, [name]: Array.from(files) }));
      const firstFile = files[0];
      setPreviewImagem(URL.createObjectURL(firstFile));
    }
  };

  const handleRemoverImagem = (campoNome) => {
    if (previewImagem) URL.revokeObjectURL(previewImagem);
    setPreviewImagem(null);
    setDadosFormulario((prev) => ({ ...prev, [campoNome]: [] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validarFormulario = () => {
    // Aqui você pode adicionar validação personalizada
    return true;
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();
    if (!validarFormulario()) return;
    if (onSubmit) onSubmit(dadosFormulario);
  };

  const renderField = (campo) => {
    const classeInput = erros[campo.name] ? "error" : "";

    switch (campo.type) {
      case "file":
        if (isPortfolioImagem) {
          return previewImagem ? (
            <div
              className="file-preview-static"
              style={{
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
              }}
            >
              <img
                src={previewImagem}
                alt="Referência do Portfólio"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "9px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          ) : null;
        }

        return (
          <div className="file-upload-container">
            <input
              type="file"
              id={campo.name}
              name={campo.name}
              onChange={handleMudancaArquivo}
              accept={campo.accept || "image/*"}
              className="file-input"
              ref={fileInputRef}
              multiple
            />
            <label
              htmlFor={campo.name}
              className={`file-upload-area ${previewImagem ? "has-image" : ""}`}
            >
              {previewImagem ? (
                <div className="file-preview">
                  <img
                    src={previewImagem}
                    alt="Pré-visualização"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => handleRemoverImagem(campo.name)}
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="file-upload-placeholder">
                  <p>{campo.fileText || "Clique para enviar sua referência"}</p>
                  <p className="file-subtext">{campo.fileSubtext || "PNG, JPG, etc."}</p>
                </div>
              )}
            </label>
            {Array.isArray(dadosFormulario[campo.name]) &&
              dadosFormulario[campo.name].length > 0 &&
              !previewImagem && (
                <div className="file-selected-list">
                  <p>Arquivo: {dadosFormulario[campo.name][0].name}</p>
                </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type={campo.type || "text"}
            id={campo.name}
            name={campo.name}
            value={dadosFormulario[campo.name] || ""}
            onChange={handleMudancaInput}
            placeholder={campo.placeholder}
            className={classeInput}
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

        <form onSubmit={enviarFormulario} className="orcamento-form" noValidate>
          {campos.map((campo) => {
            if (isPortfolioImagem && campo.type === 'file' && !previewImagem) {
              return null;
            }
            
            return (
              <div key={campo.name} className="form-group">
                <label htmlFor={campo.name}>
                  {campo.label}
                  {campo.required && <span className="required">*</span>}
                </label>
                {renderField(campo)}
                {erros[campo.name] && <span className="error-message">{erros[campo.name]}</span>}
              </div>
            );
          })}
          <button type="submit" className="submit-button">{submitButtonText}</button>
        </form>
      </div>
    </section>
  );
};

export default Formulario;
