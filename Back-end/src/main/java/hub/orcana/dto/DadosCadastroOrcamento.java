package hub.orcana.dto;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public record DadosCadastroOrcamento(
        String email,
        String ideia,
        Double tamanho,
        String cores,
        String localCorpo,
        List<MultipartFile> imagemReferencia,
        String codigoOrcamento
) {}
