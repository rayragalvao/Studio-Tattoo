package hub.orcana.service;

import hub.orcana.dto.DadosCadastroOrcamento;
import hub.orcana.tables.Orcamento;
import hub.orcana.tables.repository.OrcamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrcamentoService {

    private final OrcamentoRepository repository;
    private final GerenciadorDeArquivosService gerenciadorService;
    private final EmailService emailService;

    public Orcamento postOrcamento(DadosCadastroOrcamento dados) {

        List<String> urlsImagens = new ArrayList<>();

        if (dados.imagemReferencia() != null && !dados.imagemReferencia().isEmpty()) {
            for (MultipartFile file : dados.imagemReferencia()) {
                String urlImagemSalva = gerenciadorService.salvarArquivo(file);
                urlsImagens.add(urlImagemSalva);
            }
        }

        Orcamento orcamento = new Orcamento(
                dados.email(),
                dados.ideia(),
                dados.tamanho(),
                dados.cores(),
                dados.localCorpo(),
                urlsImagens
        );

        emailService.enviaEmailNovoOrcamento(dados.email(), dados.codigoOrcamento());
        return repository.save(orcamento);

    }

    public List<Orcamento> findAllOrcamentos() {
        return repository.findAll();
    }
}