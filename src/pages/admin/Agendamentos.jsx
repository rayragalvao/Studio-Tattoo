import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/generalComponents/navbar/Navbar.jsx';
import { Footer } from '../../components/generalComponents/footer/Footer.jsx';
import AgendamentosList from '../../components/agendamentoAdminComponents/agendamentosListComponent/AgendamentosList.jsx';
import AgendamentoDetail from '../../components/agendamentoAdminComponents/agendamentoDetailComponent/AgendamentoDetail.jsx';
import ModalSucesso from '../../components/orcamentoAdminComponents/modalSucessoComponent/ModalSucesso.jsx';
import CriarAgendamento from '../../components/orcamentoAdminComponents/criarOrcamentoComponent/CriarAgendamento.jsx';
import './agendamentos.css';
import agendamentoService from '../../services/AgendamentoService.js';
import '../../styles/global.css';

const AdminAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
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
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    console.log('🚀 INICIANDO carregarAgendamentos...');
    setLoading(true);
    try {
      console.log('📡 Chamando agendamentoService.listarAgendamentos()...');
      const dados = await agendamentoService.listarAgendamentos();
      console.log('✅ Agendamentos carregados do backend:', dados);
      console.log('📋 Total de agendamentos:', dados?.length || 0);
      console.log('📦 Tipo de dados:', typeof dados);
      console.log('📦 É array?:', Array.isArray(dados));
      
      if (dados && Array.isArray(dados)) {
        dados.forEach((agend, index) => {
          console.log(`\n🔍 Agendamento ${index + 1}:`);
          console.log(`  ID: ${agend.id}`);
          console.log(`  Email: ${agend.emailUsuario}`);
          console.log(`  Status: ${agend.status}`);
          console.log(`  Data/Hora: ${agend.dataHora}`);
        });
      }

      setAgendamentos(dados || []);
      setExibir(dados || []);
    } catch (err) {
      console.error('❌ Erro ao carregar agendamentos do backend:', err);
      console.error('📍 Status:', err.response?.status);
      console.error('📍 Mensagem:', err.response?.data);
      console.error('📍 URL tentada:', err.config?.url);
      console.error('📍 Erro completo:', err);
      alert('Erro ao carregar agendamentos. Verifique se o backend está rodando.');
      setAgendamentos([]);
      setExibir([]);
    } finally {
      setLoading(false);
      console.log('✔️ carregarAgendamentos FINALIZADO');
    }
  };

  useEffect(() => {
    let result = [...agendamentos];
    if (search) {
      result = result.filter(a =>
        a.emailUsuario?.toLowerCase().includes(search.toLowerCase()) ||
        a.codigoOrcamento?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filtros.status !== 'Todos') {
      result = result.filter(a => a.status === filtros.status);
    }
    setExibir(result);
  }, [search, filtros, agendamentos]);

  const handleSelect = async (item) => {
    console.log('🔍 Buscando detalhes completos do agendamento:', item.id);
    try {
      // Usa o endpoint /agendamento/detalhado/{id} que retorna usuário e orçamento completos
      const detalhes = await agendamentoService.buscarAgendamentoCompleto(item.id);
      console.log('✅ Detalhes completos recebidos:', detalhes);
      console.log('📦 Tem orçamento?', !!detalhes.orcamento);
      console.log('📦 Tem usuário?', !!detalhes.usuario);
      setSelected(detalhes);
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes completos:', error);
      console.log('⚠️ Usando dados básicos da lista');
      setSelected(item);
    }
  };

  const handleConfirmar = async (id) => {
    try {
      console.log('📤 Confirmando agendamento:', id);
      await agendamentoService.atualizarAgendamento(id, { status: 'CONFIRMADO' });
      setModalSucesso(true);
      await carregarAgendamentos();
      setSelected(null);
    } catch (error) {
      console.error('❌ Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar agendamento');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      console.log('📤 Cancelando agendamento:', id);
      await agendamentoService.atualizarAgendamento(id, { status: 'CANCELADO' });
      await carregarAgendamentos();
      setSelected(null);
    } catch (error) {
      console.error('❌ Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento');
    }
  };

  const handleCriarAgendamento = () => {
    setModalCriarAberto(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarAberto(false);
  };

  const handleAgendamentoCriado = async () => {
    setModalCriarAberto(false);
    setModalSucesso(true);
    await carregarAgendamentos();
  };

  return (
    <>
      <Navbar isCustom={true} customMenuItems={customMenuItems} hideLogo />
      <div className="admin-agend-wrapper">
        <div className="admin-agend-grid">
          <AgendamentosList
            items={exibir}
            loading={loading}
            selectedId={selected?.id}
            onSelect={handleSelect}
            searchTerm={search}
            onSearchChange={setSearch}
            filtrosAbertos={filtrosAbertos}
            onToggleFiltros={() => setFiltrosAbertos(!filtrosAbertos)}
            filtros={filtros}
            onAtualizarFiltro={(key, val) => setFiltros({ ...filtros, [key]: val })}
            onLimparFiltros={() => setFiltros({ status: 'Todos' })}
            onCriarAgendamento={handleCriarAgendamento}
          />
          {selected ? (
            <AgendamentoDetail
              agendamento={selected}
              onConfirmar={handleConfirmar}
              onCancelar={handleCancelar}
            />
          ) : (
            <div style={{background:'#fff', borderRadius:'8px', padding:'24px', boxShadow:'0 4px 12px rgba(0,0,0,0.08)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'300px'}}>
              <p style={{color:'#9ca3af', fontSize:'14px'}}>Selecione um agendamento para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      {modalSucesso && (
        <ModalSucesso
          mensagem="Agendamento confirmado com sucesso!"
          onClose={() => setModalSucesso(false)}
        />
      )}
      {modalCriarAberto && (
        <CriarAgendamento 
          onClose={handleFecharModalCriar}
          onAgendamentoCriado={handleAgendamentoCriado}
        />
      )}
    </>
  );
};

export default AdminAgendamentos;
