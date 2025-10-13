package hub.orcana.dto;

import java.util.Date;

public record CadastroUsuario(
        String nome,
        String email,
        String telefone,
        String senha,
        Date dtNasc,
        boolean isAdmin
) {
}
