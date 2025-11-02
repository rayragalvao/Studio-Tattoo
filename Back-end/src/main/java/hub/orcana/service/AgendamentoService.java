package hub.orcana.service;

import hub.orcana.dto.agendamento.AgendamentoDetalhadoDTO;
import hub.orcana.tables.Agendamento;
import hub.orcana.tables.Orcamento;
import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.AgendamentoRepository;
import hub.orcana.tables.repository.OrcamentoRepository;
import hub.orcana.tables.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final OrcamentoRepository orcamentoRepository;

    public AgendamentoService(
            AgendamentoRepository repository,
            UsuarioRepository usuarioRepository,
            OrcamentoRepository orcamentoRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.orcamentoRepository = orcamentoRepository;
    }

    // ------------------ CRUD BÁSICO ------------------

    public List<Agendamento> getAgendamentos() {
        return repository.findAll();
    }

    public Agendamento getAgendamentoPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
    }

    public List<Agendamento> getAgendamentosByStatus(String status) {
        return repository.findAll()
                .stream()
                .filter(atual -> atual.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    public Agendamento postAgendamento(Agendamento agendamento) {
        if (agendamento.getUsuario() == null || agendamento.getUsuario().getId() == null)
            throw new IllegalArgumentException("Usuário é obrigatório.");

        Usuario usuario = usuarioRepository.findById(agendamento.getUsuario().getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (agendamento.getOrcamento() == null || agendamento.getOrcamento().getId() == null)
            throw new IllegalArgumentException("Orçamento é obrigatório.");

        Orcamento orcamento = orcamentoRepository.findById(String.valueOf(agendamento.getOrcamento().getId()))
                .orElseThrow(() -> new IllegalArgumentException("Orçamento não encontrado."));

        agendamento.setUsuario(usuario);
        agendamento.setOrcamento(orcamento);

        return repository.save(agendamento);
    }

    public Agendamento putAgendamentoById(Long id, Agendamento agendamento) {
        Agendamento existente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));

        existente.setDataHora(agendamento.getDataHora());
        existente.setStatus(agendamento.getStatus());

        if (agendamento.getUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(agendamento.getUsuario().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
            existente.setUsuario(usuario);
        }

        if (agendamento.getOrcamento() != null) {
            Orcamento orcamento = orcamentoRepository.findById(String.valueOf(agendamento.getOrcamento().getId()))
                    .orElseThrow(() -> new IllegalArgumentException("Orçamento não encontrado."));
            existente.setOrcamento(orcamento);
        }

        return repository.save(existente);
    }

    public void deleteAgendamentoById(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Agendamento não encontrado.");
        }
        repository.deleteById(id);
        if (repository.existsById(id)) {
            throw new IllegalArgumentException("Erro ao excluir agendamento.");
        }
    }

    // ------------------ RELACIONAMENTOS ------------------

    // 🔹 1. Agendamento detalhado com usuário e orçamento
    public AgendamentoDetalhadoDTO getAgendamentoCompleto(Long id) {
        Agendamento agendamento = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
        return new AgendamentoDetalhadoDTO(
                agendamento.getId(),
                agendamento.getDataHora(),
                agendamento.getStatus().name(),
                agendamento.getUsuario(),
                agendamento.getOrcamento()
        );
    }

    // 🔹 2. Listar agendamentos por usuário
    public List<Agendamento> getAgendamentosPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    // 🔹 3. Atualizar o orçamento de um agendamento
    public Agendamento atualizarOrcamento(Long agendamentoId, Long orcamentoId) {
        Agendamento agendamento = repository.findById(agendamentoId)
                .orElseThrow(() -> new IllegalArgumentException("Agendamento não encontrado."));
        Orcamento orcamento = orcamentoRepository.findById(String.valueOf(orcamentoId))
                .orElseThrow(() -> new IllegalArgumentException("Orçamento não encontrado."));
        agendamento.setOrcamento(orcamento);
        return repository.save(agendamento);
    }
}
