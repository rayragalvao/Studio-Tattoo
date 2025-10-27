package hub.orcana.dto.usuario;

public record UsuarioToken (
        Long id,
        String nome,
        String email,
        boolean isAdmin,
        String token
){

    public UsuarioToken {
    }
}