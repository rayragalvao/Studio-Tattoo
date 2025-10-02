package hub.orcana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarTextoSimples(String destinatario, String assunto, String texto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("orcanatechschool@gmail.com"); // e-mail da aplicação Brevo
        message.setTo(destinatario);
        message.setSubject(assunto);
        message.setText(texto);

        mailSender.send(message);
    }
}
