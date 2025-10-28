package hub.orcana.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import hub.orcana.service.AgendamentoService;
import hub.orcana.tables.Agendamento;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/agendamento")
@Tag(name = "Agendamentos", description = "API para gerenciamento de agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    // ------------------ CRUD BÁSICO ------------------

    @GetMapping
    @Operation(summary = "Listar todos os agendamentos")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getAgendamento() {
        try {
            List<Agendamento> agenda = service.getAgendamentos();
            if (agenda.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            } else {
                return ResponseEntity.status(200).body(agenda);
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao listar agendas: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Listar agendamento por ID")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getAgendamentoPorId(@PathVariable Long id) {
        try {
            Agendamento agendamento = service.getAgendamentoPorId(id);
            return ResponseEntity.status(200).body(agendamento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/statusAtual/{status}")
    @Operation(summary = "Listar agendamentos por status")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getAgendamentosByStatus(@PathVariable String status) {
        try {
            List<Agendamento> sitStatus = service.getAgendamentosByStatus(status);
            if (sitStatus.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.ok(sitStatus);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar status: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "Inserir novo agendamento")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> postAgendamento(@RequestBody Agendamento agendamento) {
        try {
            Agendamento novaAgenda = service.postAgendamento(agendamento);
            return ResponseEntity.status(201).body(novaAgenda);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body("Erro ao salvar agendamento: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao salvar agendamento: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento pelo ID")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> putAgendamento(@PathVariable Long id, @RequestBody @Valid Agendamento agendamento) {
        try {
            service.putAgendamentoById(id, agendamento);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao atualizar a agenda: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao atualizar a agenda: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar agendamento pelo ID")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<String> deleteAgendamento(@PathVariable Long id) {
        try {
            service.deleteAgendamentoById(id);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro excluir agenda: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro excluir agenda: " + e.getMessage());
        }
    }

    // ------------------ RELACIONAMENTOS ------------------

    @GetMapping("/detalhado/{id}")
    @Operation(summary = "Retorna agendamento com dados do usuário e orçamento")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getAgendamentoCompleto(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getAgendamentoCompleto(id));
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar agendamento detalhado: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar todos os agendamentos de um usuário")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> getAgendamentosPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<Agendamento> agendamentos = service.getAgendamentosPorUsuario(usuarioId);
            return agendamentos.isEmpty()
                    ? ResponseEntity.noContent().build()
                    : ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar agendamentos por usuário: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/orcamento/{orcamentoId}")
    @Operation(summary = "Atualiza o orçamento de um agendamento existente")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> atualizarOrcamentoDoAgendamento(
            @PathVariable Long id,
            @PathVariable Long orcamentoId) {
        try {
            var atualizado = service.atualizarOrcamento(id, orcamentoId);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao atualizar orçamento do agendamento: " + e.getMessage());
        }
    }
}