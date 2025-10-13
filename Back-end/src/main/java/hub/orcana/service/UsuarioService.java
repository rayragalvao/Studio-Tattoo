package hub.orcana.service;

import hub.orcana.dto.*;
import hub.orcana.exception.QuantidadeMinimaUsuariosException;
import hub.orcana.exception.UsuarioProtegidoException;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import hub.orcana.exception.DependenciaNaoEncontradaException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
@Slf4j
public class UsuarioService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GerenciadorTokenJwt gerenciadorTokenJwt;

    @Autowired
    private AuthenticationManager authenticationManager;

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }


    public Usuario criar(CadastroUsuario usuario) {
        Usuario novoUsuario = UsuarioMapper.of(usuario);

        String senhaCriptografada = passwordEncoder.encode(usuario.senha());
        novoUsuario.setSenha(senhaCriptografada);

        log.info("Usuário criado com sucesso: ID {}", novoUsuario.getId());
        return novoUsuario;
    }

    public UsuarioToken autenticar(LoginUsuario usuario) {
        final UsernamePasswordAuthenticationToken credentials = new UsernamePasswordAuthenticationToken(
                usuario.email(),
                usuario.senha()
        );
        final Authentication authentication = this.authenticationManager.authenticate(credentials);

        Usuario usuarioAutenticado = repository.findByEmail(usuario.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatusCode.valueOf(404), "Email de usuário não cadastrado"));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String tokenJwt = gerenciadorTokenJwt.gerarToken(authentication);

        return UsuarioMapper.of(usuarioAutenticado, tokenJwt);
    }

    public List<ListarUsuarios> listar() {
        List<Usuario> usuariosEncontrados = repository.findAll();
        log.debug("Listagem de usuários retornou {} registros", usuariosEncontrados.size());
        return usuariosEncontrados.stream().map(UsuarioMapper::of).collect(Collectors.toList());
    }

    private void validarIdUsuario(Long id) {
        if (!repository.existsById(id)) {
            throw new DependenciaNaoEncontradaException("Usuário");
        }
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

