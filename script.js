const form = document.getElementById("cadastroForm");

// Função para mostrar ou remover erros
function mostrarErro(campo, mensagem) {
  document.getElementById(campo + "Erro").textContent = mensagem;
  document.getElementById(campo).classList.toggle("invalid", mensagem !== "");
}

// Validar formulário
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const cpf = document.getElementById("cpf").value;
  const nascimento = document.getElementById("nascimento").value;

  let valido = true;

  // Validação do telefone
  const numero = telefone.replace(/\D/g, "");

  if (numero.length !== 10 && numero.length !== 11) {
    mostrarErro("telefone", "Insira um número de telefone válido");
    valido = false;
  } else {
    mostrarErro("telefone", "");
  }

  // Validação do e-mail
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarErro("email", "Insira um e-mail válido");
    valido = false;
  } else {
    mostrarErro("email", "");
  }

  // Validação do CPF
  if (!validarCPF(cpf)) {
    mostrarErro("cpf", "Insira um CPF válido");
    valido = false;
  } else {
    mostrarErro("cpf", "");
  }

  // Validação da data de nascimento
  if (!validarData(nascimento)) {
    mostrarErro("nascimento", "Insira uma data válida, que não seja futura");
    valido = false;
  } else {
    mostrarErro("nascimento", "");
  }

  // Resultado da validação
  if (valido) {
    document.getElementById("sucesso").textContent =
      "Formulário preenchido corretamente!";
  } else {
    document.getElementById("sucesso").textContent = "";
  }
});

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  for (let i = 9; i < 11; i++) {
    let soma = 0;

    for (let j = 0; j < i; j++) {
      soma += Number(cpf[j]) * (i + 1 - j);
    }

    let digito = (soma * 10) % 11;

    if (digito === 10) {
      digito = 0;
    }

    if (digito !== Number(cpf[i])) {
      return false;
    }
  }

  return true;
}

// Função para validar data
function validarData(valor) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    return false;
  }

  const partes = valor.split("/");
  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);

  return data.getDate() === dia &&
         data.getMonth() === mes - 1 &&
         data.getFullYear() === ano &&
         data <= new Date();
}

// Limpar mensagens ao cancelar
form.addEventListener("reset", function () {
  mostrarErro("telefone", "");
  mostrarErro("email", "");
  mostrarErro("cpf", "");
  mostrarErro("nascimento", "");

  document.getElementById("sucesso").textContent = "";
});