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
}

const orcamentoService = new OrcamentoService();
export default orcamentoService;
