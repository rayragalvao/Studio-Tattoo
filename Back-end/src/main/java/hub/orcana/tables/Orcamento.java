package hub.orcana.tables;

import jakarta.persistence.*;

import java.sql.Time;
import java.util.List;

@Entity
public class Orcamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String ideia;
    private Double valor;
    private Double tamanho;
    private String estilo;
    private String cores;
    private Time tempo;
    private String localCorpo;
    private List<String> imagemReferencia;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Orcamento() {}

    public Orcamento(String email, String ideia, Double tamanho, String cores, String localCorpo, List<String> imagemReferencia) {
        this.email = email;
        this.ideia = ideia;
        this.tamanho = tamanho;
        this.cores = cores;
        this.localCorpo = localCorpo;
        this.imagemReferencia = imagemReferencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public String getIdeia() {
        return ideia;
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

    public String getCores() {
        return cores;
    }

    public Time getTempo() {
        return tempo;
    }

    public List<String> getImagemReferencia() { return imagemReferencia;}

}
