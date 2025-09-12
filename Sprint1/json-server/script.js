const API_URL = 'http://localhost:3000/pessoas';

function togglePasswordVisibility(eye, input){
    const passwordInput = document.getElementById(input);
    const eyeIcon = document.getElementById(eye);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = 'visibility_off';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = 'visibility';
    }
}

function exibirMensagem(status, mensagem) {
    const mensagemDiv = document.getElementById('mensagem');
    
    if (status === 'error') {
        mensagemDiv.appendChild(`
            <div class="mensagem success" id="mensagem-sucesso">
                <span class="material-symbols-outlined icon-sucesso">
                    check_circle
                </span>
                <span class="texto-sucesso" id="texto-sucesso">${mensagem}</span>
            </div>
        `);
    } else if (status === 'success') {
        mensagemDiv.appendChild(`
            <div class="mensagem error" id="mensagem-erro">
                <span class="material-symbols-outlined icon-erro">
                    error
                </span>
                <span class="texto-erro" id="texto-erro">${mensagem}</span>
            </div>
        `);
    }
}

async function entrar() {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const resposta = await fetch(`${API_URL}?email=${email}&senha=${senha}`);
        
        const dados = await resposta.json();

        const usuario = dados[0];

        if (usuario) {
            showToast(`Login efetuado com sucesso, ${usuario.nome}!`, false, 'success');
            // window.location.href = 'dashboard.html';
        } else {
            showToast('E-mail ou senha incorretos.', false, 'error');
        }
    } catch (erro) {
        console.error('Erro ao tentar fazer login:', erro);
        showToast('Ocorreu um erro ao tentar conectar. Por favor, tente novamente.', false, 'error');
    }
}

async function cadastrar() {
    event.preventDefault();

    const nome = document.getElementById('name').value;
    const dtNasc = document.getElementById('dt-nasc').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const confirmSenha = document.getElementById('confirm-password').value;

    if (senha !== confirmSenha) {
        showToast('As senhas não coincidem. Por favor, tente novamente.', false, 'error');
        return;
    }
    
    const novoUsuario = {
        id: Date.now(),
        nome: nome,
        dtNasc: dtNasc,
        email: email,
        senha: senha,
        tipo: "cliente"
    };

    try {
        const verificaEmail = await fetch(`${API_URL}?email=${email}`);
        const usuariosExistentes = await verificaEmail.json();
        
        if (usuariosExistentes.length > 0) {
            showToast('Desculpe, este e-mail já está cadastrado.', false, 'error');
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
            showToast('Cadastro bem-sucedido!', false, 'success');
        } else {
            showToast('Ocorreu um erro no cadastro. Tente novamente.', false, 'error');
        }
    } catch (erro) {
        console.error('Erro ao tentar fazer cadastro:', erro);
        showToast('Ocorreu um erro ao tentar conectar. Por favor, tente novamente.', false, 'error');
    }
}

let mensagemFila = [];
let isShowingMensagem = false;

function getMensagensContainer() {
    let container = document.querySelector('.mensagens');
    if (!container) {
        container = document.createElement('div');
        container.className = 'mensagens';
        document.body.appendChild(container);
    }
    return container;
}

function createMensagemElement(message, status = 'success') {
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem ${status}`;
    
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = status === 'success' ? 'check_circle' : 'error';
    
    const texto = document.createElement('span');
    texto.textContent = message;
    
    mensagem.appendChild(icon);
    mensagem.appendChild(texto);
    
    return mensagem;
}

function showToast(message, redirect = false, status = 'success') {
    mensagemFila.push({ message, redirect, status });
    showNextMensagem();
}

function showNextMensagem() {
    if (mensagemFila.length === 0) {
        isShowingMensagem = false;
        return;
    }

    isShowingMensagem = true;
    const { message, redirect, status } = mensagemFila[0];
    const container = getMensagensContainer();
    const mensagem = createMensagemElement(message, status);

    container.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(mensagem);
            mensagemFila.shift();
            
            if (redirect) {
                window.location.href = 'login.html';
            }
        }, 400);
    }, 2500);
}