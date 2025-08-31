package hub.orcana.controller;

import hub.orcana.service.EquipamentoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/equipamento")
public classEquipamentoController {
    private final EquipamentoService service;

    public EquipamentoController(EquipamentoService service) {
        this.service = service;
    }
}
