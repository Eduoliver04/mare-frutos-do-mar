// ===== Maré — Receitas de Frutos do Mar =====
// Consome a API pública TheMealDB (https://www.themealdb.com/api.php)

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const campoBusca = document.getElementById("campo-busca");
const formBusca = document.getElementById("form-busca");
const botaoExplorar = document.getElementById("botao-explorar");
const areaStatus = document.getElementById("status");
const areaResultado = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalCorpo = document.getElementById("modal-corpo");
const fecharModalBtn = document.getElementById("fechar-modal");

function mostrarStatus(mensagem, tipo = "") {
  areaStatus.textContent = mensagem;
  areaStatus.className = "status" + (tipo ? " " + tipo : "");
}

function limparStatus() {
  mostrarStatus("");
}

function limparResultado() {
  areaResultado.innerHTML = "";
}

async function buscarPorNome(termo) {
  limparResultado();
  mostrarStatus("Carregando receitas...");

  try {
    const resposta = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(termo)}`);

    if (!resposta.ok) {
      throw new Error("A API não respondeu corretamente.");
    }

    const dados = await resposta.json();

    if (!dados.meals) {
      mostrarStatus(`Nenhuma receita encontrada para "${termo}". Tente outro termo, como "shrimp" ou "salmon".`, "erro");
      return;
    }

    limparStatus();
    renderizarCartoes(dados.meals);
  } catch (erro) {
    mostrarStatus("Ops! Não foi possível falar com a API agora. Verifique sua conexão e tente novamente.", "erro");
    console.error("Erro ao buscar por nome:", erro);
  }
}

async function explorarFrutosDoMar() {
  limparResultado();
  mostrarStatus("Carregando frutos do mar...");

  try {
    const resposta = await fetch(`${BASE_URL}/filter.php?c=Seafood`);

    if (!resposta.ok) {
      throw new Error("A API não respondeu corretamente.");
    }

    const dados = await resposta.json();

    if (!dados.meals) {
      mostrarStatus("Nenhuma receita de frutos do mar foi encontrada no momento.", "erro");
      return;
    }

    limparStatus();
    renderizarCartoes(dados.meals, { resumido: true });
  } catch (erro) {
    mostrarStatus("Ops! A API de receitas parece estar fora do ar. Tente novamente em instantes.", "erro");
    console.error("Erro ao explorar frutos do mar:", erro);
  }
}

function renderizarCartoes(receitas, { resumido = false } = {}) {
  const grade = document.createDocumentFragment();

  receitas.forEach((receita) => {
    const cartao = document.createElement("article");
    cartao.className = "cartao";

    const tags = resumido
      ? `<span class="tag coral">Frutos do mar</span>`
      : `
        <span class="tag">${receita.strCategory ?? "—"}</span>
        <span class="tag coral">${receita.strArea ?? "—"}</span>
      `;

    cartao.innerHTML = `
      <img src="${receita.strMealThumb}" alt="Foto do prato ${receita.strMeal}">
      <div class="cartao-corpo">
        <h3>${receita.strMeal}</h3>
        <div class="tag-linha">${tags}</div>
      </div>
    `;

    grade.appendChild(cartao);
  });

  areaResultado.appendChild(grade);
}

formBusca.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = campoBusca.value.trim();
  if (!termo) {
    mostrarStatus("Digite o nome de uma receita para buscar.", "erro");
    return;
  }
  buscarPorNome(termo);
});

botaoExplorar.addEventListener("click", explorarFrutosDoMar);

explorarFrutosDoMar();
