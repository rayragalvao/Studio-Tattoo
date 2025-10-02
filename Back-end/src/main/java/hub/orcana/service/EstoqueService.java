package hub.orcana.service;

import hub.orcana.dto.DadosCadastroMaterial;
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
        return repository.findAll();
    }

    // Busca material pelo nome
    public List<Estoque> getEstoqueByNome(@PathVariable String nomeMaterial) {
        var material = repository.findAll()
                .stream()
                .filter(atual -> nomeMaterial.equals(atual.getNome()))
                .toList();

        return material;
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
            throw new IllegalArgumentException("Material não encontrado.");
        }
        estoque.setId(id);
        return repository.save(estoque);
    }


    // Exclui um estoque existente pelo ID
    public void deleteEstoqueById(@PathVariable Long id) {
            if (!repository.existsById(id)) {
                throw new IllegalArgumentException("Material não encontrado.");
            }

            repository.deleteById(id);

            if (repository.existsById(id)) {
                throw new IllegalArgumentException("Erro ao excluir material.");
            }
    }
}


