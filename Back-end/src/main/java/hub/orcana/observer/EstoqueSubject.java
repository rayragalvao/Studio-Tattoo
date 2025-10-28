package hub.orcana.observer;

// Interface para o Subject (Publicador) de Estoque
public interface EstoqueSubject {
    void attach(EstoqueObserver observer); // Anexar (Registrar)
    void detach(EstoqueObserver observer); // Desanexar (Remover)
    void notifyObservers(String materialNome, int quantidadeAtual); // Notificar
}