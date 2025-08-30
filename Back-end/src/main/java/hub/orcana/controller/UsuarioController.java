package hub.orcana.controller;

import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    // cria o usuário
    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        try {
            Usuario salvo = repository.save(usuario);
            return ResponseEntity.status(201).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // listar todos os usuários existentes
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        List<Usuario> usuarios = repository.findAll();
        return usuarios.isEmpty()
                ? ResponseEntity.status(204).build()
                : ResponseEntity.status(200).body(usuarios);
    }

    // buscar usuário pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPeloId(@PathVariable Long id) {
        Optional<Usuario> usuario = repository.findById(id);
        return usuario.map(value -> ResponseEntity.status(200).body(value)).orElseGet(()
                -> ResponseEntity.status(404).build());
    }

    // atualizar os dados do usuário pelo id
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarPeloId(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).build();
        }

        try {
            usuario.setId(id);
            Usuario atualizado = repository.save(usuario);
            return ResponseEntity.status(200).body(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // deleta o usuario pelo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPeloId(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).build();
        }
        try {
            repository.deleteById(id);
            return ResponseEntity.status(204).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
