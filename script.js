const form = document.querySelector("#cadastroForm");

const fields = {
  telefone: document.querySelector("#telefone"),
  email: document.querySelector("#email"),
  cpf: document.querySelector("#cpf"),
  nascimento: document.querySelector("#nascimento")
};
const errors = {
  telefone: document.querySelector("#telefoneErro"),
  email: document.querySelector("#emailErro"),
  cpf: document.querySelector("#cpfErro"),
  nascimento: document.querySelector("#nascimentoErro")
};
const success = document.querySelector("#sucesso");

function setError(name, message) {
  errors[name].textContent = message;
  fields[name].classList.toggle("invalid", Boolean(message));
  fields[name].setAttribute("aria-invalid", message ? "true" : "false");
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
function isValidCPF(value) {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(cpf[10]);
}
function isValidDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const day = Number(match[1]), month = Number(match[2]), year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}
function validate(name) {
  const value = fields[name].value.trim();
  let message = "";
  if (name === "telefone" && !isValidPhone(value)) message = "Insira um número de telefone válido";
  if (name === "email" && !isValidEmail(value)) message = "Insira um e-mail válido";
  if (name === "cpf" && !isValidCPF(value)) message = "Insira um CPF válido";
  if (name === "nascimento" && !isValidDate(value)) message = "Insira uma data válida, que não seja futura";
  setError(name, message);
  return !message;
}

fields.nascimento.addEventListener("input", (event) => {
  let digits = event.target.value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4) digits = digits.replace(/^(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
  else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d+)/, "$1/$2");
  event.target.value = digits;
});

Object.keys(fields).forEach((name) => {
  fields[name].addEventListener("blur", () => validate(name));
  fields[name].addEventListener("input", () => {
    if (errors[name].textContent) validate(name);
    success.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = Object.keys(fields).map(validate).every(Boolean);
  if (!valid) {
    const firstInvalid = Object.keys(fields).find((name) => !validate(name));
    if (firstInvalid) fields[firstInvalid].focus();
    success.textContent = "";
    return;
  }
  if (!document.querySelector("#termos").checked) {
    success.textContent = "Marque a opção de concordância para continuar.";
    success.style.color = "var(--error)";
    document.querySelector("#termos").focus();
    return;
  }
  success.style.color = "var(--success)";
  success.textContent = "Dados conferidos! Formulário preenchido corretamente.";
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    Object.keys(fields).forEach((name) => setError(name, ""));
    success.textContent = "";
  }, 0);
});
