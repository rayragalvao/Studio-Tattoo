package hub.orcana.controller;

import hub.orcana.dto.DadosCadastroMaterial;
import hub.orcana.service.EstoqueService;
import hub.orcana.tables.Estoque;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estoque")
@Tag(name = "Estoque", description = "API para gerenciamento de materiais em estoque")
public class EstoqueController {
    private final EstoqueService service;

    public EstoqueController(EstoqueService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos os materiais")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getEstoque() {
        var materiais = service.getEstoque();
        return ResponseEntity.ok(materiais);
    }

    @GetMapping("/{nomeMaterial}")
    @Operation(summary = "Buscar material pelo nome")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getEstoqueByNome(@PathVariable @Valid String nomeMaterial) {
        var material = service.getEstoqueByNome(nomeMaterial);
        return ResponseEntity.ok(material);
    }

    @PostMapping
    @Operation(summary = "Inserir material no estoque")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> postEstoque(@RequestBody Estoque estoque) {
        var novoMaterial = service.postEstoque(estoque);
        return ResponseEntity.status(201).body(novoMaterial);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar material pelo ID")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> putEstoqueById(@PathVariable Long id, @RequestBody @Valid Estoque estoque) {
        Estoque novoMaterial = service.putEstoqueById(id, estoque);
        return ResponseEntity.status(201).body(novoMaterial);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar material pelo ID")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> deleteEstoqueById(@PathVariable Long id) {
        service.deleteEstoqueById(id);
        return ResponseEntity.status(204).body(null);
    }
}
