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
      console.log('🚀 Enviando POST /agendamento com:', dadosAgendamento);
      const response = await api.post('/agendamento', dadosAgendamento);
      console.log('✅ Resposta do backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      console.error('📍 Status:', error.response?.status);
      console.error('📍 Dados da resposta:', error.response?.data);
      console.error('📍 Headers:', error.response?.headers);
      console.error('📍 Config:', error.config);
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        }
        if (error.response.data.message) {
          throw new Error(error.response.data.message);
        }
        // Se for um objeto, tenta extrair a mensagem
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      
      throw error;
    }
  }

  /**
   * Lista todos os agendamentos (admin)
   * @returns {Promise<Array>}
   */
  async listarAgendamentos() {
    try {
      console.log('🔍 Buscando agendamentos em: GET /agendamento');
      const response = await api.get('/agendamento');
      console.log('✅ Resposta recebida:', response.status);
      console.log('📋 Total de agendamentos:', response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.error('❌ Erro ao listar agendamentos:', error);
      console.error('📍 URL:', error.config?.url);
      console.error('📍 Método:', error.config?.method);
      console.error('📍 Status:', error.response?.status);
      console.error('📍 Resposta:', error.response?.data);
      throw error;
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
   * Busca agendamento completo com todas as informações do usuário e orçamento
   * @param {number} id - ID do agendamento
   * @returns {Promise<Object>} - Agendamento completo com usuário e orçamento
   */
  async buscarAgendamentoCompleto(id) {
    try {
      console.log('🔍 Buscando agendamento completo:', id);
      const response = await api.get(`/agendamento/detalhado/${id}`);
      console.log('✅ Agendamento completo recebido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento completo:', error);
      throw error;
    }
  }

  /**
   * Atualiza a data e hora de um agendamento
   * @param {number} id - ID do agendamento
   * @param {Object} dados - Dados para atualização
   * @param {string} dados.dataHora - Nova data e hora no formato ISO 8601
   * @returns {Promise<Object>} - Dados do agendamento atualizado
   */
  async atualizarAgendamento(id, dados) {
    try {
      const response = await api.put(`/agendamento/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
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
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
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

  /**
   * Completa um agendamento com informações de tempo e pagamento
   * @param {number} id - ID do agendamento
   * @param {Object} dados - Dados da conclusão
   * @param {number} dados.tempoDuracao - Tempo da sessão em minutos
   * @param {boolean} dados.pagamentoFeito - Se o pagamento foi feito
   * @param {string} dados.formaPagamento - Forma de pagamento (pix, dinheiro, cartao)
   * @returns {Promise<Object>} - Agendamento atualizado
   */
  async completarAgendamento(id, dados) {
    try {
      // Usa o endpoint de atualização existente com status CONCLUIDO
      const response = await api.put(`/agendamento/${id}`, {
        ...dados,
        status: 'CONCLUIDO'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao completar agendamento:', error);
      throw error;
    }
  }

  /**
   * Adiciona materiais usados a um agendamento
   * @param {number} id - ID do agendamento
   * @param {Array} materiais - Lista de materiais usados
   * @param {number} materiais[].materialId - ID do material
   * @param {number} materiais[].quantidade - Quantidade usada
   * @returns {Promise<Object>} - Resposta do backend
   */
  async adicionarMateriaisUsados(id, materiais) {
    try {
      const response = await api.post(`/agendamento/${id}/materiais`, { materiais });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar materiais usados:', error);
      throw error;
    }
  }
}

export default new AgendamentoService();
