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

function mostrarStatus(mensagem) {
  areaStatus.textContent = mensagem;
}

function limparResultado() {
  areaResultado.innerHTML = "";
}

async function buscarPorNome(termo) {
  limparResultado();
  mostrarStatus("Carregando receitas...");

  const resposta = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(termo)}`);
  const dados = await resposta.json();

  if (!dados.meals) {
    mostrarStatus(`Nenhuma receita encontrada para "${termo}".`);
    return;
  }

  mostrarStatus("");
  renderizarCartoes(dados.meals);
}

async function explorarFrutosDoMar() {
  limparResultado();
  mostrarStatus("Carregando frutos do mar...");

  const resposta = await fetch(`${BASE_URL}/filter.php?c=Seafood`);
  const dados = await resposta.json();

  mostrarStatus("");
  renderizarCartoes(dados.meals, { resumido: true });
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
  if (termo) buscarPorNome(termo);
});

botaoExplorar.addEventListener("click", explorarFrutosDoMar);

explorarFrutosDoMar();
