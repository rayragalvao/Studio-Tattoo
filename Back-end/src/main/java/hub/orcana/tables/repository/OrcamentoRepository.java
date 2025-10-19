package hub.orcana.tables.repository;

import hub.orcana.tables.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    @Query("SELECT o FROM Orcamento o WHERE o.email = :email")
    List<Orcamento> findOrcamentoByEmail(@Param("email") String email);


}
