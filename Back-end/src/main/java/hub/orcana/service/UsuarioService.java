package hub.orcana.service;

import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    // Cria um novo usuário
    public Usuario criar(Usuario usuario) {
        if (usuario.getId() != null && repository.existsById(usuario.getId())) {
            throw new IllegalArgumentException("O ID do usuário já existe.");
        }
        usuario.setId(null);
        return repository.save(usuario);
    }

    // Lista todos os usuários
    public List<Usuario> listar() {
        return repository.findAll();
    }

    // Busca usuário pelo ID
    public Usuario buscarById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    // Atualiza usuário pelo ID
    public Usuario atualizarById(Long id, Usuario usuario) {
        if (usuario.getId() != null && !usuario.getId().equals(id)) {
            throw new IllegalArgumentException("O ID do usuário não pode ser alterado.");
        }

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado para atualização.");
        }

        usuario.setId(id);
        return repository.save(usuario);
    }

    // Deleta usuário pelo ID
    public void deletarById(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado para exclusão.");
        }

        repository.deleteById(id);

        if (repository.existsById(id)) {
            throw new IllegalArgumentException("Erro ao excluir usuário.");
        }
    }
}
