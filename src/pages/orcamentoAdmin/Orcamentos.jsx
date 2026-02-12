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
    console.log('🔍 handleEnviar chamado com dados:', dados);
    console.log('  - dados.valor:', dados?.valor);
    console.log('  - dados.tempo:', dados?.tempo);
    
    // Normalizar payload para o backend: valor (float) e tempo (HH:mm:ss)
    const parseValor = (v) => {
      if (!v) return null;
      // remove "R$", espaços e converte vírgula em ponto
      const num = String(v).replace(/[^0-9,\.]/g, '').replace(',', '.');
      const parsed = parseFloat(num);
      return isNaN(parsed) ? null : parsed;
    };

    const normalizeTempo = (t) => {
      console.log('🕐 normalizeTempo chamado com:', t, '(tipo:', typeof t, ')');
      if (!t) return null;
      // aceita formatos tipo "3h30min", "3h", "2h", "03:30", "03:30:00"
      const s = String(t).toLowerCase().trim();
      
      // "3h30min" ou "3h" -> horas/minutos
      const hmMatch = s.match(/(\d+)h(?:(\d{1,2})min?)?$/);
      if (hmMatch) {
        const h = hmMatch[1].padStart(2, '0');
        const m = (hmMatch[2] || '00').padStart(2, '0');
        console.log(`  ✅ Convertido "${t}" -> "${h}:${m}:00"`);
        return `${h}:${m}:00`;
      }
      
      // "03:30" ou "03:30:00"
      const parts = s.split(':');
      if (parts.length === 2) {
        const h = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        console.log(`  ✅ Convertido "${t}" -> "${h}:${m}:00"`);
        return `${h}:${m}:00`;
      }
      if (parts.length === 3) {
        const h = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const sec = parts[2].padStart(2, '0');
        console.log(`  ✅ Convertido "${t}" -> "${h}:${m}:${sec}"`);
        return `${h}:${m}:${sec}`;
      }
      
      // fallback: somente número "3" -> "03:00:00"
      const onlyHours = s.match(/^\d+$/) ? s : null;
      if (onlyHours) {
        const h = onlyHours.padStart(2, '0');
        console.log(`  ✅ Convertido "${t}" -> "${h}:00:00"`);
        return `${h}:00:00`;
      }
      
      console.warn(`  ⚠️ Formato de tempo não reconhecido: "${t}"`);
      return null;
    };

    // Backend precisa de todos os campos do orçamento
    const valorParsed = parseValor(dados?.valor);
    const tempoParsed = normalizeTempo(dados?.tempo);
    
    console.log('💰 Valor parseado:', valorParsed);
    console.log('⏰ Tempo parseado:', tempoParsed);
    
    const payload = {
      valor: valorParsed,
      tempo: tempoParsed,
      status: 'APROVADO' // Muda para APROVADO ao responder
    };

    console.log('📤 Enviando resposta orçamento:', orcamento?.codigo_orcamento || orcamento?.codigoOrcamento, payload);

    try {
      const resposta = await orcamentoService.responder(orcamento.codigo_orcamento || orcamento.codigoOrcamento, payload);
      console.log('✅ Resposta do backend:', resposta);
      
      // Atualizar orçamento com os novos dados (status, valor, tempo)
      const codigoOrcamento = orcamento.codigo_orcamento || orcamento.codigoOrcamento;
      const orcamentoAtualizado = resposta.orcamento || resposta;
      
      setOrcamentos(prevOrcamentos => 
        prevOrcamentos.map(orc => 
          (orc.codigo_orcamento === codigoOrcamento || orc.codigoOrcamento === codigoOrcamento)
            ? { ...orc, ...orcamentoAtualizado, status: 'APROVADO' }
            : orc
        )
      );
      
      // Atualizar o orçamento selecionado com os dados salvos
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