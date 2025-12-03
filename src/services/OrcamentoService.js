import api from './api';

class OrcamentoService {
  /**
   * Busca todos os orçamentos de um usuário
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} - Array com os orçamentos do usuário
   */
  async buscarOrcamentosUsuario(usuarioId) {
    try {
      const response = await api.get(`/orcamento/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamentos do usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza um orçamento existente
   * @param {string} codigoOrcamento - Código do orçamento
   * @param {Object} dados - Dados a serem atualizados
   * @returns {Promise<Object>} - Orçamento atualizado
   */
  async atualizarOrcamento(codigoOrcamento, dados) {
    try {
      const response = await api.put(`/orcamento/${codigoOrcamento}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
  }

  /**
   * Deleta um orçamento
   * @param {string} codigoOrcamento - Código do orçamento
   * @returns {Promise<void>}
   */
  async deletarOrcamento(codigoOrcamento) {
    try {
      const response = await api.delete(`/orcamento/${codigoOrcamento}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  }

  /**
   * Verifica se um orçamento tem agendamento vinculado
   * @param {string} codigoOrcamento - Código do orçamento
   * @returns {Promise<boolean>} - true se tem agendamento vinculado
   */
  async verificarSeTemAgendamento(codigoOrcamento) {
    try {
      const response = await api.get(`/orcamento/${codigoOrcamento}/tem-agendamento`);
      // O backend retorna { temAgendamento: boolean }
      return response.data.temAgendamento || false;
    } catch (error) {
      console.error('Erro ao verificar agendamento:', error);
      // Se der erro, retorna false para não bloquear a exclusão
      return false;
    }
  }

  /**
   * Cria um novo orçamento
   * @param {Object} dados - Dados do orçamento
   * @returns {Promise<Object>} - Orçamento criado
   */
  async criarOrcamento(dados) {
    try {
      const response = await api.post('/orcamento', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  }

  /**
   * Busca um orçamento específico
   * @param {string} codigoOrcamento - Código do orçamento
   * @returns {Promise<Object>} - Dados do orçamento
   */
  async buscarOrcamento(codigoOrcamento) {
    try {
      const response = await api.get(`/orcamento/${codigoOrcamento}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      throw error;
    }
  }
}

export default new OrcamentoService();
