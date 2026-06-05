import api from './api';

class EstoqueService {
  /**
   * Lista todos os materiais do estoque (sem paginação)
   * @returns {Promise<Array>} - Array com os materiais
   */

  async listarMateriais() {
    try {
      const response = await api.get('/estoque');
      const data = response.data;
      if (data && Array.isArray(data.content)) {
        return data.content;
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erro ao listar materiais:', error);
      throw error;
    }
  }

  /**
   * Lista materiais com paginação e filtro opcional por nome
   * Corresponde ao endpoint GET /estoque/paginado?page=0&size=10&nome=...
   * @param {number} page - Número da página (começa em 0)
   * @param {number} size - Quantidade de itens por página
   * @param {string} nome - Filtro opcional por nome
   * @returns {Promise<Object>} - Objeto Page do Spring: { content, totalElements, totalPages, number, size }
   */
  async listarPaginado(page = 0, size = 10, nome = '') {
    try {
      const params = { page, size };
      if (nome && nome.trim()) {
        params.nome = nome.trim();
      }
      const response = await api.get('/estoque', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar materiais paginados:', error);
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
