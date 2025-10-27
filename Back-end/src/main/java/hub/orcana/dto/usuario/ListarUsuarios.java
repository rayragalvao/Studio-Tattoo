package hub.orcana.dto.usuario;

public record ListarUsuarios(
        Long id,
        String nome,
        String email,
        String telefone,
        boolean isAdmin
) {
}