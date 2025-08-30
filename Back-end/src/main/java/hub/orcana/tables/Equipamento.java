package hub.orcana.tables;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Equipamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nome;
    @NotNull
    private Double quantidade;
    @NotBlank
    private String unidadeMedida;
    private Double minAviso;

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
}
