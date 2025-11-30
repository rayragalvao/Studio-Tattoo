import api from './api.js';

class OrcamentoService {
  async buscarOrcamentosUsuario(usuarioId) {
    try {
      const response = await api.get(`/orcamento/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamentos do usuário:', error);
      throw error;
    }
  }

  async buscarOrcamentoPorCodigo(codigo) {
    try {
      const response = await api.get(`/orcamento/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      throw error;
    }
  }

  async atualizarOrcamento(codigo, dados) {
    try {
      console.log('Atualizando orçamento:', codigo, dados);
      const response = await api.put(`/orcamento/${codigo}`, dados, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Resposta da atualização:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      throw error;
    }
  }

  async verificarSeTemAgendamento(codigo) {
    try {
      const response = await api.get(`/orcamento/${codigo}/tem-agendamento`);
      return response.data.temAgendamento;
    } catch (error) {
      console.error('Erro ao verificar agendamento:', error);
      return false;
    }
  }

  async deletarOrcamento(codigo) {
    try {
      await api.delete(`/orcamento/${codigo}`);
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }
}

const orcamentoService = new OrcamentoService();
export default orcamentoService;
