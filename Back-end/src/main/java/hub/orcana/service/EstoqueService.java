package hub.orcana.service;

import hub.orcana.dto.estoque.DadosCadastroMaterial;
import hub.orcana.dto.estoque.DetalhesMaterial;
import hub.orcana.exception.DependenciaNaoEncontradaException;
import hub.orcana.tables.Estoque;
import hub.orcana.tables.repository.EstoqueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstoqueService {
    private final EstoqueRepository repository;

    public EstoqueService(EstoqueRepository repository) {
        this.repository = repository;
    }

    // Lista todos os materiais existentes
    public List<DetalhesMaterial> getEstoque() {
        List<DetalhesMaterial> materiais = repository.findAll().stream()
                .map(atual -> new DetalhesMaterial(
                        atual.getId(),
                        atual.getNome(),
                        atual.getQuantidade(),
                        atual.getUnidadeMedida(),
                        atual.getMinAviso()
                ))
                .toList();
        return materiais;
    }

    // Busca material pelo nome
    public List<DetalhesMaterial> getEstoqueByNome(String nomeMaterial) {
        var materiais = repository.findAll()
                .stream()
                .filter(atual -> nomeMaterial.equals(atual.getNome()))
                .map(atual -> new DetalhesMaterial(
                        atual.getId(),
                        atual.getNome(),
                        atual.getQuantidade(),
                        atual.getUnidadeMedida(),
                        atual.getMinAviso()
                ))
                .toList();

        if (materiais.isEmpty()) {
            throw new DependenciaNaoEncontradaException("Material");
        }
        return materiais;
    }

    // Cadastra um novo material
    public DetalhesMaterial postEstoque(DadosCadastroMaterial estoque) {
        if (repository.existsByNome(estoque.nome())) {
            throw new IllegalArgumentException("Material já cadastrado.");
        }

        Estoque novoMaterial = new Estoque(
                estoque.nome(),
                estoque.quantidade(),
                estoque.unidadeMedida(),
                estoque.minAviso()
        );
        repository.save(novoMaterial);
        DetalhesMaterial detalhes = new DetalhesMaterial(
                novoMaterial.getId(),
                novoMaterial.getNome(),
                novoMaterial.getQuantidade(),
                novoMaterial.getUnidadeMedida(),
                novoMaterial.getMinAviso()
        );
        return detalhes;
    }

    // Atualiza um material existente pelo ID
    public DetalhesMaterial putEstoqueById(Long id, DadosCadastroMaterial estoque) {
        if (!repository.existsById(id)) {
            throw new DependenciaNaoEncontradaException("Material");
        }

        Estoque existente = repository.findById(id).orElseThrow();
        existente = new Estoque(
                estoque.nome(),
                estoque.quantidade(),
                estoque.unidadeMedida(),
                estoque.minAviso()
        );
        existente.setId(id);
        repository.save(existente);
        DetalhesMaterial detalhes = new DetalhesMaterial(
                existente.getId(),
                existente.getNome(),
                existente.getQuantidade(),
                existente.getUnidadeMedida(),
                existente.getMinAviso()
        );
        return detalhes;
    }

    public DetalhesMaterial atualizarQuantidadeById(Long id, Double qtd) {
        if (!repository.existsById(id)) {
            throw new DependenciaNaoEncontradaException("Material");
        }

        Estoque existente = repository.findById(id).orElseThrow();
        existente.setQuantidade(qtd);
        repository.save(existente);

        DetalhesMaterial detalhes = new DetalhesMaterial(
                existente.getId(),
                existente.getNome(),
                existente.getQuantidade(),
                existente.getUnidadeMedida(),
                existente.getMinAviso()
        );
        return detalhes;
    }

    // Exclui um estoque existente pelo ID
    public void deleteEstoqueById(Long id) {
            if (!repository.existsById(id)) {
                throw new DependenciaNaoEncontradaException("Material");
            }
            repository.deleteById(id);

            if (repository.existsById(id)) {
                throw new IllegalArgumentException("Erro ao excluir material.");
            }
    }
}


