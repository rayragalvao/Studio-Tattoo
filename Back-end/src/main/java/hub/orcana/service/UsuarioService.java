package hub.orcana.service;

import hub.orcana.exception.QuantidadeMinimaUsuariosException;
import hub.orcana.exception.UsuarioProtegidoException;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import hub.orcana.exception.DependenciaNaoEncontradaException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Service
//@RequiredArgsConstructor
@Slf4j
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }


    public Usuario criar(Usuario usuario) {

        if (usuario.getId() != null && repository.existsById(usuario.getId())) {
            throw new DependenciaNaoEncontradaException("ID já existente");
        }

        usuario.setId(null);
        Usuario novoUsuario = repository.save(usuario);
        log.info("Usuário criado com sucesso: ID {}", novoUsuario.getId());
        return novoUsuario;
    }

    private void validarIdUsuario(Long id) {
        if (!repository.existsById(id)) {
            throw new DependenciaNaoEncontradaException("Usuário");
        }
    }

    public List<Usuario> listar() {
        List<Usuario> usuarios = repository.findAll();
        log.debug("Listagem de usuários retornou {} registros", usuarios.size());
        return usuarios;
    }

    public Usuario buscarById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new DependenciaNaoEncontradaException("Usuário"));
    }

    public Usuario atualizarById(Long id, Usuario usuario) {
        validarIdUsuario(id);

        if (usuario.getId() != null && !usuario.getId().equals(id)) {
            throw new DependenciaNaoEncontradaException("ID inconsistente para atualização");
        }

        usuario.setId(id);
        Usuario atualizado = repository.save(usuario);
        log.info("Usuário atualizado com sucesso: ID {}", atualizado.getId());
        return atualizado;
    }

    public void deletarById(Long id) {
        if (repository.count() == 1) {
            throw new QuantidadeMinimaUsuariosException();
        }

        if (id == 1) {
            throw new UsuarioProtegidoException(id);
        }

        validarIdUsuario(id);

        repository.deleteById(id);
        log.info("Usuário deletado com sucesso: ID {}", id);
    }
}

