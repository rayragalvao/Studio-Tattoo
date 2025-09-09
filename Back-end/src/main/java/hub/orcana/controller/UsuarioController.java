package hub.orcana.controller;

import hub.orcana.service.UsuarioService;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioRepository repository, UsuarioService service) {
        this.service = service;
    }

    // cria o usuário
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody @Valid Usuario usuario) {
        return service.criar(usuario);
    }

    // lista todos os usuários
    @GetMapping
    public ResponseEntity<?> listar() {
        return service.listar();
    }

    // busca o usuario pelo id
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarById(@PathVariable Long id) {
        return service.buscarById(id);
    }


    // atualiza o usuário pelo id
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarById(@PathVariable Long id, @RequestBody @Valid Usuario usuario) {
        return service.atualizarById(id, usuario);
    }

    // deleta o usuário pelo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarById(@PathVariable Long id) {
        return service.deletarById(id);
    }
}