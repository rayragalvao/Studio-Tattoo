package hub.orcana.dto.estoque;

import jakarta.validation.constraints.NotNull;

public record AtualizarQtdEstoque(
        @NotNull
        Double quantidade
) {
}
