package hub.orcana.observer;

public interface EstoqueObserver {
    // Notifica o observador com os dados relevantes
    void updateEstoque(String materialNome, Double quantidadeAtual, Double minAviso);
}