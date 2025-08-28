package hub.orcana.service;

import hub.orcana.tables.repository.RelatorioRepository;
import org.springframework.stereotype.Service;

@Service
public class RelatorioService {
    private final RelatorioRepository repository;

    public RelatorioService(RelatorioRepository repository) {
        this.repository = repository;
    }
}
