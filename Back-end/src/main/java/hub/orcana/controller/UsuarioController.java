package hub.orcana.controller;

import hub.orcana.service.UsuarioService;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioRepository repository, UsuarioService service)
    { this.service = service; }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Usuario usuario) {
        return service.criar(usuario);
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPeloId(@PathVariable @Valid Long id) {
        return service.buscarPeloId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarPeloId(@PathVariable @Valid Long id,
                                             @RequestBody @Valid Usuario usuario) {
        return service.atualizarPeloId(id, usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarPeloId(@PathVariable @Valid Long id) {
        return service.deletarPeloId(id);
    }
}
