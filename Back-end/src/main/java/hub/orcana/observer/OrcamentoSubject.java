package hub.orcana.observer;

import hub.orcana.tables.Orcamento;
import java.util.List;

public interface OrcamentoSubject {
    void attach(OrcamentoObserver observer);
    void detach(OrcamentoObserver observer);
    void notifyObservers(Orcamento orcamento);
}