package hub.orcana.tables.repository;

import hub.orcana.tables.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipamentoRepository extends JpaRepository<Estoque, Long> {
}
