package hub.orcana.service;

import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EquipamentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Service
public class EquipamentoService {
    private final EquipamentoRepository repository;
    private final EquipamentoRepository equipamentoRepository;

    public EquipamentoService(EquipamentoRepository repository, EquipamentoRepository equipamentoRepository) {
        this.repository = repository;
        this.equipamentoRepository = equipamentoRepository;
    }

    // Lista todos os equipamentos existentes
    @GetMapping
    public ResponseEntity<?> getEquipamento() {
        try {
            var equipamentos = repository.findAll();
            if (equipamentos.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.ok(equipamentos);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar equipamentos.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Busca equipamento pelo nome
    @GetMapping("/{nomeEquipamento}")
    public ResponseEntity<?> getEquipamentoByNome(@PathVariable String nomeEquipamento) {
        try {
            var equipamentos = repository.findAll()
                    .stream()
                    .filter(equipamento -> nomeEquipamento.equals(equipamento.getNome()))
                    .toList();

            if (equipamentos.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.status(200).body(equipamentos);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar equipamento por nome.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Cadastra um novo equipamento
    @PostMapping
    public ResponseEntity<?> postEquipamento(@RequestBody Estoque equipamento) {
        try {
            if (equipamento.getId() != null) {
                if (repository.existsById(equipamento.getId())) {
                    return ResponseEntity.status(409).body(Map.of(
                            "erro", "ID já existe."
                    ));
                } else {
                    equipamento.setId(null);
                }
            }
            Estoque novoEquipamento = repository.save(equipamento);
            return ResponseEntity.status(201).body(novoEquipamento);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao cadastrar equipamento.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Atualiza um equipamento existente pelo ID
    @PutMapping("/{id}")
    public ResponseEntity<?> putEquipamentoById(@PathVariable Long id, @RequestBody @Valid Estoque equipamento) {
        try {
            if (equipamento.getId() != null && !equipamento.getId().equals(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "O ID do equipamento não pode ser alterado."
                ));
            }

            if (equipamentoRepository.existsById(id)) {
                equipamento.setId(id);
                Estoque equipamentoAtualizado = equipamentoRepository.save(equipamento);
                return ResponseEntity.status(200).body(equipamentoAtualizado);

            } else {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Equipamento não encontrado."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "erro", "Erro ao atualizar equipamento.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // Exclui um equipamento existente pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipamentoById(@PathVariable Long id) {
        try {
            if (!equipamentoRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Equipamento não encontrado."
                ));
            }

            equipamentoRepository.deleteById(id);

            if (equipamentoRepository.existsById(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "Equipamento não foi excluído devido a conflito."
                ));
            }

            return ResponseEntity.status(200).body(Map.of(
                    "mensagem", "Equipamento excluído com sucesso."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of(
                    "erro", "Erro ao excluir equipamento.",
                    "detalhe", e.getMessage()
            ));
        }
    }
}

