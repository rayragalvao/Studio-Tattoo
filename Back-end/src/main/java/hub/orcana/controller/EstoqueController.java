package hub.orcana.controller;

import hub.orcana.service.EstoqueService;
import hub.orcana.tables.Estoque;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {
    private final EstoqueService service;

    public EstoqueController(EstoqueService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getEstoque() {
        try {
            List<Estoque> material = service.getEstoque();
            if (material.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.status(200).body(material);
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao listar materiais: " + e.getMessage());
        }
    }

    @GetMapping("/{nomeMaterial}")
    public ResponseEntity<?> getEstoqueByNome(@PathVariable String nomeMaterial) {
        try {
            var material = service.getEstoqueByNome(nomeMaterial);
            if (material.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.status(200).body(material);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar material: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> postEstoque(@RequestBody Estoque estoque) {
        try {
            Estoque novoMaterial = service.postEstoque(estoque);
            return ResponseEntity.status(201).body(novoMaterial);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body("Erro ao cadastrar material: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao cadastrar material: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> putEstoqueById(@PathVariable Long id, @RequestBody @Valid Estoque estoque) {
        try {
            Estoque novoMaterial = service.putEstoqueById(id, estoque);
            return ResponseEntity.status(201).body(novoMaterial);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao atualizar material: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao atualizar material: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstoqueById(@PathVariable Long id) {
       try {
            service.deleteEstoqueById(id);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao excluir material: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao excluir material: " + e.getMessage());
       }
    }
}
