package hub.orcana.controller;

import hub.orcana.tables.Usuario;
import hub.orcana.tables.TipoUsuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // CREATE - POST
    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        // Validação do tipo de usuário
        if (usuario.getTipo() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null); // você pode criar um objeto de erro se quiser
        }

        try {
            Usuario salvo = repository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // READ ALL - GET
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        List<Usuario> usuarios = repository.findAll();
        return usuarios.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.status(HttpStatus.OK).body(usuarios);
    }

    // READ ONE - GET/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable Long id) {
        Optional<Usuario> usuario = repository.findById(id);
        return usuario.isPresent()
                ? ResponseEntity.ok(usuario.get())
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // UPDATE - PUT/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // Validação do tipo de usuário
        if (usuario.getTipo() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            usuario.setId(id); // garante que atualize o certo
            Usuario atualizado = repository.save(usuario);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE - DELETE/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        try {
            repository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
