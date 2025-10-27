import React, { useEffect, useState } from 'react';
import '../styles/formulario.css';
import { BarraCarregamento } from './BarraCarregamento';

const Formulario = ({
  titulo = 'Do esboço ao real: Seu projeto começa aqui.',
  subtitulo = 'Conte sua ideia, nós criamos a arte.',
  campos = [],
  onSubmit,
  submitButtonText = 'Enviar orçamento',
  className = '',
  initialValues = {},
  isSubmitting = false,
}) => {
  const [dadosFormulario, setDadosFormulario] = useState(() => {
    const inicial = {};
    campos.forEach((campo) => {
      if (campo.type === 'file') inicial[campo.name] = [];
      else if (campo.type === 'checkbox group') inicial[campo.name] = [];
      else inicial[campo.name] = '';

      if (campo.type === 'select') inicial[`${campo.name}_outro`] = '';
    });
    return { ...inicial, ...initialValues };
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    setDadosFormulario((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);

  // Handlers
  const handleMudancaInput = (e) => {
    const { name, value } = e.target;
    setDadosFormulario((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMudancaArquivo = (e) => {
    const nome = e.target.name;
    const arquivos = Array.from(e.target.files || []).filter((f) => f.type && f.type.startsWith('image/'));
    if (arquivos.length > 5) arquivos.length = 5;
    setDadosFormulario((prev) => ({ ...prev, [nome]: arquivos }));
    if (erros[nome]) setErros((prev) => ({ ...prev, [nome]: '' }));
  };

  const handleMudancaCheckbox = (nomeCampo, valorOpcao) => {
    setDadosFormulario((prev) => {
      const atual = Array.isArray(prev[nomeCampo]) ? prev[nomeCampo] : [];
      const existe = atual.includes(valorOpcao);
      const atualizado = existe ? atual.filter((v) => v !== valorOpcao) : [...atual, valorOpcao];
      return { ...prev, [nomeCampo]: atualizado };
    });
    if (erros[nomeCampo]) setErros((prev) => ({ ...prev, [nomeCampo]: '' }));
  };

  const validarFormulario = () => {
    const novosErros = {};
    campos.forEach((campo) => {
      if (!campo.required) return;
      const valor = dadosFormulario[campo.name];

      if (campo.type === 'select' && String(valor).toLowerCase() === 'outro') {
        const outro = dadosFormulario[`${campo.name}_outro`];
        if (!outro || !String(outro).trim()) novosErros[`${campo.name}_outro`] = campo.errorMessage || `Digite o ${campo.label}`;
      } else if (!valor || (typeof valor === 'string' && !valor.trim()) || (Array.isArray(valor) && valor.length === 0)) {
        novosErros[campo.name] = campo.errorMessage || `${campo.label} é obrigatório`;
      } else if (campo.type === 'email' && !/\S+@\S+\.\S+/.test(valor)) {
        novosErros[campo.name] = 'Email inválido';
      }
    });
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const enviarFormulario = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return; // evita duplo envio
    if (!validarFormulario()) return;

    const dadosEnvio = { ...dadosFormulario };

    campos.forEach((campo) => {
      if (campo.type === 'select') {
        const val = String(dadosEnvio[campo.name] || '');
        if (val.toLowerCase() === 'outro') dadosEnvio[campo.name] = dadosEnvio[`${campo.name}_outro`] || '';
        delete dadosEnvio[`${campo.name}_outro`];
      }

      if (campo.type === 'checkbox group') {
        const arr = Array.isArray(dadosEnvio[campo.name]) ? dadosEnvio[campo.name] : [];
        dadosEnvio[campo.name] = arr.join(', ');
      }
    });

    if (onSubmit) onSubmit(dadosEnvio);
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
              onChange={handleMudancaInput}
              className={classeInput}
            >
              {campo.options?.map((opcao, idx) => (
                <option key={idx} value={idx === 0 ? '' : opcao}>
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
        const hasFiles = Array.isArray(dadosFormulario[campo.name]) && dadosFormulario[campo.name].length > 0;

        const handleRemoveFiles = () => {
          setDadosFormulario((prev) => ({ ...prev, [campo.name]: [] }));
        };

        const isPortfolioImage = typeof dadosFormulario[campo.name]?.[0] === 'string';

        return (
          <div className="file-upload-container">
            <input
              type="file"
              id={campo.name}
              name={campo.name}
              onChange={handleMudancaArquivo}
              accept={campo.accept || 'image/*'}
              className="file-input"
              multiple
              style={{ display: 'none' }} 
            />

            <label htmlFor={campo.name} className="file-upload-area">
              {!hasFiles && (
                <div className="file-upload-placeholder">
                  <p>{campo.fileText || 'Clique para enviar ou arraste o arquivo'}</p>
                  <p>{campo.fileSubtext || 'Tamanho máximo 5MB'}</p>
                </div>
              )}

              {hasFiles && (
                <div className="file-selected">
                  {dadosFormulario[campo.name].slice(0, 5).map((f, i) =>
                    typeof f === 'string' ? (
                      <img
                        key={i}
                        src={f}
                        alt="Pré-visualização"
                        className="preview-imagem"
                      />
                    ) : (
                      <p key={i} className="file-name">
                        {f.name}
                      </p>
                    )
                  )}
                  {dadosFormulario[campo.name].length > 5 && (
                    <p className="file-name">
                      ...mais {dadosFormulario[campo.name].length - 5} arquivos
                    </p>
                  )}
                  <button 
                    type="button" 
                    onClick={handleRemoveFiles} 
                    className="remove-file-button"
                    disabled={isPortfolioImage}
                  >
                    &times;
                  </button>
                </div>
              )}
            </label>
          </div>
        );


      case 'checkbox group':
        return (
          <div className={`checkbox-group ${classeInput}`}>
            {campo.options?.map((opcao, idx) => {
              const optionValue = typeof opcao === 'string' ? opcao : opcao.value;
              const optionLabel = typeof opcao === 'string' ? opcao : opcao.label;
              const checked =
                Array.isArray(dadosFormulario[campo.name]) &&
                dadosFormulario[campo.name].includes(optionValue);
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
    <section className={`orcamento-section ${className}`}>
      <div className="orcamento-container">
        {(titulo || subtitulo) && (
          <div className="orcamento-header">
            {titulo && <h1>{titulo}</h1>}
            {subtitulo && <p>{subtitulo}</p>}
          </div>
        )}

        <form onSubmit={enviarFormulario} className="orcamento-form">
          {campos.map((campo) => (
            <div key={campo.name} className="form-group">
              <label htmlFor={campo.name}>
                {campo.label}
                {campo.required && <span className="required">*</span>}
              </label>

              {renderField(campo)}

              {erros[campo.name] && (
                <span className="error-message">{erros[campo.name]}</span>
              )}
              {erros[`${campo.name}_outro`] && (
                <span className="error-message">{erros[`${campo.name}_outro`]}</span>
              )}
            </div>
          ))}

          <div className="submit-row">
            <button type="submit" className="submit-button" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'Enviando...' : submitButtonText}
            </button>

            {isSubmitting && (
              <div className="form-loading">
                <BarraCarregamento />
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Formulario;