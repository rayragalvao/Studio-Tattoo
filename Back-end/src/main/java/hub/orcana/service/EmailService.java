package hub.orcana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

//    private String templateEmail = "<!DOCTYPE html><html lang=\"pt-br\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>[ASSUNTO DO SEU E-MAIL]</title><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>";

    public void enviarTextoSimples(String destinatario, String assunto, String texto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("orcanatechschool@gmail.com"); // e-mail da aplicação Brevo
        message.setTo(destinatario);
        message.setSubject(assunto);
        message.setText(texto);

        mailSender.send(message);
    }

    public void enviaEmailNovoOrcamento(String emailCliente, String codigoOrcamento) {
        if (emailCliente == null || emailCliente.isBlank()) {
            throw new IllegalArgumentException("Destinatário inválido para envio de e-mail.");
        }

        String assunto = "Confirmação de Recebimento de Orçamento - Júpiter Frito";
        String textoInicial = "Olá $nomeCliente, recebemos sua solicitação de orçamento e " +
                "os detalhes já estão sendo analisados. Em breve, entraremos em contato com você.\n\n" +
                "Não esqueça de anotar o código do seu orçamento para futuras referências: $codigoOrcamento\n\n" +
                "Obrigado por escolher a Júpiter Frito! :) \n\n" +
                "Atenciosamente,\n\n" +
                "Equipe Júpiter Frito";

        String textoFinal = textoInicial
                .replace("$nomeCliente", emailCliente)
                .replace("$codigoOrcamento", codigoOrcamento);

        enviarTextoSimples(emailCliente, assunto, textoFinal);
    }
}
