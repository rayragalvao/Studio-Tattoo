import api from './api';

class EstoqueService {
  /**
   * Lista todos os materiais do estoque
   * @returns {Promise<Array>} - Array com os materiais
   */
  async listarMateriais() {
    try {
      const response = await api.get('/estoque');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar materiais:', error);
      throw error;
    }
  }

  /**
   * Busca um material específico
   * @param {number} id - ID do material
   * @returns {Promise<Object>} - Dados do material
   */
  async buscarMaterial(id) {
    try {
      const response = await api.get(`/estoque/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      throw error;
    }
  }
}

export default new EstoqueService();
