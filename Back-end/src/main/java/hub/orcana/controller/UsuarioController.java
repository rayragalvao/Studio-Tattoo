package hub.orcana.controller;

import hub.orcana.dto.CadastroUsuario;
import hub.orcana.service.UsuarioService;
import hub.orcana.tables.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuários", description = "Gerenciamento de usuários")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // Lista os usuários
    @GetMapping
    @Operation(summary = "Listar todos os usuários")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        var usuarios = service.listar();
        return usuarios.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(usuarios);
    }

    // Busca usuário pelo ID
    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID")
    public ResponseEntity<Usuario> buscarUsuarioById(@PathVariable Long id) {
        var usuario = service.buscarById(id);
        return usuario != null
                ? ResponseEntity.ok(usuario)
                : ResponseEntity.noContent().build();
    }

    // Cria um usuário
    @PostMapping
    @Operation(summary = "Criar um novo usuário")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody @Valid CadastroUsuario usuario) {
        var novoUsuario = service.criar(usuario);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    // Atualiza um usuário pelo ID
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um usuário existente por ID")
    public ResponseEntity<Usuario> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid Usuario usuario
    ) {
        var usuarioAtualizado = service.atualizarById(id, usuario);
        return ResponseEntity.ok(usuarioAtualizado);
    }
     // Deleta um usuário pelo ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar um usuário existente por ID")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        service.deletarById(id);
        return ResponseEntity.noContent().build();
    }
}