import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/generalComponents/navbar/Navbar.jsx';
import { Footer } from '../../components/generalComponents/footer/Footer.jsx';
import AgendamentosList from '../../components/agendamentoAdminComponents/agendamentosList/AgendamentosList.jsx';
import AgendamentoDetail from '../../components/agendamentoAdminComponents/agendamentoDetailComponent/AgendamentoDetail.jsx';
import ModalSucesso from '../../components/orcamentoAdminComponents/modalSucessoComponent/ModalSucesso.jsx';
import CriarAgendamento from '../../components/orcamentoAdminComponents/criarOrcamentoComponent/CriarAgendamento.jsx';
import './agendamentos.css';
import agendamentoService from '../../services/AgendamentoService.js';

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
  const [modalCancelamento, setModalCancelamento] = useState({ aberto: false, id: null });

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const dados = await agendamentoService.listarAgendamentos();
      console.log('✅ Agendamentos carregados:', dados);
      console.log('📋 Total:', dados?.length || 0);
      
      setAgendamentos(dados || []);
      setExibir(dados || []);
    } catch (err) {
      console.error('❌ Erro ao carregar agendamentos:', err);
      alert('Erro ao carregar agendamentos. Verifique se o backend está rodando.');
      setAgendamentos([]);
      setExibir([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...agendamentos];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.nomeUsuario?.toLowerCase().includes(q) ||
        a.emailUsuario?.toLowerCase().includes(q) ||
        a.codigoOrcamento?.toLowerCase().includes(q)
      );
    }
    
    if (filtros.status !== 'Todos') {
      result = result.filter(a => a.status === filtros.status);
    }
    
    setExibir(result);
  }, [search, filtros, agendamentos]);

  const toggleFiltros = () => setFiltrosAbertos(!filtrosAbertos);
  
  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };
  
  const limparFiltros = () => {
    setFiltros({ status: 'Todos' });
    setSearch('');
    setFiltrosAbertos(false);
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleConfirmar = async (id) => {
    try {
      const item = exibir.find(a => a.id === id) || selected;

      if (!item?.emailUsuario || !item?.codigoOrcamento || !item?.dataHora) {
        alert('Dados do agendamento incompletos (email, código de orçamento ou dataHora ausentes).');
        return;
      }

      await agendamentoService.atualizarAgendamento(id, {
        emailUsuario: item.emailUsuario,
        codigoOrcamento: item.codigoOrcamento,
        dataHora: item.dataHora,
        status: 'CONFIRMADO'
      });
      setModalSucesso(true);
      await carregarAgendamentos();
      setSelected(null);
    } catch (error) {
      console.error('❌ Erro ao confirmar agendamento:', error);
      alert('Erro ao confirmar agendamento');
    }
  };

  const handleCancelar = async (id) => {
    setModalCancelamento({ aberto: true, id });
  };

  const confirmarCancelamento = async () => {
    const id = modalCancelamento.id;
    if (!id) {
      setModalCancelamento({ aberto: false, id: null });
      return;
    }

    try {
      const item = exibir.find(a => a.id === id) || selected;

      if (!item?.emailUsuario || !item?.codigoOrcamento || !item?.dataHora) {
        alert('Dados do agendamento incompletos (email, código de orçamento ou dataHora ausentes).');
        setModalCancelamento({ aberto: false, id: null });
        return;
      }

      await agendamentoService.atualizarAgendamento(id, {
        emailUsuario: item.emailUsuario,
        codigoOrcamento: item.codigoOrcamento,
        dataHora: item.dataHora,
        status: 'CANCELADO'
      });
      await carregarAgendamentos();
      setSelected(null);
    } catch (error) {
      console.error('❌ Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento');
    } finally {
      setModalCancelamento({ aberto: false, id: null });
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
    await carregarAgendamentos();
  };

  return (
    <>
      <Navbar />
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
            onToggleFiltros={toggleFiltros}
            filtros={filtros}
            onAtualizarFiltro={atualizarFiltro}
            onLimparFiltros={limparFiltros}
            onCriarAgendamento={handleCriarAgendamento}
          />
          <AgendamentoDetail
            agendamento={selected}
            onConfirmar={handleConfirmar}
            onCancelar={handleCancelar}
          />
        </div>
      </div>
    
      {modalCancelamento.aberto && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <div className="cancel-modal-icon">✕</div>
            <h3>Cancelar agendamento</h3>
            <p>Tem certeza que deseja cancelar este agendamento?</p>
            <div className="cancel-modal-actions">
              <button
                className="cancel-modal-confirm"
                onClick={confirmarCancelamento}
              >
                Cancelar agendamento
              </button>
              <button
                className="cancel-modal-close-btn"
                onClick={() => setModalCancelamento({ aberto: false, id: null })}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalSucesso 
        isOpen={modalSucesso} 
        onClose={() => setModalSucesso(false)}
        mensagem="Agendamento confirmado com sucesso!"
      />
      {modalCriarAberto && (
        <CriarAgendamento 
          onClose={handleFecharModalCriar}
          onAgendamentoCriado={handleAgendamentoCriado}
        />
      )}
      <Footer />
    </>
  );
};

export default AdminAgendamentos;
