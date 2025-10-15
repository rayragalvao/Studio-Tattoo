package hub.orcana.controller;

import hub.orcana.service.OrcamentoService;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.Orcamento;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import hub.orcana.dto.DadosCadastroOrcamento;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/orcamento")
public class OrcamentoController {
    private final OrcamentoService service;

    public OrcamentoController(OrcamentoService service) {
        this.service = service;
    }

    @PostMapping
    @Operation(summary = "Inserir orçamento no banco de dados")
    @SecurityRequirement(name = "Bearer")
    public ResponseEntity<?> postOrcamento(@ModelAttribute DadosCadastroOrcamento dados) {
        log.info(dados.toString());
        var novoOrcamento = service.postOrcamento(dados);
        return ResponseEntity.status(201).body(Map.of(
                "success", true,
                "id", novoOrcamento.getId(),
                "message", "Orçamento criado com sucesso"
        ));
    }
}
