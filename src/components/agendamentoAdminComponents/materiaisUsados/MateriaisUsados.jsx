import React, { useState, useEffect } from "react";
import estoqueService from "../../../services/EstoqueService";
import "./materiaisUsados.css";

const MateriaisUsados = ({ agendamento, dadosCompletar = {}, onClose, onSalvar }) => {
  const [materiais, setMateriais] = useState([]);
  const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inicia com 4 linhas de materiais vazias
  const [linhasMateriais, setLinhasMateriais] = useState([
    { materialId: "", quantidade: 0 },
    { materialId: "", quantidade: 0 },
    { materialId: "", quantidade: 0 },
    { materialId: "", quantidade: 0 },
  ]);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      const dados = await estoqueService.listarMateriais();
      setMateriaisDisponiveis(dados);
    } catch (error) {
      console.error("Erro ao carregar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialChange = (index, field, value) => {
    const novasLinhas = [...linhasMateriais];
    novasLinhas[index][field] = value;
    setLinhasMateriais(novasLinhas);
  };

  const handleAdicionarLinha = () => {
    setLinhasMateriais([
      ...linhasMateriais,
      { materialId: "", quantidade: 0 },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filtra apenas materiais preenchidos
    const materiaisPreenchidos = linhasMateriais.filter(
      (linha) => linha.materialId && linha.quantidade > 0
    );

    if (materiaisPreenchidos.length === 0) {
      alert("Adicione pelo menos um material");
      return;
    }

    onSalvar(materiaisPreenchidos);
  };

  return (
    <div className="modal-overlay-materiais">
      <div className="modal-content-materiais">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Materiais usados</h2>

        {loading ? (
          <p>Carregando materiais...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="materiais-grid">
              {linhasMateriais.map((linha, index) => (
                <div key={index} className="material-row">
                  <div className="material-field">
                    <label>Material usado*</label>
                    <select
                      value={linha.materialId}
                      onChange={(e) =>
                        handleMaterialChange(index, "materialId", e.target.value)
                      }
                    >
                      <option value="">Selecione o material</option>
                      {materiaisDisponiveis.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="quantidade-field">
                    <label>Quantidade usada*</label>
                    <div className="quantidade-input-wrapper">
                      <input
                        type="number"
                        value={linha.quantidade}
                        onChange={(e) =>
                          handleMaterialChange(
                            index,
                            "quantidade",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min="0"
                      />
                      <span>unidades</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-adicionar-material"
              onClick={handleAdicionarLinha}
            >
              Adicionar material
            </button>

            <button type="submit" className="btn-salvar-materiais">
              Salvar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MateriaisUsados;
