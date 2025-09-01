package hub.orcana.service;

import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EstoqueRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Service
public class EstoqueService {
    private final EstoqueRepository repository;
    private final EstoqueRepository estoqueRepository;

    public EstoqueService(EstoqueRepository repository, EstoqueRepository estoqueRepository) {
        this.repository = repository;
        this.estoqueRepository = estoqueRepository;
    }

    // Lista todos os materiais existentes
    @GetMapping
    public ResponseEntity<?> getEstoque() {
        try {
            var material = repository.findAll();
            if (material.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.ok(material);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar materiais do estoque.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Busca material pelo nome
    @GetMapping("/{nomeMaterial}")
    public ResponseEntity<?> getEstoqueByNome(@PathVariable String nomeMaterial) {
        try {
            var material = repository.findAll()
                    .stream()
                    .filter(atual -> nomeMaterial.equals(atual.getNome()))
                    .toList();

            if (material.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.status(200).body(Map.of(
                        "erro", "Busca feita com sucesso.",
                        "dados", material));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar material pelo nome.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Cadastra um novo material
    @PostMapping
    public ResponseEntity<?> postEstoque(@RequestBody Estoque estoque) {
        try {
            if (estoque.getId() != null) {
                if (repository.existsById(estoque.getId())) {
                    return ResponseEntity.status(409).body(Map.of(
                            "erro", "ID já existe."
                    ));
                } else {
                    estoque.setId(null);
                }
            }
            Estoque novoMaterial = repository.save(estoque);
            return ResponseEntity.status(201).body(novoMaterial);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao cadastrar material.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Atualiza um material existente pelo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> putEstoqueById(@PathVariable Long id, @RequestBody @Valid Estoque estoque) {
        try {
            if (id != null && !estoque.getId().equals(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "O ID do material não pode ser alterado."
                ));
            }

            if (estoqueRepository.existsById(id)) {
                estoque.setId(id);
                Estoque estoqueAtualizado = estoqueRepository.save(estoque);
                return ResponseEntity.status(200).body(estoqueAtualizado);

            } else {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Material não encontrado."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "erro", "Erro ao atualizar estoque.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Exclui um estoque existente pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstoqueById(@PathVariable Long id) {
        try {
            if (!estoqueRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Material não encontrado."
                ));
            }

            estoqueRepository.deleteById(id);

            if (estoqueRepository.existsById(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "O material não foi excluído devido a conflito."
                ));
            }

            return ResponseEntity.status(200).body(Map.of(
                    "mensagem", "Material excluído com sucesso."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "erro", "Erro ao excluir material.",
                    "detalhe", e.getMessage()
            ));
        }
    }
}

