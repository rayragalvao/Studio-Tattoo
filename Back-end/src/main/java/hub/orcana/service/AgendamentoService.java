package hub.orcana.service;

import hub.orcana.tables.Agendamento;
import hub.orcana.tables.repository.AgendamentoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class AgendamentoService {
    private final AgendamentoRepository repository;


    public AgendamentoService(AgendamentoRepository repository) {
        this.repository = repository;
    }


    // Lista todos os agendamentos existentes
    public List<Agendamento> getAgendamentos() {
        return repository.findAll();
    }

    //Busca agendamento pelo id
    public Agendamento getAgendamentoPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }


    // Busca agendamentos por status
    public List<Agendamento> getAgendamentosByStatus( String status) {
        var agendamentosStatus = repository.findAll()
                .stream()
                .filter(atual -> atual.getStatus().name().equalsIgnoreCase(status))
                .toList();

        return agendamentosStatus;
    }

    // Busca agendamentos por data hora
  /*  public List<Agendamento> getAgendamentosByDataHora( String dataHora) {
        LocalDateTime data = LocalDateTime.parse(dataHora);
        return repository.findAll()
                .stream()
                .filter(atual -> atual.getDataHora().equals(data))
                .toList();
    }
*/

    // Cadastra um novo agendamento
    public Agendamento postAgendamento(@RequestBody Agendamento agendamento) {
        if (agendamento.getId() != null) {
            if (repository.existsById(agendamento.getId())) {
                throw new IllegalArgumentException("O ID do agendamento já existe.");
            } else {
                agendamento.setId(null); // Garante que será criado novo
            }
        }

        return repository.save(agendamento);
    }

    // Atualiza um agendamento existente pelo ID
    public Agendamento putAgendamentoById(@PathVariable Long id, @RequestBody Agendamento agendamento) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Agendamento não encontrado.");
        }

        agendamento.setId(id);
        return repository.save(agendamento);
    }

    // Exclui um agendamento existente pelo ID
    public void deleteAgendamentoById(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Agendamento não encontrado.");
        }

        repository.deleteById(id);

        if (repository.existsById(id)) {
            throw new IllegalArgumentException("Erro ao excluir agendamento.");
        }
    }
}

