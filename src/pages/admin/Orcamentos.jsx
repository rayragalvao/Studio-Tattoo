import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/generalComponents/navbar/Navbar.jsx';
import { Footer } from '../../components/generalComponents/footer/Footer.jsx';
import OrcamentosList from '../../components/admin/OrcamentosList.jsx';
import OrcamentoDetail from '../../components/admin/OrcamentoDetail.jsx';
import ModalSucesso from '../../components/admin/ModalSucesso.jsx';
import CriarOrcamento from '../../components/admin/CriarOrcamento.jsx';
import './orcamentos.css';
import orcamentoService from '../../services/OrcamentoService.js';
import '../../styles/global.css';

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

  const customMenuItems = [
    { label: 'Início', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Estoque', to: '/estoque' },
    { label: 'Orçamentos', to: '/admin/orcamentos' },
    { label: 'Agendamentos', to: '/admin/agendamentos' }
  ];

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = async () => {
    setLoading(true);
    try {
      const dados = await orcamentoService.listarTodos();
      console.log('✅ Orçamentos carregados do backend:', dados);
      console.log('📋 Total de orçamentos:', dados.length);
      
      // Verificar TODOS os orçamentos
      dados.forEach((orc, index) => {
        console.log(`\n🔍 Orçamento ${index + 1}:`);
        console.log(`  Código: ${orc.codigoOrcamento}`);
        console.log(`  Nome: ${orc.nome}`);
        console.log(`  imagemReferencia:`, orc.imagemReferencia);
        console.log(`  Tipo:`, typeof orc.imagemReferencia);
        console.log(`  É array?:`, Array.isArray(orc.imagemReferencia));
      });
      
      setOrcamentos(dados);
    } catch (err) {
      console.error('❌ Erro ao carregar orçamentos do backend:', err);
      console.error('Status:', err.response?.status);
      console.error('Mensagem:', err.response?.data);
      console.error('URL tentada:', err.config?.url);
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
    setExibir(dados);
  }, [search, filtros, orcamentos]);

  // Usamos o menu padrão do Navbar para admins (inclui Orçamentos e Dashboard)

  const toggleFiltros = () => setFiltrosAbertos(!filtrosAbertos);
  const atualizarFiltro = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor }));
  const limparFiltros = () => { setFiltros({ status:'Todos' }); setSearch(''); setFiltrosAbertos(false); };
  
  const handleCriarOrcamento = () => {
    setModalCriarAberto(true);
  };
  
  const handleFecharModalCriar = () => {
    setModalCriarAberto(false);
  };
  
  const handleOrcamentoCriado = () => {
    carregarOrcamentos();
    setModalCriarAberto(false);
  };
  
 
const handleEnviar = async (orcamento, dados) => {
  const parseValor = (v) => {
    if (!v) return null;
    const num = String(v)
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
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
    if (parts.length === 2) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:00`;
    if (parts.length === 3) return `${parts[0].padStart(2,'0')}:${parts[1].padStart(2,'0')}:${parts[2].padStart(2,'0')}`;
    const onlyHours = s.match(/^\d+$/) ? s : null;
    if (onlyHours) return `${onlyHours.padStart(2,'0')}:00:00`;
    return null;
  };

  const payload = {
    nome: orcamento.nome,
    email: orcamento.email,
    ideia: orcamento.ideia || orcamento.descricao,
    tamanho: orcamento.tamanho,
    cores: orcamento.cores,
    localCorpo: orcamento.localCorpo || orcamento.local_corpo,
    valor: parseValor(dados?.valor),
    tempo: normalizeTempo(dados?.tempo),
    status: 'APROVADO'
  };

  console.log('📤 Enviando resposta orçamento:', orcamento?.codigoOrcamento, payload);

  try {
    const resposta = await orcamentoService.responder(orcamento.codigo_orcamento || orcamento.codigoOrcamento, payload);
    console.log('✅ Resposta do backend:', resposta);
    const codigoOrcamento = orcamento.codigo_orcamento || orcamento.codigoOrcamento;
    setOrcamentos(prevOrcamentos =>
      prevOrcamentos.map(orc =>
        (orc.codigo_orcamento === codigoOrcamento || orc.codigoOrcamento === codigoOrcamento)
          ? { ...orc, status: 'APROVADO' }
          : orc
      )
    );
    setModalSucesso(true);
    setSelected(null);
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error('Erro ao enviar resposta:', { status, data, err });
    alert(`Erro ao enviar resposta. Status: ${status || 'desconhecido'}${data?.message ? ' - ' + data.message : ''}`);
  }
};
  return (
    <>
      <Navbar isCustom={true} customMenuItems={customMenuItems} hideLogo />
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
