package hub.orcana.exception;

public class QuantidadeMinimaUsuariosException extends RuntimeException {
    public QuantidadeMinimaUsuariosException() {
        super("Quantidade mínima de usuários atingida. Não é possível excluir mais registros.");
    }
}
