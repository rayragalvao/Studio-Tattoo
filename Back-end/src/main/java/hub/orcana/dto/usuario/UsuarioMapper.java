package hub.orcana.dto.usuario;

import hub.orcana.tables.Usuario;

public class UsuarioMapper {

    public static Usuario of(CadastroUsuario usuarioDto) {
        Usuario user = new Usuario();

        user.setNome(usuarioDto.nome());
        user.setEmail(usuarioDto.email());
        user.setTelefone(usuarioDto.telefone());
        user.setSenha(usuarioDto.senha());
        user.setDtNasc(usuarioDto.dtNasc());
        user.setAdmin(usuarioDto.isAdmin());

        return user;
    }

    public static Usuario of(LoginUsuario usuarioDto) {
        Usuario user = new Usuario();

        user.setEmail(usuarioDto.email());
        user.setSenha(usuarioDto.senha());

        return user;
    }

    public static UsuarioToken of(Usuario usuario, String token) {
        UsuarioToken userToken = new UsuarioToken(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.isAdmin(),
                token
        );

        return userToken;
    }

    public static ListarUsuarios of(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        ListarUsuarios usuarios = new ListarUsuarios(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.isAdmin()
        );

        return usuarios;
    }
}