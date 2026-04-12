import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/generalComponents/navbar/Navbar.jsx';
import { Footer } from '../../components/generalComponents/footer/Footer.jsx';
import OrcamentosList from '../../components/orcamentoAdminComponents/orcamentosList/OrcamentosList.jsx';
import OrcamentoDetail from '../../components/orcamentoAdminComponents/orcamentoDetailComponent/OrcamentoDetail.jsx';
import ModalSucesso from '../../components/orcamentoAdminComponents/modalSucessoComponent/ModalSucesso.jsx';
import CriarOrcamento from '../../components/orcamentoAdminComponents/criarOrcamentoComponent/CriarOrcamento.jsx';
import './orcamentos.css';
import orcamentoService from '../../services/OrcamentoService.js';

const AdminOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [exibir, setExibir] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtros, setFiltros] = useState({ status: 'Todos' });
  const [loading, setLoading] = useState(true);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = async () => {
    setLoading(true);
    try {
      const dados = await orcamentoService.listarTodos();
      console.log('✅ Orçamentos carregados do backend:', dados);
      console.log('📋 Total de orçamentos:', dados.length);
      console.log('📊 Status:', dados.map(o => `${o.nome}: ${o.status}`));
      setOrcamentos(dados);
    } catch (err) {
      console.error('❌ Erro ao carregar orçamentos do backend:', err);
      alert('Erro ao carregar orçamentos. Verifique se o backend está rodando.');
      setOrcamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let dados = [...orcamentos];
    if (search) {
      const q = search.toLowerCase();
      dados = dados.filter(o => o.nome.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }
    if (filtros.status !== 'Todos') {
      dados = dados.filter(o => o.status === filtros.status);
    }
    const prioridade = { 'PENDENTE': 0, 'APROVADO': 1, 'REJEITADO': 2 };
    dados.sort((a, b) => (prioridade[a.status] ?? 1) - (prioridade[b.status] ?? 1));
    console.log('📋 Ordem após sort:', dados.map(o => `${o.nome} (${o.status})`));
    setExibir(dados);
  }, [search, filtros, orcamentos]);

  const toggleFiltros = () => setFiltrosAbertos(!filtrosAbertos);
  const atualizarFiltro = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor }));
  const limparFiltros = () => { setFiltros({ status:'Todos' }); setSearch(''); setFiltrosAbertos(false); };
  
  const handleCriarOrcamento = () => setModalCriarAberto(true);
  const handleFecharModalCriar = () => setModalCriarAberto(false);
  const handleOrcamentoCriado = () => { carregarOrcamentos(); setModalCriarAberto(false); };
  
  const handleEnviar = async (orcamento, dados) => {
    console.log('🔍 handleEnviar chamado com dados:', dados);
    
    const parseValor = (v) => {
      if (!v) return null;
      const num = String(v).replace(/[^0-9,\.]/g, '').replace(',', '.');
      const parsed = parseFloat(num);
      return isNaN(parsed) ? null : parsed;
    };

    const normalizeTempo = (t) => {
      if (!t) return null;
      const s = String(t).toLowerCase().trim();
      const hmMatch = s.match(/(\d+)h(?:(\d{1,2})min?)?$/);
      if (hmMatch) {
        const h = hmMatch[1].padStart(2, '0');
        const m = (hmMatch[2] || '00').padStart(2, '0');
        return `${h}:${m}:00`;
      }
      const parts = s.split(':');
      if (parts.length === 2) {
        return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
      }
      if (parts.length === 3) {
        return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2].padStart(2,'0')}`;
      }
      const onlyHours = s.match(/^\d+$/) ? s : null;
      if (onlyHours) return `${onlyHours.padStart(2,'0')}:00:00`;
      return null;
    };

    const payload = {
      valor: parseValor(dados?.valor),
      tempo: normalizeTempo(dados?.tempo),
      status: 'APROVADO'
    };

    try {
      const resposta = await orcamentoService.responder(orcamento.codigo_orcamento || orcamento.codigoOrcamento, payload);
      console.log('✅ Resposta do backend:', resposta);
      
      const codigoOrcamento = orcamento.codigo_orcamento || orcamento.codigoOrcamento;
      const orcamentoAtualizado = resposta.orcamento || resposta;
      
      setOrcamentos(prevOrcamentos => 
        prevOrcamentos.map(orc => 
          (orc.codigo_orcamento === codigoOrcamento || orc.codigoOrcamento === codigoOrcamento)
            ? { ...orc, ...orcamentoAtualizado, status: 'APROVADO' }
            : orc
        )
      );
      
      setSelected({ ...orcamento, ...orcamentoAtualizado, status: 'APROVADO' });
      setModalSucesso(true);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      console.error('Erro ao enviar resposta:', { status, data, err });
      alert(`Erro ao enviar resposta. Status: ${status || 'desconhecido'}${data?.message ? ' - ' + data.message : ''}`);
    }
  };

  return (
    <>
      <Navbar />
        <div className="admin-orc-wrapper">
          <div className="admin-orc-grid">
          <OrcamentosList
            items={exibir}
            loading={loading}
            selectedId={selected?.codigo_orcamento || selected?.codigoOrcamento || selected?.id}
            onSelect={setSelected}
            searchTerm={search}
            onSearchChange={setSearch}
            filtrosAbertos={filtrosAbertos}
            onToggleFiltros={toggleFiltros}
            filtros={filtros}
            onAtualizarFiltro={atualizarFiltro}
            onLimparFiltros={limparFiltros}
            onCriarOrcamento={handleCriarOrcamento}
          />
          <OrcamentoDetail orcamento={selected} onEnviar={handleEnviar} />
        </div>
      </div>
      <ModalSucesso 
        isOpen={modalSucesso} 
        onClose={() => setModalSucesso(false)}
        mensagem="Orçamento enviado com sucesso! O cliente receberá um e-mail com os detalhes."
      />
      {modalCriarAberto && (
        <CriarOrcamento 
          onClose={handleFecharModalCriar}
          onOrcamentoCriado={handleOrcamentoCriado}
        />
      )}
      <Footer />
    </>
  );
};

export default AdminOrcamentos;