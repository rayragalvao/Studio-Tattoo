package hub.orcana.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.StandardCopyOption;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class GerenciadorDeArquivosService {

    private final Path pastaRaiz = Path.of("uploads");

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(pastaRaiz)) {
                Files.createDirectories(pastaRaiz);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar a pasta de uploads.", e);
        }
    }
    // salva o arquivo e retorna o caminho dele
    public String salvarArquivo(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Falha ao salvar arquivo vazio.");
            }

            String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destino = this.pastaRaiz.resolve(nomeArquivo);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return destino.toString();

        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar o arquivo.", e);
        }
    }
}
