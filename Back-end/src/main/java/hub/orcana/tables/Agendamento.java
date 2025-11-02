package hub.orcana.tables;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
public class Agendamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @FutureOrPresent @NotNull @Setter
    private LocalDateTime dataHora;
    @Enumerated(EnumType.STRING) @Setter
    private StatusAgendamento status;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name = "orcamento_codigoOrcamento", referencedColumnName = "codigoOrcamento")
    private Orcamento orcamento;

    public Orcamento getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(Orcamento orcamento) {
        this.orcamento = orcamento;
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

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
