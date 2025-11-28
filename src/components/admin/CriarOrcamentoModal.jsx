import React, { useState } from 'react';
import { CardResposta } from '../generalComponents/cardResposta/CardResposta';
import './criarOrcamentoModal.css';

const CriarOrcamentoModal = ({ aberto, onClose, onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    nome: initialData.nome || '',
    email: initialData.email || '',
    ideia: initialData.ideia || '',
    tamanho: initialData.tamanho || '',
    cores: initialData.cores || [],
    localCorpo: initialData.localCorpo || 'Selecione uma opção',
    imagemReferencia: initialData.imagemReferencia || [],
    valor: '',
    tempo: ''
  });
  const [erro, setErro] = useState(null);

  if (!aberto) return null;

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = () => {
    if (!form.valor || !form.tempo) {
      setErro('Preencha o valor e o tempo estimado da sessão.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <h2 className="modal-title">Criar orçamento</h2>

        <div className="grid-2">
          <div className="field-group">
            <label>Nome completo</label>
            <input type="text" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} />
          </div>
          <div className="field-group">
            <label>Email para contato</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
        </div>

        <div className="field-group">
          <label>Conte sua ideia</label>
          <textarea rows={4} value={form.ideia} onChange={(e) => handleChange('ideia', e.target.value)} />
        </div>

        <div className="grid-2">
          <div className="field-group">
            <label>Tamanho estimado (cm)</label>
            <input type="number" value={form.tamanho} onChange={(e) => handleChange('tamanho', e.target.value)} />
          </div>
          <div className="field-group">
            <label>Local do corpo</label>
            <select value={form.localCorpo} onChange={(e) => handleChange('localCorpo', e.target.value)}>
              {['Selecione uma opção','Braço','Antebraço','Perna','Costas','Costelas','Abdômen','Glúteos','Meio dos seios','Cotovelo','Ombro','Punho','Tornozelo','Pescoço','Outro'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="field-group">
            <label>Valor do tatuagem*</label>
            <input type="text" placeholder="Ex: R$ 500,00" value={form.valor} onChange={(e) => handleChange('valor', e.target.value)} />
          </div>
          <div className="field-group">
            <label>Tempo estimado da sessão*</label>
            <input type="text" placeholder="Ex: 3h30min" value={form.tempo} onChange={(e) => handleChange('tempo', e.target.value)} />
          </div>
        </div>

        {erro && <p className="error-message">{erro}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default CriarOrcamentoModal;
