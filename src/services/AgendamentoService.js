import api from './api';

class AgendamentoService {
  /**
   * Busca todos os agendamentos de um usuário
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} - Array com os agendamentos do usuário
   */
  async buscarAgendamentosUsuario(usuarioId) {
    try {
      const response = await api.get(`/agendamento/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos do usuário:', error);
      throw error;
    }
  }

  /**
   * Valida se um código de orçamento existe e está disponível
   * @param {string} codigoOrcamento - Código do orçamento
   * @returns {Promise<boolean>} - true se o código é válido e disponível
   */
  async validarCodigoOrcamento(codigoOrcamento) {
    try {
      const response = await api.get(`/agendamento/validar-codigo/${codigoOrcamento}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar código de orçamento:', error);
      throw error;
    }
  }

  /**
   * Busca as datas que já possuem agendamentos
   * @returns {Promise<string[]>} - Array com as datas ocupadas no formato YYYY-MM-DD
   */
  async getDatasOcupadas() {
    try {
      const response = await api.get('/agendamento/datas-ocupadas');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar datas ocupadas:', error);
      return [];
    }
  }

  /**
   * Cria um novo agendamento
   * @param {Object} dadosAgendamento - Dados do agendamento
   * @param {string} dadosAgendamento.emailUsuario - Email do usuário
   * @param {string} dadosAgendamento.codigoOrcamento - Código do orçamento
   * @param {string} dadosAgendamento.dataHora - Data e hora no formato ISO 8601
   * @returns {Promise<Object>} - Dados do agendamento criado
   */
  async criarAgendamento(dadosAgendamento) {
    try {
      const response = await api.post('/agendamento', dadosAgendamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        }
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * @returns {Promise<Array>}
   */
  async listarAgendamentos() {
    try {
      const response = await api.get('/agendamento');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return [];
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async buscarAgendamentoPorId(id) {
    try {
      const response = await api.get(`/agendamento/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw error;
    }
  }

  /**
   * Busca agendamentos por status
   * @param {string} status - Status do agendamento (AGUARDANDO, CONFIRMADO, CANCELADO, etc)
   * @returns {Promise<Array>} - Array com os agendamentos do status especificado
   */
  async buscarAgendamentosPorStatus(status) {
    try {
      const response = await api.get(`/agendamento/statusAtual/${status}`);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar agendamentos por status:', error);
      return [];
    }
  }

  /**
   * Busca agendamentos de um usuário específico
   * @param {number} usuarioId - ID do usuário
   * @returns {Promise<Array>} - Array com os agendamentos do usuário
   */
  async buscarAgendamentosPorUsuario(usuarioId) {
    try {
      const response = await api.get(`/agendamento/usuario/${usuarioId}`);
      return response.data || [];
    } catch (error) {
      console.error('Erro ao buscar agendamentos do usuário:', error);
      return [];
    }
  }

  /**
   * Atualiza um agendamento
   * @param {number} id - ID do agendamento
   * @param {Object} dadosAgendamento - Dados do agendamento a atualizar
   * @returns {Promise<Object>} - Dados do agendamento atualizado
   */
  async atualizarAgendamento(id, dadosAgendamento) {
    try {
      const response = await api.put(`/agendamento/${id}`, dadosAgendamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  }

  /**
   * Deleta um agendamento
   * @param {number} id - ID do agendamento
   * @returns {Promise<void>}
   */
  async deletarAgendamento(id) {
    try {
      await api.delete(`/agendamento/${id}`);
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  }
}

export default new AgendamentoService();
