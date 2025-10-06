package hub.orcana.exception;

public class UsuarioProtegidoException extends RuntimeException {
    public UsuarioProtegidoException(Long id) {
        super("Usuário com ID " + id + " é protegido e não pode ser excluído.");
    }
}
