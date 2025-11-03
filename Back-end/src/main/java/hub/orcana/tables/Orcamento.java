package hub.orcana.tables;

import jakarta.persistence.*;
import lombok.ToString;

import java.sql.Time;
import java.util.List;

@ToString
@Entity
public class Orcamento {
    private Long id;
    @Id
    private String codigoOrcamento;
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

    public Orcamento(String codigoOrcamento, String email, String ideia, Double tamanho, String cores, String localCorpo, List<String> imagemReferencia) {
        this.codigoOrcamento = codigoOrcamento;
        this.email = email;
        this.ideia = ideia;
        this.tamanho = tamanho;
        this.cores = cores;
        this.localCorpo = localCorpo;
        this.imagemReferencia = imagemReferencia;
    }

    public Orcamento(String codigoOrcamento, Long id, String email, String ideia, Double tamanho, String cores, String localCorpo, List<String> imagemReferencia) {
        this.codigoOrcamento = codigoOrcamento;
        this.id = id;
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


    public String getCodigoOrcamento() { return codigoOrcamento; }


    public Long getLinhaId() { return id; }

    public void setLinhaId(Long id) { this.id = id; }

    // Compatibilidade: getId() retorna o id numérico como antes
    public Long getId() { return this.id; }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getImagemReferencia() { return imagemReferencia;}

    public String getLocalCorpo() {
        return localCorpo;
    }
}
