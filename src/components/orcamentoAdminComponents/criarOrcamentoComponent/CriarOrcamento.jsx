import { useState } from "react";
import orcamentoService from "../../../services/OrcamentoService.js";
import '../modalSucessoComponent/modalSucesso.css';

const CriarOrcamento = ({ onClose, onOrcamentoCriado }) => {
  const [cardResposta, setCardResposta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estado simples dos campos (sem reutilizar o componente Formulario)
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    ideia: "",
    tamanho: "",
    cores: [],
    localCorpo: "Selecione uma opção",
    imagemReferencia: [],
    valor: "",
    tempo: "",
  });

  const coresOpcoes = [
    { value: "preto", label: "Preto" },
    { value: "vermelho", label: "Vermelho" },
  ];

  const locais = [
    "Selecione uma opção",
    "Braço",
    "Antebraço",
    "Perna",
    "Costas",
    "Costelas",
    "Abdômen",
    "Glúteos",
    "Meio dos seios",
    "Cotovelo",
    "Ombro",
    "Punho",
    "Tornozelo",
    "Pescoço",
    "Outro",
  ];

  const updateField = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCor = (cor) => {
    setFormValues((prev) => {
      const jaTem = prev.cores.includes(cor);
      return { ...prev, cores: jaTem ? prev.cores.filter((c) => c !== cor) : [...prev.cores, cor] };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    updateField("imagemReferencia", files);
  };

  // Formatação de valor e tempo (igual OrcamentoDetail)
  const formatarValor = (value) => {
    const numero = value.replace(/\D/g, '');
    if(!numero) return '';
    const valorNumerico = Number(numero)/100;
    return valorNumerico.toLocaleString('pt-BR',{ style:'currency', currency:'BRL'});
  };

  const handleValorChange = (e) => {
    updateField("valor", formatarValor(e.target.value));
  };

  const formatarTempo = (value) => {
    const num = value.replace(/\D/g,'');
    if(!num) return '';
    if(num.length <=2) return num + 'h';
    const horas = num.slice(0,-2); 
    const minutos = num.slice(-2);
    return `${horas}h${minutos}min`;
  };

  const handleTempoChange = (e) => {
    const num = e.target.value.replace(/\D/g,'');
    if(num.length<=4){
      updateField("tempo", formatarTempo(e.target.value));
    }
  };

  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Erro ao converter URL para File:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    console.log('📤 Iniciando criação de orçamento...');
    console.log('📋 Valores do formulário:', formValues);
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("status", "PENDENTE");
      
      for (const [key, value] of Object.entries(formValues)) {
        if (value === null || value === undefined || value === "") continue;
        
        if (key === "imagemReferencia") {
          if (Array.isArray(value) && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              const item = value[i];
              if (item instanceof File) {
                formData.append("imagemReferencia", item);
                console.log(`📎 Imagem ${i+1} adicionada:`, item.name);
              } else if (typeof item === "string" && item.startsWith("http")) {
                const file = await urlToFile(item, `ref-image-${i}.jpg`);
                if (file) formData.append("imagemReferencia", file);
              }
            }
          }
        } else if (key === "cores") {
          value.forEach((v) => formData.append("cores", v));
          console.log('🎨 Cores:', value);
        } else if (key === "valor" && value) {
          const numero = value.replace(/\D/g, '');
          if(numero) {
            const valorNumerico = Number(numero)/100;
            formData.append("valor", valorNumerico);
            console.log('💰 Valor:', valorNumerico);
          }
        } else if (key === "tempo" && value) {
          const num = value.replace(/\D/g,'');
          if(num) {
            const horas = num.length <= 2 ? num : num.slice(0,-2);
            const minutos = num.length <= 2 ? '00' : num.slice(-2);
            const tempoFormatado = `${horas.padStart(2,'0')}:${minutos.padStart(2,'0')}:00`;
            formData.append("tempo", tempoFormatado);
            console.log('⏱️ Tempo:', tempoFormatado);
          }
        } else {
          formData.append(key, value);
          console.log(`📝 ${key}:`, value);
        }
      }
      
      console.log('🚀 Enviando para o backend...');
      const response = await orcamentoService.criar(formData);
      console.log('✅ Orçamento criado:', response);

      // Após criar, enviar a resposta com valor e tempo para disparar o e-mail, como no OrcamentoDetail
      const codigoCriado = response.codigo || response.codigoOrcamento;
      if (codigoCriado) {
        const parseValor = (v) => {
          if (!v) return null;
          const num = String(v).replace(/[^0-9,\.]/g, '').replace(',', '.');
          const parsed = parseFloat(num);
          return isNaN(parsed) ? null : parsed;
        };
        const normalizeTempo = (t) => {
          if (!t) return null;
          const s = String(t).toLowerCase();
          const hmMatch = s.match(/(\d+)h(\d{1,2})?min?/);
          if (hmMatch) {
            const h = hmMatch[1].padStart(2, '0');
            const m = (hmMatch[2] || '00').padStart(2, '0');
            return `${h}:${m}:00`;
          }
          const parts = s.split(':');
          if (parts.length === 2) {
            const h = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            return `${h}:${m}:00`;
          }
          if (parts.length === 3) {
            const h = parts[0].padStart(2, '0');
            const m = parts[1].padStart(2, '0');
            const sec = parts[2].padStart(2, '0');
            return `${h}:${m}:${sec}`;
          }
          const onlyHours = s.match(/^\d+$/) ? s : null;
          if (onlyHours) {
            const h = onlyHours.padStart(2, '0');
            return `${h}:00:00`;
          }
          return null;
        };
        const payloadResposta = {
          nome: formValues.nome,
          email: formValues.email,
          ideia: formValues.ideia,
          tamanho: formValues.tamanho,
          cores: formValues.cores,
          localCorpo: formValues.localCorpo,
          valor: parseValor(formValues.valor),
          tempo: normalizeTempo(formValues.tempo),
          status: 'APROVADO',
        };
        console.log('📤 Enviando resposta com valor/tempo para e-mail:', codigoCriado, payloadResposta);
        try {
          const respEnvio = await orcamentoService.responder(codigoCriado, payloadResposta);
          console.log('✉️ E-mail enviado (backend respondeu):', respEnvio);
        } catch (e) {
          console.error('⚠️ Falha ao enviar resposta pós-criação:', e.response?.data || e.message);
        }
      }

      setCardResposta({
        tipo: "sucesso",
        mensagem: `Orçamento criado com sucesso! Código: ${codigoCriado || "N/A"}`,
      });
    } catch (error) {
      console.error('❌ Erro ao criar orçamento:', error);
      console.error('❌ Detalhes:', error.response?.data);
      const mensagemErro = error.response?.data?.message || error.message || "Problema inesperado.";
      setCardResposta({
        tipo: "erro",
        mensagem: `Erro: ${mensagemErro}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fecharFeedback = () => {
    setCardResposta(null);
    if (cardResposta?.tipo === "sucesso") {
      if (onOrcamentoCriado) onOrcamentoCriado();
      if (onClose) onClose();
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1000,padding:12}} onClick={onClose}>
      <div className="criar-orcamento-modal" style={{background:"var(--branco)",border:"1px solid #ddd",width:"90%",maxWidth:640,padding:24,borderRadius:10,position:"relative",boxShadow:"0 20px 40px rgba(0,0,0,0.4)",maxHeight:"90vh",overflowY:"auto"}} onClick={(e)=>e.stopPropagation()}>
        <style>{`
          :root { --vermelho-forte: #B70D07; }
          .criar-orcamento-modal input:not([type="checkbox"]):not([type="file"]), .criar-orcamento-modal textarea, .criar-orcamento-modal select {
            background:var(--cinza-claro);border:2px solid #e1e5e9;border-radius:5px;padding:8px 10px;font-size:13px;color:var(--cinza-escuro);font-family:'Martel Sans',sans-serif;font-weight:500;transition:all 0.3s ease;width:100%;box-sizing:border-box;
          }
          .criar-orcamento-modal input:focus, .criar-orcamento-modal textarea:focus, .criar-orcamento-modal select:focus {
            outline:none;border-color:var(--vermelho-forte);background:#fff;
          }
          .criar-orcamento-modal input::placeholder, .criar-orcamento-modal textarea::placeholder {color:#999;}
          .criar-orcamento-modal h3 {font-size:22px;color:var(--cinza-escuro);font-weight:700;font-family:'Montserrat Alternates',sans-serif;}
          .criar-orcamento-modal label span {color:var(--cinza-escuro);font-weight:600;font-size:14px;font-family:'Martel Sans',sans-serif;display:block;margin-bottom:3px;}
          .criar-orcamento-modal .checkbox-group {display:flex;gap:16px;flex-wrap:wrap;padding:8px 0;}
          .criar-orcamento-modal .checkbox-label {display:flex;align-items:center;gap:6px;font-size:14px;color:var(--cinza-escuro);cursor:pointer;font-family:'Martel Sans',sans-serif;}
          .criar-orcamento-modal input[type="checkbox"] {width:18px;height:18px;cursor:pointer;accent-color:var(--vermelho-forte);}
          .criar-orcamento-modal .file-upload-area {
            display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;width:100%;min-height:80px;
            border:2px dashed var(--vermelho-forte);border-radius:5px;background:rgba(183,13,7,0.05);cursor:pointer;transition:all 0.3s ease;padding:12px;
          }
          .criar-orcamento-modal .file-upload-area:hover {border-color:var(--vermelho-forte);background:rgba(183,13,7,0.1);transform:translateY(-2px);box-shadow:0 8px 25px rgba(183,13,7,0.3);}
          .criar-orcamento-modal .file-upload-area p {margin:0;font-size:11px;color:var(--cinza-escuro);font-family:'Martel Sans',sans-serif;}
          .criar-orcamento-modal .file-upload-area p:first-child {font-weight:700;margin-bottom:3px;color:var(--vermelho-forte);font-size:12px;}
          .criar-orcamento-modal .file-upload-area p:last-child {color:#6c6c6c;}
          .criar-orcamento-modal .file-selected {margin-top:8px;font-size:12px;color:var(--vermelho-forte);font-weight:700;font-family:'Martel Sans',sans-serif;}
        `}</style>
        <button onClick={onClose} aria-label="Fechar" style={{position:"absolute",top:12,right:12,background:"#B70D07",color:"#fff",border:"none",cursor:"pointer",fontSize:20,fontWeight:"bold",lineHeight:1,width:36,height:36,borderRadius:"50%",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseOver={(e)=>{e.target.style.background="#8A0A05";e.target.style.transform="scale(1.1)";}} onMouseOut={(e)=>{e.target.style.background="#B70D07";e.target.style.transform="scale(1)";}}>×</button>
        <h3 style={{margin:"0 0 16px",textAlign:"center"}}>Criar orçamento</h3>
        <form onSubmit={(e)=>{e.preventDefault();handleSubmit();}} style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13 }}><span>Nome completo*</span></label>
            <input value={formValues.nome} onChange={(e)=>updateField("nome", e.target.value)} required placeholder="Digite o nome" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Email para contato*</span></label>
            <input type="email" value={formValues.email} onChange={(e)=>updateField("email", e.target.value)} required placeholder="Digite o e-mail" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Descrição da ideia*</span></label>
            <textarea value={formValues.ideia} onChange={(e)=>updateField("ideia", e.target.value)} required rows={3} placeholder="Descreva a ideia" style={{ resize:"vertical",minHeight:"70px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Tamanho estimado (cm)*</span></label>
            <input type="number" value={formValues.tamanho} onChange={(e)=>updateField("tamanho", e.target.value)} required placeholder="Ex: 10" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13 }}><span>Cor desejada*</span></label>
            <div className="checkbox-group">
              {coresOpcoes.map((c) => (
                <label key={c.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formValues.cores.includes(c.value)}
                    onChange={() => toggleCor(c.value)}
                    required={formValues.cores.length === 0}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Local do corpo*</span></label>
            <select value={formValues.localCorpo} onChange={(e)=>updateField("localCorpo", e.target.value)} required >
              {locais.map((l)=>(<option key={l} value={l}>{l}</option>))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Valor da tatuagem*</span></label>
            <input type="text" value={formValues.valor} onChange={handleValorChange} placeholder="Ex: R$ 500,00" required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 13 }}><span>Tempo estimado da sessão*</span></label>
            <input type="text" value={formValues.tempo} onChange={handleTempoChange} placeholder="Ex: 3h30min" required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13 }}><span>Referência de imagem (opcional)</span></label>
            <div className="file-upload-area" onClick={()=>document.getElementById('fileInput').click()}>
              <input id="fileInput" type="file" accept="image/*" multiple onChange={handleFileChange} style={{display:"none"}} />
              <p>💡 Dica: Inspire-se! Busque referências no Pinterest, Instagram e outras redes.</p>
              <p>Clique aqui para enviar sua imagem de referência</p>
            </div>
            {formValues.imagemReferencia.length > 0 && (
              <div className="file-selected">{formValues.imagemReferencia.length} arquivo(s) selecionado(s)</div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{marginTop:12,padding:"12px 20px",background:"#B70D07",color:"#fff",border:"none",cursor:isLoading?"not-allowed":"pointer",fontSize:15,borderRadius:8,fontWeight:"700",transition:"all 0.3s ease",width:"100%",fontFamily:"'Martel Sans',sans-serif",opacity:isLoading?0.6:1}}
            onMouseOver={(e)=>!isLoading&&(e.target.style.background="#8A0A05")}
            onMouseOut={(e)=>!isLoading&&(e.target.style.background="#B70D07")}
          >
            {isLoading ? "Enviando..." : "Criar orçamento"}
          </button>
        </form>
      </div>
      {cardResposta && (
          <div className="modal-sucesso-overlay" onClick={fecharFeedback} style={{zIndex:10000}}>
            <div className="modal-sucesso-content" onClick={(e)=>e.stopPropagation()}>
              <div className="modal-sucesso-icon">
                {cardResposta.tipo === 'sucesso' ? (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none"/>
                    <path d="M8 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="none"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <h2 className="modal-sucesso-titulo">{cardResposta.tipo==='sucesso'?'Sucesso!':'Erro'}</h2>
              <p className="modal-sucesso-mensagem">{cardResposta.mensagem}</p>
              <button className="modal-sucesso-btn" onClick={fecharFeedback} style={{background: cardResposta.tipo==='sucesso'?'#10b981':'#ef4444'}}>
                Fechar
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CriarOrcamento;