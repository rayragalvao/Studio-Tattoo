package hub.orcana.dto;

public record ListarUsuarios(
        Long id,
        String nome,
        String email,
        String telefone,
        boolean isAdmin
) {
}
