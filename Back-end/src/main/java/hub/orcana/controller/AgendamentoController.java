package hub.orcana.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import hub.orcana.service.AgendamentoService;
import hub.orcana.tables.Agendamento;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/agendamento")
@Tag(name = "Agendamentos", description = "API para gerenciamento de agendamentos")
public class AgendamentoController {
    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos os agendamentos")
    public ResponseEntity<?> getAgendamento(){
        try{
            List<Agendamento> agenda = service.getAgendamentos();
            if(agenda.isEmpty()){
                return ResponseEntity.status(204).body(null);
            }else{
                return ResponseEntity.status(200).body(agenda);
            }
        }catch (Exception e){
            return ResponseEntity.status(400).body("Erro ao listar agendas" + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    @Operation(summary = "Listar agendamento por ID")
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
    public ResponseEntity<?> getAgendamentosByStatus(@PathVariable String status) {
        try {
            List<Agendamento> sitStatus = service.getAgendamentosByStatus(status);
            if (sitStatus.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.ok(sitStatus); // Retorna a lista completa
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar situação do status: " + e.getMessage());
        }
    }

 /*   @GetMapping("/dataHora/{dthora}")
    public ResponseEntity<?> getAgendamentosByDataHora(@PathVariable String dthora) {
        try {
            List<Agendamento> diaHora = service.getAgendamentosByDataHora(dthora);
            if (diaHora.isEmpty()) {
                return ResponseEntity.status(204).body(null);
            }
            return ResponseEntity.ok(diaHora); // Retorna a lista completa
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao buscar material: " + e.getMessage());
        }
    }
*/

    @PostMapping
    @Operation(summary = "Inserir novo agendamento")
    public ResponseEntity<?> postAgendamento( @RequestBody  Agendamento agendamento){
        try{
            Agendamento novaAgenda = service.postAgendamento(agendamento);
            return ResponseEntity.status(201).body(novaAgenda);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body("Erro ao salvar agendamento" + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao salvar agendamento" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar agendamento pelo ID")
    public ResponseEntity<?> putAgendamento(@PathVariable Long id, @RequestBody @Valid Agendamento agendamento){
        try{
            Agendamento novaAgenda = service.putAgendamentoById(id, agendamento);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro ao atualizar a agenda" + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao atualizar a agenda" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar agendamento pelo ID")
    public ResponseEntity<String> deleteAgendamento(@PathVariable Long id){
        try{
             service.deleteAgendamentoById(id);
            return ResponseEntity.status(204).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("Erro excluir agenda" + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro exluir agenda" + e.getMessage());
        }
    }


}


