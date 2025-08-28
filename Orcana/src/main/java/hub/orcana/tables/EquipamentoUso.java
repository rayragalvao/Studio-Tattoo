package hub.orcana.tables;

import jakarta.persistence.*;

@Entity
public class EquipamentoUso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipamento_id")
    private Equipamento equipamento;

    private int quantidade;

    @ManyToOne
    @JoinColumn(name = "relatorio_id")
    private Relatorio relatorio;

    public Long getId() {
        return id;
    }

    public Equipamento getEquipamento() {
        return equipamento;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public Relatorio getRelatorio() {
        return relatorio;
    }
}
