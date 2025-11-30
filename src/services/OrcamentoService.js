import api from './api.js';

class OrcamentoService {
  async buscarOrcamentosUsuario(usuarioId) {
    try {
      const response = await api.get(`/orcamento/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar orçamentos do usuário:', error);
  /**
   * Busca todos os orçamentos (admin)
   */
  async listarTodos() {
    try {
      console.log('🔍 Buscando orçamentos em: GET /orcamento');
      const response = await api.get('/orcamento');
      console.log('✅ Resposta recebida:', response);
      console.log('📦 Dados:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar orçamentos:', error);
      console.error('📍 URL tentada:', error.config?.url);
      console.error('📍 Método:', error.config?.method);
      console.error('📍 Status:', error.response?.status);
      console.error('📍 Resposta:', error.response?.data);
      throw error;
    }
  }

  async buscarOrcamentoPorCodigo(codigo) {
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
  /**
   * Cria novo orçamento
   */
  async criar(dados) {
    try {
      console.log('📤 Criando orçamento via POST /orcamento/cadastro');
      
      // Para FormData, precisamos remover o Content-Type para o browser definir automaticamente
      const config = {};
      if (dados instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
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
   * Atualiza orçamento existente (valor e tempo)
   */
  async atualizar(codigo, dados) {
    try {
      const response = await api.put(`/orcamento/${codigo}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
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
  /**
   * Responde orçamento (admin envia resposta ao cliente)
   */
  async responder(codigo, resposta) {
    try {
      console.log('📤 OrcamentoService.responder - Código:', codigo);
      console.log('📤 OrcamentoService.responder - Payload:', resposta);
      console.log('📤 URL completa:', `/orcamento/${codigo}`);
      
      const response = await api.put(`/orcamento/${codigo}`, resposta);
      console.log('✅ Resposta do backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao responder orçamento:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);
      console.error('❌ URL tentada:', error.config?.url);
      console.error('❌ Método:', error.config?.method);
      console.error('❌ Payload enviado:', error.config?.data);
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
