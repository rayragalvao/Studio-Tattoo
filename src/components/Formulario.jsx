import React, { useState } from "react";
import "../styles/formulario.css";

const Formulario = ({ 
  titulo = "Do esboço ao real: Seu projeto começa aqui.",
  subtitulo = "Conte sua ideia, nós criamos a arte.",
  campos = [],
  onSubmit,
  submitButtonText = "Enviar orçamento",
  className = ""
}) => {
  const [dadosFormulario, setDadosFormulario] = useState(() => {
    const dadosIniciais = {};
    campos.forEach(campo => {
      if (campo.type === 'file') {
        dadosIniciais[campo.name] = [];
      } else if (campo.type === 'checkbox group') {
        dadosIniciais[campo.name] = [];
      } else {
        dadosIniciais[campo.name] = '';
      }

      if (campo.type === 'select') {
        dadosIniciais[`${campo.name}_outro`] = '';
      }
    });
    return dadosIniciais;
  });

  const [erros, setErros] = useState({});

  const handleMudancaInput = (evento) => {
    const { name: nome, value: valor } = evento.target;
    setDadosFormulario(prev => ({
      ...prev,
      [nome]: valor
    }));
    
    if (erros[nome]) {
      setErros(prev => ({
        ...prev,
        [nome]: ""
      }));
    }
  };

  const handleMudancaArquivo = (evento) => {
    const arquivos = Array.from(evento.target.files || []);
    const nomeCampo = evento.target.name;

    const imagens = arquivos.filter(f => f.type && f.type.startsWith('image/'));

    if (imagens.length > 5) {
      imagens.length = 5;
    }

    setDadosFormulario(prev => ({
      ...prev,
      [nomeCampo]: imagens
    }));
  };

  const handleMudancaCheckbox = (nomeCampo, valorOpcao) => {
    setDadosFormulario(prev => {
      const atual = Array.isArray(prev[nomeCampo]) ? prev[nomeCampo] : [];
      const existe = atual.includes(valorOpcao);
      const atualizado = existe ? atual.filter(v => v !== valorOpcao) : [...atual, valorOpcao];
      return {
        ...prev,
        [nomeCampo]: atualizado
      };
    });
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    campos.forEach(campo => {
      if (campo.required) {
        const valorCampo = dadosFormulario[campo.name];

        if (campo.type === 'select' && String(valorCampo).toLowerCase() === 'outro') {
          const outroValor = dadosFormulario[`${campo.name}_outro`];
          if (!outroValor || !String(outroValor).trim()) {
            novosErros[`${campo.name}_outro`] = campo.errorMessage || `Digite o ${campo.label}`;
          }
        } else if (!valorCampo || (typeof valorCampo === 'string' && !valorCampo.trim())) {
          novosErros[campo.name] = campo.errorMessage || `${campo.label} é obrigatório`;
        } else if (campo.type === 'email' && !/\S+@\S+\.\S+/.test(valorCampo)) {
          novosErros[campo.name] = "Email inválido";
        }
      }
    });

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    const dadosEnvio = { ...dadosFormulario };
    campos.forEach(campo => {
       if (campo.type === 'select') {
        const val = String(dadosEnvio[campo.name] || '');
        if (val.toLowerCase() === 'outro') {
          dadosEnvio[campo.name] = dadosEnvio[`${campo.name}_outro`] || '';
        }
        delete dadosEnvio[`${campo.name}_outro`];
      }

      if (campo.type === 'checkbox group') {
        const selecoes = Array.isArray(dadosEnvio[campo.name]) ? dadosEnvio[campo.name] : [];
        if (selecoes.length === 0) {
          dadosEnvio[campo.name] = '';
        } else if (selecoes.length === 1) {
          dadosEnvio[campo.name] = selecoes[0];
        } else if (selecoes.length === 2) {
          dadosEnvio[campo.name] = `${selecoes[0]} e ${selecoes[1]}`;
        } else {
           const ultimo = selecoes[selecoes.length - 1];
          const outros = selecoes.slice(0, -1).join(', ');
          dadosEnvio[campo.name] = `${outros} e ${ultimo}`;
        }
      }
    });

    onSubmit(dadosEnvio);
  };

  const renderField = (campo) => {
    const classeInput = erros[campo.name] ? 'error' : '';

    switch (campo.type) {
      case 'textarea':
        return (
          <textarea
            id={campo.name}
            name={campo.name}
            value={dadosFormulario[campo.name] || ''}
            onChange={handleMudancaInput}
            placeholder={campo.placeholder}
            rows={campo.rows || 4}
            className={classeInput}
          />
        );

      case 'select':
        return (
          <>
            <select
              id={campo.name}
              name={campo.name}
              value={dadosFormulario[campo.name] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setDadosFormulario(prev => ({ ...prev, [campo.name]: val, [`${campo.name}_outro`]: val.toLowerCase() === 'outro' ? prev?.[`${campo.name}_outro`] : '' }));
                if (erros[campo.name]) {
                  setErros(prev => ({ ...prev, [campo.name]: '' }));
                }
              }}
              className={classeInput}
            >
              {campo.options?.map((opcao, index) => (
                <option key={index} value={index === 0 ? "" : opcao}>
                  {opcao}
                </option>
              ))}
            </select>

            {String(dadosFormulario[campo.name]).toLowerCase() === 'outro' && (
              <input
                type="text"
                id={`${campo.name}_outro`}
                name={`${campo.name}_outro`}
                value={dadosFormulario[`${campo.name}_outro`] || ''}
                onChange={handleMudancaInput}
                placeholder={`Especifique ${campo.label.toLowerCase()}`}
                className={classeInput}
              />
            )}
          </>
        );

      case 'file':
        return (
          <div className="file-upload-container">
            <input
              type="file"
              id={campo.name}
              name={campo.name}
              onChange={handleMudancaArquivo}
              accept={campo.accept || "image/*"}
              className="file-input"
              multiple
            />
            <div className="file-upload-area">
              <p>{campo.fileText || "📷 Clique para enviar arquivo"}</p>
              <p>{campo.fileSubtext || "Arraste e solte ou clique para selecionar"}</p>
            </div>
            {Array.isArray(dadosFormulario[campo.name]) && dadosFormulario[campo.name].length > 0 && (
              <div className="file-selected">
                {dadosFormulario[campo.name].slice(0,5).map((f, i) => (
                  <p key={i} className="file-name">{f.name}</p>
                ))}
                {dadosFormulario[campo.name].length > 5 && (
                  <p className="file-name">...mais {dadosFormulario[campo.name].length - 5} arquivos</p>
                )}
              </div>
            )}
          </div>
        );

      case 'checkbox group':
        return (
          <div className={`checkbox-group ${classeInput}`}>
            {campo.options?.map((opcao, idx) => {
              const optionValue = typeof opcao === 'string' ? opcao : opcao.value;
              const optionLabel = typeof opcao === 'string' ? opcao : opcao.label;
              const checked = Array.isArray(dadosFormulario[campo.name]) && dadosFormulario[campo.name].includes(optionValue);

              return (
                <label key={idx} className="checkbox-item">
                  <input
                    type="checkbox"
                    name={campo.name}
                    value={optionValue}
                    checked={checked}
                    onChange={() => handleMudancaCheckbox(campo.name, optionValue)}
                  />
                  {optionLabel}
                </label>
              );
            })}
          </div>
        );

      default:
        return (
          <input
            type={campo.type || 'text'}
            id={campo.name}
            name={campo.name}
            value={dadosFormulario[campo.name] || ''}
            onChange={handleMudancaInput}
            placeholder={campo.placeholder}
            className={classeInput}
          />
        );
    }
  };

  return (
    <section className="orcamento-section">
      <div className="orcamento-container">
        {(titulo || subtitulo) && (
          <div className="orcamento-header">
            {titulo && (
              <h1>{titulo}</h1>
            )}
            {subtitulo && (
              <p>{subtitulo}</p>
            )}
          </div>
        )}

        <form 
          onSubmit={enviarFormulario} 
          className="orcamento-form"
        >
          {campos.map((campo, index) => (
            <div key={campo.name} className="form-group">
              <label htmlFor={campo.name}>
                {campo.label}
                {campo.required && <span className="required">*</span>}
              </label>
              
              {renderField(campo)}
              
              {erros[campo.name] && (
                <span className="error-message">
                  {erros[campo.name]}
                </span>
              )}
            </div>
          ))}

          <button 
            type="submit" 
            className="submit-button"
          >
            {submitButtonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Formulario;