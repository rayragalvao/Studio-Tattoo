package hub.orcana.service;

import hub.orcana.tables.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class AgendamentoService {
    private final AgendamentoRepository repository;

    public AgendamentoService(AgendamentoRepository repository) {
        this.repository = repository;
    }
}
