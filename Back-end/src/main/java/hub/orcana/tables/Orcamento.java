package hub.orcana.tables;

import jakarta.persistence.*;

import java.sql.Time;
import java.util.List;

@Entity
public class Orcamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private Double valor;
    private Double tamanho;
    private String estilo;
    @ElementCollection
    @CollectionTable(name = "orcamento_cores", joinColumns = @JoinColumn(name = "orcamento_id"))
    @Column(name = "cor")
    private List<String> cores;
    private Time tempo;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public Double getValor() {
        return valor;
    }

    public Double getTamanho() {
        return tamanho;
    }

    public String getEstilo() {
        return estilo;
    }

    public List<String> getCores() {
        return cores;
    }

    public Time getTempo() {
        return tempo;
    }
}
