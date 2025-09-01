package hub.orcana.controller;

import hub.orcana.service.EstoqueService;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EstoqueRepository;
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
        return service.getEstoque();
    }

    @GetMapping("/{nomeMaterial}")
    public List<?> getEstoqueByNome(@PathVariable String nomeMaterial) {
        return (List<?>) service.getEstoqueByNome(nomeMaterial).getBody();
    }

    @PostMapping
    public ResponseEntity<?> postEstoque(@RequestBody Estoque estoque) {
        return service.postEstoque(estoque);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> putEstoqueById(@PathVariable Long id, @RequestBody @Valid Estoque estoque) {
        return service.putEstoqueById(id, estoque);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEstoqueById(@PathVariable Long id) {
       return service.deleteEstoqueById(id);
    }
}
