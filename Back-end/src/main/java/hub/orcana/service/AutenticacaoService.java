package hub.orcana.service;

import hub.orcana.dto.usuario.DetalhesUsuario;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public AutenticacaoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(username);

        if (usuario.isEmpty()) {
            throw new UsernameNotFoundException(String.format("Usuário %s não encontrado", username));
        }

        return new DetalhesUsuario(usuario.get());
    }
}