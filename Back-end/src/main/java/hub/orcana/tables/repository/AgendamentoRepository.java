package hub.orcana.tables.repository;

import hub.orcana.tables.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // busca todos os agendamentos de um usuário específico
    List<Agendamento> findByUsuarioId(Long usuarioId);
}