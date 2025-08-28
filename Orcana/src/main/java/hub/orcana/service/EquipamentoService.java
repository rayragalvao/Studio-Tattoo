package hub.orcana.service;

import hub.orcana.tables.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class EquipamentoService {
    private final EquipamentoRepository repository;

    public EquipamentoService(EquipamentoRepository repository) {
        this.repository = repository;
    }
}
