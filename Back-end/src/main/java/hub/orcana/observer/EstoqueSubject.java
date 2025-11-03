package hub.orcana.observer;

import java.util.List;

public interface EstoqueSubject {
    void attach(EstoqueObserver observer); // Anexar (Registrar)
    void detach(EstoqueObserver observer); // Desanexar (Remover)
    void notifyObservers(String materialNome, Double quantidadeAtual, Double minAviso); // Notificar
}