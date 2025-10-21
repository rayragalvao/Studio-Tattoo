package hub.orcana.service;

import hub.orcana.config.GerenciadorTokenJwt;
import hub.orcana.dto.usuario.*;
import hub.orcana.exception.QuantidadeMinimaUsuariosException;
import hub.orcana.exception.UsuarioProtegidoException;
import hub.orcana.tables.Orcamento;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.OrcamentoRepository;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
@Slf4j
public class UsuarioService {

    private final PasswordEncoder passwordEncoder;
    private final GerenciadorTokenJwt gerenciadorTokenJwt;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository repository;
    private final OrcamentoRepository orcamentoRepository;

    public UsuarioService(UsuarioRepository repository, AuthenticationManager authenticationManager, GerenciadorTokenJwt gerenciadorTokenJwt, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.authenticationManager = authenticationManager;
        this.gerenciadorTokenJwt = gerenciadorTokenJwt;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario criar(CadastroUsuario usuario) {
        Usuario novoUsuario = UsuarioMapper.of(usuario);

        if (repository.existsByEmail(novoUsuario.getEmail())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(409), "Email de usuário já cadastrado.");
        }

        if (repository.existsByTelefone(novoUsuario.getTelefone())) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(409), "Telefone de usuário já cadastrado.");
        }

        String senhaCriptografada = passwordEncoder.encode(usuario.senha());
        novoUsuario.setSenha(senhaCriptografada);

        log.info("Usuário criado com sucesso: ID {}", novoUsuario.getId());
        return repository.save(novoUsuario);
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

    public ListarUsuarios buscarById(Long id) {
        return UsuarioMapper.of(repository.findById(id)
                .orElseThrow(() -> new DependenciaNaoEncontradaException("Usuário")));
    }

    public ListarUsuarios atualizarById(Long id, Usuario usuario) {
        validarIdUsuario(id);

        if (usuario.getId() != null && !usuario.getId().equals(id)) {
            throw new DependenciaNaoEncontradaException("ID inconsistente para atualização");
        }

        usuario.setId(id);
        Usuario atualizado = repository.save(usuario);
        log.info("Usuário atualizado com sucesso: ID {}", atualizado.getId());
        return UsuarioMapper.of(atualizado);
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

