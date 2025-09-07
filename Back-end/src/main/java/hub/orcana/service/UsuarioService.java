package hub.orcana.service;

import hub.orcana.tables.Usuario;
import hub.orcana.tables.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

//    Como o metodo estava antes
//    @PostMapping -> Não deve ter essa anotação, o controller que tem os endppoints
//    public ResponseEntity<?> criar(@RequestBody @Valid Usuario usuario) { -> Aqui tbm não deve ter as anotações @RequestBody e @Valid pq o controller que lida com isso
//        try { -> Removi o try catch pq o metodo não precisa lidar com a resposta HTTP, quem lida com isso é o controller
//            Usuario salvo = repository.save(usuario);
//            return ResponseEntity.status(201).body(Map.of(
//                    "mensagem", "Usuário criado com sucesso!",
//                    "dados", salvo
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of(
//                    "erro", "Erro ao criar usuário.",
//                    "detalhe", e.getMessage()
//            ));
//        }
//    }


//    Método depois, corrigido
//    cria o usuário
    public Usuario criar(Usuario usuario) {
        return repository.save(usuario); // Simplesmente salva e retorna o usuário salvo, se acontecer algum erro ele será enviado para o controller lidar
    }

    // listar todos os usuários existentes
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<Usuario> usuarios = repository.findAll();
            if (usuarios.isEmpty()) {
                return ResponseEntity.status(204).body(Map.of(
                        "mensagem", "Nenhum usuário encontrado."
                ));
            }
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Usuários encontrados com sucesso!",
                    "dados", usuarios
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao listar usuários.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // buscar usuário pelo id
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPeloId(@PathVariable Long id) {
        try {
            Optional<Usuario> usuario = repository.findById(id);
            return usuario.map(value -> ResponseEntity.ok(Map.of(
                            "mensagem", "Usuário encontrado com sucesso!",
                            "dados", value
                    )))
                    .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                            "mensagem", "Usuário não encontrado."
                    )));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao buscar usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }

    // atualizar os dados do usuário pelo id
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarPeloId(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of(
                    "mensagem", "Usuário não encontrado para atualização."
            ));
        }

        try {
            usuario.setId(id);
            Usuario atualizado = repository.save(usuario);
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Usuário atualizado com sucesso!",
                    "dados", atualizado
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao atualizar usuário.",
                    "detalhe", e.getMessage()
         git   ));
        }
    }

    // deleta o usuario pelo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarPeloId(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of(
                    "mensagem", "Usuário não encontrado para exclusão."
            ));
        }
        try {
            repository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Usuário deletado com sucesso!"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "erro", "Erro ao deletar usuário.",
                    "detalhe", e.getMessage()
            ));
        }
    }
}
