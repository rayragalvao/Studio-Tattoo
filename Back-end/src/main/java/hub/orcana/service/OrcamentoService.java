package hub.orcana.service;

import hub.orcana.dto.DadosCadastroOrcamento;
import hub.orcana.tables.Orcamento;
import hub.orcana.tables.repository.OrcamentoRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrcamentoService {
    private final OrcamentoRepository repository;

    public Orcamento postOrcamento(DadosCadastroOrcamento dados) {
        List<String> urlImagem = new ArrayList<>();
        Path pastaUploads = Path.of("uploads");
        try {
            if (!Files.exists(pastaUploads)) {
                Files.createDirectories(pastaUploads);
            }
            if (dados.imagemReferencia() != null) {
                for (MultipartFile file : dados.imagemReferencia()) {
                    String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path destino = pastaUploads.resolve(nomeArquivo);
                    Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
                    urlImagem.add(destino.toString());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem", e);
        }
        Orcamento orcamento = new Orcamento(
                dados.email(),
                dados.ideia(),
                dados.tamanho(),
                dados.cores(),
                dados.localCorpo(),
                urlImagem
        );
        return repository.save(orcamento);
    }
}
