package hub.orcana.tables.repository;

import hub.orcana.tables.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, String> {

    @Query("SELECT o FROM Orcamento o WHERE o.email = :email")
    List<Orcamento> findOrcamentoByEmail(@Param("email") String email);

    Optional<Orcamento> findTopByOrderByIdDesc();

    Optional<Orcamento> findById(Long id);

}