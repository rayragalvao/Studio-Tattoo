package hub.orcana.service;

import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    // cria um usuário
    public ResponseEntity<?> criar(@Valid Usuario usuario) {
        try {
            if (usuario.getId() != null && repository.existsById(usuario.getId())) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "ID já existe."
                ));
            }
            usuario.setId(null);
            Usuario salvo = repository.save(usuario);
            return ResponseEntity.status(201).body(salvo);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao criar usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // listar todos os usuários
    public ResponseEntity<?> listar() {
        try {
            List<Usuario> usuarios = repository.findAll();
            if (usuarios.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao listar os usuários.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // buscar pelo Id
    public ResponseEntity<?> buscarById(Long id) {
        try {
            Optional<Usuario> usuario = repository.findById(id);
            return usuario.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                            "erro", "Usuário não encontrado."
                    )));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // atualiza pelo Id
    public ResponseEntity<?> atualizarById(Long id, @Valid Usuario usuario) {
        try {
            if (usuario.getId() != null && !usuario.getId().equals(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "O ID do usuário não pode ser alterado."
                ));
            }

            if (!repository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Usuário não encontrado para atualização."
                ));
            }

            usuario.setId(id);
            Usuario atualizado = repository.save(usuario);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao atualizar usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // deletar pelo id
    public ResponseEntity<?> deletarById(Long id) {
        try {
            if (!repository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of(
                        "erro", "Usuário não encontrado para exclusão."
                ));
            }

            repository.deleteById(id);

            if (repository.existsById(id)) {
                return ResponseEntity.status(409).body(Map.of(
                        "erro", "Usuário não foi excluído devido a conflito."
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Usuário excluído com sucesso."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao excluir usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }
}
