import React, { useState } from 'react';
import agendamentoService from '../../services/AgendamentoService.js';

const CriarAgendamento = ({ onClose, onAgendamentoCriado }) => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [codigoOrcamento, setCodigoOrcamento] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardResposta, setCardResposta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nomeUsuario || !emailUsuario || !codigoOrcamento || !dataHora) {
      setCardResposta({
        tipo: 'erro',
        mensagem: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Criando agendamento:', { nomeUsuario, emailUsuario, codigoOrcamento, dataHora });
      
      const dados = {
        nomeUsuario,
        emailUsuario,
        codigoOrcamento,
        dataHora: new Date(dataHora).toISOString()
      };

      await agendamentoService.criarAgendamento(dados);
      
      setCardResposta({
        tipo: 'sucesso',
        mensagem: 'Agendamento criado com sucesso!'
      });

      setTimeout(() => {
        onAgendamentoCriado();
      }, 1500);
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      setCardResposta({
        tipo: 'erro',
        mensagem: error.message || 'Erro ao criar agendamento'
      });
    } finally {
      setLoading(false);
    }
  };

  const fecharFeedback = () => {
    setCardResposta(null);
    if (cardResposta?.tipo === 'sucesso') {
      onClose();
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"#fff",borderRadius:8,padding:24,width:"90%",maxWidth:500,position:"relative"}}>
        <button onClick={onClose} aria-label="Fechar" style={{position:"absolute",top:12,right:12,background:"#B70D07",color:"#fff",border:"none",cursor:"pointer",fontSize:20,fontWeight:"bold",lineHeight:1,width:36,height:36,borderRadius:"50%",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseOver={(e)=>{e.target.style.background="#8A0A05";e.target.style.transform="scale(1.1)";}} onMouseOut={(e)=>{e.target.style.background="#B70D07";e.target.style.transform="scale(1)";}}>×</button>
        <h3 style={{margin:"0 0 16px",textAlign:"center"}}>Criar agendamento</h3>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",marginBottom:4,fontSize:14,fontWeight:600,color:"#374151"}}>Nome do cliente *</label>
            <input
              type="text"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              placeholder="Nome completo"
              required
              style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}}
            />
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",marginBottom:4,fontSize:14,fontWeight:600,color:"#374151"}}>Email do cliente *</label>
            <input
              type="email"
              value={emailUsuario}
              onChange={(e) => setEmailUsuario(e.target.value)}
              placeholder="email@exemplo.com"
              required
              style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}}
            />
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",marginBottom:4,fontSize:14,fontWeight:600,color:"#374151"}}>Código do orçamento *</label>
            <input
              type="text"
              value={codigoOrcamento}
              onChange={(e) => setCodigoOrcamento(e.target.value)}
              placeholder="Ex: ORC-12345"
              required
              style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}}
            />
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",marginBottom:4,fontSize:14,fontWeight:600,color:"#374151"}}>Data e hora *</label>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
              style={{width:"100%",padding:"8px 12px",border:"1px solid #d1d5db",borderRadius:6,fontSize:14}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{width:"100%",padding:"10px 20px",background:"#B70D07",color:"#fff",border:"none",borderRadius:6,fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1}}
          >
            {loading ? 'Criando...' : 'Criar agendamento'}
          </button>
        </form>

        {cardResposta && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10000}}>
            <div className="modal-sucesso-content" style={{background:"#fff",borderRadius:12,padding:32,maxWidth:400,width:"90%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",animation:"fadeIn 0.3s ease"}}>
              <div className="modal-sucesso-icon" style={{width:64,height:64,margin:"0 auto 16px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:cardResposta.tipo==='sucesso'?"#d1fae5":"#fee2e2"}}>
                {cardResposta.tipo==='sucesso' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <h2 className="modal-sucesso-titulo" style={{fontSize:20,fontWeight:700,marginBottom:8,color:"#1f2937"}}>{cardResposta.tipo==='sucesso'?'Sucesso!':'Erro'}</h2>
              <p className="modal-sucesso-mensagem" style={{fontSize:14,color:"#6b7280",marginBottom:20}}>{cardResposta.mensagem}</p>
              <button className="modal-sucesso-btn" onClick={fecharFeedback} style={{padding:"10px 24px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:"pointer",background:cardResposta.tipo==='sucesso'?'#10b981':'#ef4444',color:"#fff",transition:"all 0.2s"}}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarAgendamento;
