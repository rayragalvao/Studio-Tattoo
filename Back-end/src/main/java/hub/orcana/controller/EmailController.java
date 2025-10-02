package hub.orcana.controller;
import hub.orcana.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notificacoes")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/teste")
    public ResponseEntity<String> enviarEmailTeste() {
        try {
            emailService.enviarTextoSimples(
                    "linyaalvesm@gmail.com",
                    "Teste de envio",
                    "Olá, este é um e-mail de teste!"
            );
            return ResponseEntity.ok("E-mail enviado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}

