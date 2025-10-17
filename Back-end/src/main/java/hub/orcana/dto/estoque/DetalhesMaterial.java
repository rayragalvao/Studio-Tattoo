package hub.orcana.dto.estoque;

public record DetalhesMaterial(
        Long id,
        String nome,
        Double quantidade,
        String unidadeMedida,
        Double minAviso
) {
    public DetalhesMaterial(Long id, String nome, Double quantidade, String unidadeMedida, Double minAviso) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.minAviso = minAviso;
    }
}
