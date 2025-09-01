function formatarCpf(cpf) {
  const limpar = cpf.replace(/\D/g, '');
  const limite = limpar.slice(0, 11);
  return limite.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCnpj(cnpj) {
  const limpar = cnpj.replace(/\D/g, '');
  const limite = limpar.slice(0, 14);
  return limite.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatarTel(telefone) {
  const limpar = telefone.replace(/\D/g, '');
  const limite = limpar.slice(0, 11);

  if (limite.length === 11) {
    return limite.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (limite.length === 10) {
    return limite.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return limite;
}

function formatarData(data) {
  const limpar = data.replace(/\D/g, '');
  const limite = limpar.slice(0, 8);
  return limite.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
}


function validarCpf(cpf) {
  if (!cpf) return false;

  const limpa = cpf.replace(/\D/g, '');
  if (limpa.length !== 11 || /^(\d)\1+$/.test(limpa)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpa.charAt(i)) * (10 - i);
  }
  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito > 9) primeiroDigito = 0;
  if (primeiroDigito !== parseInt(limpa.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpa.charAt(i)) * (11 - i);
  }
  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito > 9) segundoDigito = 0;
  if (segundoDigito !== parseInt(limpa.charAt(10))) return false;

  return true;
}

function validarCnpj(cnpj) {
  if (!cnpj || cnpj.trim() === '') {
    return false;
  }
  
  const limpa = cnpj.replace(/\D/g, '');
  if (limpa.length !== 14 || /^(\d)\1+$/.test(limpa)) {
    return false;
  }
  
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(limpa[i]) * pesos1[i];
  }
  let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(limpa[i]) * pesos2[i];
  }
  let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  return digito1 === parseInt(limpa[12]) && digito2 === parseInt(limpa[13]);
}


function validarTelefone(telefone) {
  if (!telefone) return false;

  const limpa = telefone.replace(/\D/g, '');
  if (!(limpa.length === 10 || limpa.length === 11)) return false;

  const ddd = parseInt(limpa.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  if (limpa.length === 11 && limpa.charAt(2) !== '9') return false;

  return true;
}



function validarDataNascimento(dataString, idadeMinima = 18) {
  if (!dataString) return false;

  const data = new Date(dataString);
  if (isNaN(data.getTime())) return false;

  const hoje = new Date();
  let idade = hoje.getFullYear() - data.getFullYear();
  const mes = hoje.getMonth() - data.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
    idade--;
  }

  return idade >= idadeMinima;
}

function validarEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarSenha(senha) {
  if (!senha) return false;
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return regex.test(senha);
}

function validarNomeCompleto(nome) {
  if (!nome) return false;
  const partes = nome.trim().split(/\s+/);
  return partes.length >= 2;
}


const validadores = {
  cpf: validarCpf,
  cnpj: validarCnpj,
  telefone: validarTelefone,
  dataNascimento: validarDataNascimento,
  email: validarEmail,
  senha: validarSenha,
  nomeCompleto: validarNomeCompleto,
};