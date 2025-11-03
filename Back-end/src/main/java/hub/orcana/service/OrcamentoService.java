package hub.orcana.service;

import hub.orcana.dto.DadosCadastroOrcamento;
import hub.orcana.tables.Orcamento;
import hub.orcana.tables.repository.OrcamentoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import hub.orcana.observer.OrcamentoObserver;
import hub.orcana.observer.OrcamentoSubject;

import java.util.ArrayList;
import java.util.List;

@Service
//@RequiredArgsConstructor comentei devido ao construtor manual, onde implemento o attach do observer
public class OrcamentoService implements OrcamentoSubject{

    private static final Logger log = LoggerFactory.getLogger(OrcamentoService.class);

    private final OrcamentoRepository repository;
    private final GerenciadorDeArquivosService gerenciadorService;
    private final EmailService emailService;
    private final List<OrcamentoObserver> observers = new ArrayList<>();

    public OrcamentoService(OrcamentoRepository repository, GerenciadorDeArquivosService gerenciadorService, EmailService emailService) {
        this.repository = repository;
        this.gerenciadorService = gerenciadorService;
        this.emailService = emailService;
        this.attach(emailService);
    }

    @Override
    public void attach(OrcamentoObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public void detach(OrcamentoObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Orcamento orcamento) {
        for (OrcamentoObserver observer : observers) {
            observer.updateOrcamento(orcamento);
        }
    }



    public Orcamento postOrcamento(DadosCadastroOrcamento dados) {

        List<String> urlImagens = new ArrayList<>();

        if (dados.imagemReferencia() != null && !dados.imagemReferencia().isEmpty()) {
            for (MultipartFile file : dados.imagemReferencia()) {
                String urlImagemSalva = gerenciadorService.salvarArquivo(file);
                urlImagens.add(urlImagemSalva);
            }
        }

        // codigo vindo do front (String). Se ausente, gera fallback
        String codigo = String.valueOf(dados.codigoOrcamento());
        if (codigo == null || codigo.isBlank() || "null".equals(codigo)) {
            var ultimo = repository.findTopByOrderByIdDesc();
            Long novoNum = ultimo.map(o -> o.getLinhaId() + 1).orElse(1L);
            codigo = "ORC-" + novoNum;
        }

        // calcula proximo id numerico (linha)
        var ultimoLinha = repository.findTopByOrderByIdDesc();
        Long proximaLinha = ultimoLinha.map(o -> o.getLinhaId() + 1).orElse(1L);

        Orcamento orcamento = new Orcamento(
                codigo,
                proximaLinha,
                dados.email(),
                dados.ideia(),
                dados.tamanho(),
                dados.cores(),
                dados.localCorpo(),
                urlImagens
        );

        // salva antes de enviar e-mail para não falhar a operação principal
        Orcamento salvo = repository.save(orcamento);

        // tenta enviar e-mail, mas não falha a criação em caso de erro no envio
        try {
            notifyObservers(salvo);
        } catch (Exception e) {
            log.error("Falha ao notificar Observers de novo orçamento {}: {}", salvo.getCodigoOrcamento(), e.getMessage());
        }

        return salvo;

    }

    public List<Orcamento> findAllOrcamentos() {
        return repository.findAll();
    }

}