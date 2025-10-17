package hub.orcana.dto.estoque;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroMaterial(
    @NotBlank String nome,
    @NotNull Double quantidade,
    @NotBlank String unidadeMedida,
    Double minAviso
){}

