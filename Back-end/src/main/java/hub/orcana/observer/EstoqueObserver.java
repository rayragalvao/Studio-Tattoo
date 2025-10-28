package hub.orcana.observer;

// Interface para Observadores de Estoque
public interface EstoqueObserver {
    void update(String materialNome, int quantidadeAtual);
}