package hub.orcana.tables;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Estoque {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nome;
    @NotNull
    private Double quantidade;
    @NotBlank
    private String unidadeMedida;

    private Double minAviso;

    public Estoque() {
    }

    public Estoque(String nome, Double quantidade, String unidadeMedida, Double minAviso) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.minAviso = minAviso;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Double getQuantidade() {
        return quantidade;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public Double getMinAviso() {
        return minAviso;
    }

    public Long setId(Long id) {
        if (this.id == null) {
            this.id = id;
        }
        return this.id;
    }

    public void setQuantidade(Double quantidade) {
        this.quantidade = quantidade;
    }
}
