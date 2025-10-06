package hub.orcana.service;

import hub.orcana.dto.DadosCadastroMaterial;
import hub.orcana.exception.DependenciaNaoEncontradaException;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EstoqueRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class EstoqueService {
    private final EstoqueRepository repository;

    public EstoqueService(EstoqueRepository repository) {
        this.repository = repository;
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
        estoque.setId(id);
        return repository.save(estoque);
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


