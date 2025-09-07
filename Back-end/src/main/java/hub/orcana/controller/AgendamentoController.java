package hub.orcana.controller;

import hub.orcana.service.AgendamentoService;
import hub.orcana.tables.Agendamento;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/agendamento")
public class AgendamentoController {
    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @GetMapping
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
    public ResponseEntity<?> getAgendamentoPorId(@PathVariable Long id) {
        try {
            Agendamento agendamento = service.getAgendamentoPorId(id);
            return ResponseEntity.status(200).body(agendamento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    @GetMapping("/statusAtual/{status}")
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


