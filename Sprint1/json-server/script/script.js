const API_URL = 'http://localhost:3000/usuarios';

async function entrar() {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    try {
        const resposta = await fetch(`${API_URL}?email=${email}&senha=${senha}`);
        
        const dados = await resposta.json();

        const usuario = dados[0];

        if (usuario) {
            showToast(`Login efetuado com sucesso, ${usuario.nome}!`, false, 'success');
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

    if (!validadores.nomeCompleto(nome)) {
        showToast('Por favor, insira seu nome completo.', false, 'error');
        return;
    }

    if (!validadores.dataNascimento(dtNasc)) {
        showToast('Você deve ter pelo menos 18 anos para se cadastrar.', false, 'error');
        return;
    }

    if (!validadores.email(email)) {
        showToast('Por favor, insira um e-mail válido.', false, 'error');
        return;
    }

    if (!validadores.senha(senha)) {
        showToast('A senha deve ter no mínimo 8 caracteres, incluindo letras e números.', false, 'error');
        return;
    }

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
            showToast('Cadastro bem-sucedido!', true, 'success');
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
                moverCard();
            }
        }, 400);
    }, 2500);
}

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

cardConviteLogin = false;

function moverCard() {
    const card = document.querySelector('.card-convite');
    const titulo = card.querySelector('h1');
    const paragrafo = card.querySelector('p');
    const botao = card.querySelector('button');

    if (!cardConviteLogin) {
        if (card.classList.contains('left')) {
            card.style.transform = 'translateX(0%)';
        } else {
            card.classList.add('move-left');
        }
        atualizarTituloPagina('login');

        titulo.style.opacity = '0';
        paragrafo.style.opacity = '0';

        setTimeout(() => {
            titulo.textContent = "Ainda não marcou presença no nosso estúdio?";
            paragrafo.textContent = "Cadastre-se e comece a planejar sua próxima tattoo!";
            botao.textContent = "Fazer Cadastro";

            titulo.style.opacity = '1';
            paragrafo.style.opacity = '1';
        }, 250);

        cardConviteLogin = true;
    } else {
        if (card.classList.contains('left')) {
            card.style.transform = 'translateX(100%)';
        } else {
            card.classList.remove('move-left');
        }
        atualizarTituloPagina('cadastro');

        titulo.style.opacity = '0';
        paragrafo.style.opacity = '0';

        setTimeout(() => {
            titulo.textContent = "Já eternizou seu estilo com a gente?";
            paragrafo.textContent = "Entre agora e planeje sua nova tattoo";
            botao.textContent = "Fazer Login";
            titulo.style.opacity = '1';
            paragrafo.style.opacity = '1';
        }, 250);

        cardConviteLogin = false;
    }
}

function getParametroUrl(parametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametro);
}

document.addEventListener('DOMContentLoaded', () => {
    const page = getParametroUrl('page');
    
    if (page === 'login') {
        cardConviteLogin = false;
        atualizarTituloPagina('login');
        carregarLogin();
    } else if (page === 'cadastro') {
        cardConviteLogin = true;
        atualizarTituloPagina('cadastro');
        moverCard();
    }
});

function atualizarTituloPagina(pagina) {
    switch(pagina) {
        case 'login':
            document.title = "Júpiter Fritto | Login";
            break;
        case 'cadastro':
            document.title = "Júpiter Fritto | Cadastro";
            break;
        default:
            document.title = "Júpiter Fritto";
    }
}

function carregarLogin() {
    const card = document.querySelector('.card-convite');
    const titulo = card.querySelector('h1');
    const paragrafo = card.querySelector('p');
    const botao = card.querySelector('button');

    card.classList.add('left');

    titulo.textContent = "Ainda não marcou presença no nosso estúdio?";
    paragrafo.textContent = "Cadastre-se e comece a planejar sua próxima tattoo!";
    botao.textContent = "Fazer Cadastro";

    titulo.style.opacity = '1';
    paragrafo.style.opacity = '1';

    cardConviteLogin = true;
}

// Função para formatar campos em tempo real
// function adicionarFormatacaoEmTempoReal() {
//     // Exemplo: formatar telefone enquanto digita
//     const telefoneInput = document.getElementById('telefone');
//     if (telefoneInput) {
//         telefoneInput.addEventListener('input', function(e) {
//             e.target.value = formatarTel(e.target.value);
//         });
//     }
    
//     // Exemplo: formatar CPF enquanto digita
//     const cpfInput = document.getElementById('cpf');
//     if (cpfInput) {
//         cpfInput.addEventListener('input', function(e) {
//             e.target.value = formatarCpf(e.target.value);
//         });
//     }
// }

