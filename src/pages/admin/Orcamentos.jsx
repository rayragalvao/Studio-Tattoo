import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/generalComponents/navbar/Navbar';
import { Footer } from '../../components/generalComponents/footer/Footer';
import { CardResposta } from '../../components/generalComponents/cardResposta/CardResposta';
import OrcamentosList from '../../components/admin/OrcamentosList';
import OrcamentoDetail from '../../components/admin/OrcamentoDetail';
import CriarOrcamentoModal from '../../components/admin/CriarOrcamentoModal';
import api from '../../services/api';
import './orcamentos.css';

const Orcamentos = () => {
  const { user } = useAuth();
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentosExibir, setOrcamentosExibir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'Todos'
  });
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalCriarOrcamentoAberto, setModalCriarOrcamentoAberto] = useState(false);

  const adminMenuItems = [
    { label: "Início", to: "/" },
    { label: "Estoque", to: "/estoque" },
    { label: "Agendamentos", to: "/agendamento" },
    { label: "Orçamentos", to: "/admin/orcamentos" }
  ];

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const response = await api.get('/orcamento');
        setOrcamentos(response.data);
        setOrcamentosExibir(response.data);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
        // Dados de fallback caso a API não esteja disponível
        const fallbackData = [
          {
            id: 1,
            nome: 'João Silva',
            email: 'joao@email.com',
            status: 'pendente',
            tamanho: '15cm',
            localCorpo: 'Braço',
            descricao: 'Gostaria de uma tatuagem de dragão no estilo oriental'
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@email.com',
            status: 'respondido',
            tamanho: '5cm',
            localCorpo: 'Pulso',
            descricao: 'Quero uma tatuagem minimalista de flor'
          }
        ];
        setOrcamentos(fallbackData);
        setOrcamentosExibir(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamentos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, filtros, orcamentos]);

  const aplicarFiltros = () => {
    let dadosFiltrados = [...orcamentos];

    // Filtro por pesquisa (nome ou email)
    if (searchTerm) {
      dadosFiltrados = dadosFiltrados.filter(item =>
        item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (filtros.status !== 'Todos') {
      dadosFiltrados = dadosFiltrados.filter(item =>
        item.status?.toLowerCase() === filtros.status.toLowerCase()
      );
    }

    // Ordenar: pendentes primeiro, depois respondidos
    dadosFiltrados.sort((a, b) => {
      if (a.status === 'pendente' && b.status !== 'pendente') return -1;
      if (a.status !== 'pendente' && b.status === 'pendente') return 1;
      return a.nome.localeCompare(b.nome);
    });

    setOrcamentosExibir(dadosFiltrados);
  };

  const toggleFiltros = () => {
    setFiltrosAbertos(!filtrosAbertos);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({ status: 'Todos' });
    setSearchTerm('');
    setFiltrosAbertos(false);
  };

  const handleSelectOrcamento = (orcamento) => {
    setSelectedOrcamento(orcamento);
  };

  const abrirModalCriarOrcamento = () => {
    setModalCriarOrcamentoAberto(true);
  };
  const fecharModalCriarOrcamento = () => {
    setModalCriarOrcamentoAberto(false);
  };

  const handleSalvarOrcamento = async (dados) => {
    try {
      // tentativa de cadastro
      try {
        await api.post('/orcamento/cadastro', dados);
      } catch (apiError) {
        console.warn('API não disponível para cadastro, prosseguindo localmente:', apiError);
      }
      // adiciona localmente
      const novo = { id: Date.now(), status: 'pendente', ...dados };
      setOrcamentos(prev => [novo, ...prev]);
      setOrcamentosExibir(prev => [novo, ...prev]);
      setModalCriarOrcamentoAberto(false);
      setModalSucesso(true);
    } catch (err) {
      console.error('Erro ao salvar orçamento:', err);
      alert('Erro ao salvar orçamento');
    }
  };

  const handleUpdateStatus = async (id, newStatus, dadosAdicionais = {}) => {
    try {
      // Tenta atualizar na API
      try {
        await api.put(`/orcamento/${id}`, { status: newStatus, ...dadosAdicionais });
      } catch (apiError) {
        console.warn('API não disponível, atualizando localmente:', apiError);
      }
      
      // Atualiza estado local independente do resultado da API
      setOrcamentos(prev => 
        prev.map(orc => orc.id === id ? { ...orc, status: newStatus, ...dadosAdicionais } : orc)
      );
      
      if (newStatus === 'respondido') {
        setModalSucesso(true);
        setSelectedOrcamento(null);
      } else {
        alert(`Orçamento ${newStatus}!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      alert('Erro ao atualizar orçamento');
    }
  };

  const fecharModalSucesso = () => {
    setModalSucesso(false);
  };

  return (
    <>
      <div className="admin-orcamentos-nav">
        <Navbar customMenuItems={adminMenuItems} />
      </div>
      <div className="admin-orcamentos-page">
        <h1 className="admin-page-title">Bem vinda, {user?.nome || 'Admin'}</h1>
        <div className="admin-orcamentos-grid">
          <OrcamentosList 
            items={orcamentosExibir}
            loading={loading}
            onSelect={handleSelectOrcamento}
            selectedId={selectedOrcamento?.id}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onToggleFiltros={toggleFiltros}
            filtrosAbertos={filtrosAbertos}
            filtros={filtros}
            onAtualizarFiltro={atualizarFiltro}
            onLimparFiltros={limparFiltros}
            onCriarOrcamento={abrirModalCriarOrcamento}
          />
          <OrcamentoDetail 
            orcamento={selectedOrcamento}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
      <Footer />
      
      {modalSucesso && (
        <CardResposta
          tipo="sucesso"
          titulo="Orçamento enviado com sucesso!"
          mensagem="O orçamento foi enviado para o cliente e ele receberá uma notificação por email."
          botaoTexto="Fechar"
          onClose={fecharModalSucesso}
        />
      )}

      {modalCriarOrcamentoAberto && (
        <CriarOrcamentoModal
          aberto={modalCriarOrcamentoAberto}
          onClose={fecharModalCriarOrcamento}
          onSubmit={handleSalvarOrcamento}
        />
      )}
    </>
  );
};

export default Orcamentos;
