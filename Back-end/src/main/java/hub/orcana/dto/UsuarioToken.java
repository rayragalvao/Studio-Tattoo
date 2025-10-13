package hub.orcana.dto;

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
