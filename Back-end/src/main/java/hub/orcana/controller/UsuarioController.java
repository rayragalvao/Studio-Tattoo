package hub.orcana.controller;

import hub.orcana.service.UsuarioService;
import hub.orcana.tables.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // Lista todos os usuários
    @GetMapping
    public ResponseEntity<?> listarUsuarios() {
        try {
            List<Usuario> usuarios = service.listar();
            if (usuarios.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.status(200).body(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao listar usuários: " + e.getMessage());
        }
    }

    // Busca usuário pelo id
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarUsuarioById(@PathVariable Long id) {
        try {
            var usuario = service.buscarById(id);
            if (usuario == null) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.status(200).body(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar usuário: " + e.getMessage());
        }
    }

    // Cria usuário
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody @Valid Usuario usuario) {
        try {
            Usuario novoUsuario = service.criar(usuario);
            return ResponseEntity.status(201).body(novoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body("Erro ao cadastrar usuário: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao cadastrar usuário: " + e.getMessage());
        }
    }

    // Atualiza usuário pelo id
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @RequestBody @Valid Usuario usuario) {
        try {
            Usuario usuarioAtualizado = service.atualizarById(id, usuario);
            return ResponseEntity.status(200).body(usuarioAtualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao atualizar usuário: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    // Deleta usuário pelo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        try {
            service.deletarById(id);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao excluir usuário: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao excluir usuário: " + e.getMessage());
        }
    }
}
