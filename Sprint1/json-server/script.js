const API_URL = 'http://localhost:3000/pessoas';

async function entrar() {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const resposta = await fetch(`${API_URL}?email=${email}&senha=${senha}`);
        
        const dados = await resposta.json();

        const usuario = dados[0];

        if (usuario) {
            showToast(`Login efetuado com sucesso, ${usuario.nome}!`);
            // window.location.href = 'dashboard.html';
        } else {
            showToast('E-mail ou senha incorretos.');
        }
    } catch (erro) {
        console.error('Erro ao tentar fazer login:', erro);
        showToast('Ocorreu um erro ao tentar conectar. Por favor, tente novamente.');
    }
}

async function cadastrar() {
    event.preventDefault();

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    
    const novoUsuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        senha: senha,
        tipo: "cliente"
    };

    try {
        const verificaEmail = await fetch(`${API_URL}?email=${email}`);
        const usuariosExistentes = await verificaEmail.json();
        
        if (usuariosExistentes.length > 0) {
            showToastCadastro('Este e-mail já está cadastrado. Por favor, use outro.');
            return;
        }

        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoUsuario)
        });

        if (resposta.status === 201) {
            showToast('Cadastro bem-sucedido!', true);
        } else {
            showToast('Ocorreu um erro no cadastro. Tente novamente.');
        }
    } catch (erro) {
        console.error('Erro ao tentar fazer cadastro:', erro);
        showToast('Ocorreu um erro ao tentar conectar. Por favor, tente novamente.');
    }
}

function showToast(message, redirect = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        if (redirect) {
            window.location.href = 'login.html';
        }
    }, 2500);
}