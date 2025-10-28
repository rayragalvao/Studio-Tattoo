package hub.orcana.service;

import hub.orcana.dto.DadosCadastroMaterial;
import hub.orcana.exception.DependenciaNaoEncontradaException;
import hub.orcana.observer.EstoqueObserver;
import hub.orcana.observer.EstoqueSubject;
import hub.orcana.tables.EquipamentoUso;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EstoqueRepository;
import jakarta.validation.Valid;
import java.util.ArrayList;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class EstoqueService implements EstoqueSubject {
    private final EstoqueRepository repository;
    private final List<EstoqueObserver> observers;

    public EstoqueService(EstoqueRepository repository, EmailService emailService) {
        this.repository = repository;
        this.observers = new ArrayList<>();

        this.attach(emailService);
        System.out.println("EmailService registrado como Observer de Estoque.");
    }

    @Override
    public void attach(EstoqueObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public void detach(EstoqueObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(String materialNome, int quantidadeAtual) {
        for (EstoqueObserver observer : observers) {
            observer.update(materialNome, quantidadeAtual);
        }
    }


    // Lista todos os materiais existentes
    public List<Estoque> getEstoque() {
        var materiais = repository.findAll();
        if (materiais.isEmpty()) {
            throw new DependenciaNaoEncontradaException("Nenhum material cadastrado.");
        }
        return materiais;
    }

    // Busca material pelo nome
    public List<Estoque> getEstoqueByNome(@PathVariable String nomeMaterial) {
        var materiais = repository.findAll()
                .stream()
                .filter(atual -> nomeMaterial.equals(atual.getNome()))
                .toList();

        if (materiais.isEmpty()) {
            throw new DependenciaNaoEncontradaException("Material não encontrado.");
        }
        return materiais;
    }

    // Cadastra um novo material
    public Estoque postEstoque(@RequestBody Estoque estoque) {
        if (estoque.getId() != null) {
            if (repository.existsById(estoque.getId())) {
                throw new IllegalArgumentException("O ID do material já existe.");
            } else {
                estoque.setId(null);
            }
        }
        return repository.save(estoque);
    }

    // Atualiza um material existente pelo ID
    public Estoque putEstoqueById(@PathVariable Long id, @RequestBody Estoque estoque) {
        if (!repository.existsById(id)) {
            throw new DependenciaNaoEncontradaException("Material não encontrado.");
        }
        // Persisti a mudançaS
        estoque.setId(id);
        Estoque estoqueAtualizado = repository.save(estoque);

        // Notifica os Observers
        // Usamos o objeto EstoqueAtualizado, que contém o estado que mudou.
        notifyObservers(estoqueAtualizado.getNome(), estoqueAtualizado.getQuantidade());
        return estoqueAtualizado;
    }

    // Exclui um estoque existente pelo ID
    public void deleteEstoqueById(@PathVariable Long id) {
            if (!repository.existsById(id)) {
                throw new DependenciaNaoEncontradaException("Material não encontrado.");
            }
            repository.deleteById(id);

            if (repository.existsById(id)) {
                throw new IllegalArgumentException("Erro ao excluir material.");
            }
    }
}


