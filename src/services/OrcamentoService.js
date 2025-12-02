import api from './api.js';

class OrcamentoService {
  /**
   * Busca orçamentos de um usuário específico
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
   * Lista todos os orçamentos (admin)
   */
  async listarTodos() {
    try {
      console.log('🔍 Buscando orçamentos em: GET /orcamento');
      const response = await api.get('/orcamento');
      console.log('✅ Resposta recebida:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar orçamentos:', error);
      console.error('📍 URL:', error.config?.url);
      console.error('📍 Método:', error.config?.method);
      console.error('📍 Status:', error.response?.status);
      console.error('📍 Resposta:', error.response?.data);
      throw error;
    }
  }

  /**
   * Busca orçamento por código
   */
  async buscarPorCodigo(codigo) {
    try {
      const response = await api.get(`/orcamento/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      throw error;
    }
  }

  /**
   * Cria novo orçamento
   */
  async criar(dados) {
    try {
      console.log('📤 Criando orçamento via POST /orcamento/cadastro');
      const config = {};
      if (dados instanceof FormData) {
        // Deixe o browser definir boundary; não force Content-Type aqui
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      const response = await api.post('/orcamento/cadastro', dados, config);
      console.log('✅ Orçamento criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar orçamento:', error);
      console.error('📍 Status:', error.response?.status);
      console.error('📍 Resposta:', error.response?.data);
      throw error;
    }
  }

  /**
   * Atualiza (valor / tempo / status etc.)
   */
  async atualizar(codigo, dados) {
    try {
      const response = await api.put(`/orcamento/${codigo}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      throw error;
    }
  }

  /**
   * Verifica se orçamento já gerou agendamento
   */
  async verificarSeTemAgendamento(codigo) {
    try {
      const response = await api.get(`/orcamento/${codigo}/tem-agendamento`);
      return response.data.temAgendamento;
    } catch (error) {
      console.error('Erro ao verificar agendamento:', error);
      return false;
    }
  }

  /**
   * Envia resposta (valor + tempo) ao cliente
   */
  async responder(codigo, resposta) {
    try {
      console.log('📤 Responder orçamento PUT /orcamento/' + codigo, resposta);
      const response = await api.put(`/orcamento/${codigo}`, resposta);
      console.log('✅ Resposta enviada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao responder orçamento:', error);
      console.error('Status:', error.response?.status);
      console.error('Dados:', error.response?.data);
      throw error;
    }
  }

  /**
   * Deleta orçamento
   */
  async deletar(codigo) {
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
