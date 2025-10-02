package hub.orcana.service;

import hub.orcana.tables.repository.OrcamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class OrcamentoService {
    private final OrcamentoRepository repository;

    public OrcamentoService(OrcamentoRepository repository) {
        this.repository = repository;
    }
}
