package hub.orcana.controller;

import hub.orcana.service.EquipamentoService;
import hub.orcana.tables.Equipamento;
import hub.orcana.tables.repository.EquipamentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamento")
public classEquipamentoController {
    private final EquipamentoService service;
    private final EquipamentoRepository equipamentoRepository;

    public EquipamentoController(EquipamentoService service, EquipamentoRepository equipamentoRepository) {
        this.service = service;
        this.equipamentoRepository = equipamentoRepository;
    }

    @GetMapping
    public ResponseEntity<?> getEquipamento() {
        return service.getEquipamento();
    }

    @GetMapping("/{nomeEquipamento}")
    public List<?> getEquipamentoByNome(@PathVariable String nomeEquipamento) {
        return (List<?>) service.getEquipamentoByNome(nomeEquipamento).getBody();
    }

    @PostMapping
    public ResponseEntity<?> postEquipamento(@RequestBody Equipamento equipamento) {
        return service.postEquipamento(equipamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> putEquipamentoById(@PathVariable Long id, @RequestBody @Valid Equipamento equipamento) {
        return service.putEquipamentoById(id, equipamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipamentoById(@PathVariable Long id) {
       return service.deleteEquipamentoById(id);
    }



}
