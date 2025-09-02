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

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Usuario usuario) {
        Usuario userSalvo = service.criar(usuario);
        return ResponseEntity.status(201).body(Map.of(
                "mensagem", "Usuário criado com sucesso!",
                "dados", userSalvo
        ));

        // Tirei o try catch daqui pq os únicos erros que podem acontecer são
        // erros de validação (que o controller já lida) ou
        // erros de servidor (500) que o Spring lida automaticamente,
        // Mas nos outros métodos precisa do try catch pq eles fazem buscas no banco
        // e podem não encontrar o que foi pedido, e temos que tratar isso,
        // então nos outros métodos no service tem que fazer validações, do tipo se o
        // ID existe e enviar uma exception correspondente, pode perguntar pro copilot
        // pra saber qual a exception mais adequada, assim no controller pode fazer um
        // try catch mais especifico, como catch (NoSuchElementException e) por exemplo
        // e encadear vários catchs se precisar

    }

//    @PostMapping
//    public ResponseEntity<?> criar(@RequestBody @Valid Usuario usuario) {
//        return service.criar(usuario);
//    }

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
