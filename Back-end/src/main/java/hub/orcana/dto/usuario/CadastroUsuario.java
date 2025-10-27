package hub.orcana.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.Date;

public record CadastroUsuario(
        @NotBlank
        String nome,

        @NotBlank
        @Email
        String email,

        @Pattern(regexp = "^$|^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$")
        String telefone,

        @NotBlank
        String senha,
        Date dtNasc,
        boolean isAdmin
) {
}