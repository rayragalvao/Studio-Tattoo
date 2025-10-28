package hub.orcana.controller;

import hub.orcana.service.OrcamentoService;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.Orcamento;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import hub.orcana.dto.DadosCadastroOrcamento;

@Slf4j
@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/orcamento")
public class OrcamentoController {
    private final OrcamentoService service;

    public OrcamentoController(OrcamentoService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Inserir orçamento no banco de dados")
    public ResponseEntity<?> postOrcamento(@ModelAttribute DadosCadastroOrcamento dados) {
        log.info(dados.toString());
        var novoOrcamento = service.postOrcamento(dados);
        return ResponseEntity.status(201).body(Map.of(
                "success", true,
                "id", novoOrcamento.getId(),
                "message", "Orçamento criado com sucesso"
        ));
    }

    @GetMapping
    public ResponseEntity<List<Orcamento>> getOrcamnetos() {
        return ResponseEntity.ok(service.findAllOrcamentos());
    }

}
