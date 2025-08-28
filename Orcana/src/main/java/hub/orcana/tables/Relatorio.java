package hub.orcana.tables;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Relatorio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;

    @OneToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "relatorio", cascade = CascadeType.ALL)
    private List<EquipamentoUso> equipamentosUsados;

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }
}
