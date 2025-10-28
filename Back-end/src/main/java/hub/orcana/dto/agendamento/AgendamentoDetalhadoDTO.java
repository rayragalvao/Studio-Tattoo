package hub.orcana.dto.agendamento;

import hub.orcana.tables.Orcamento;
import hub.orcana.tables.Usuario;
import java.time.LocalDateTime;

public record AgendamentoDetalhadoDTO(
        Long id,
        LocalDateTime dataHora,
        String status,
        Usuario usuario,
        Orcamento orcamento
) {}