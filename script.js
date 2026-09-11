// ===== Maré — Receitas de Frutos do Mar =====
// Consome a API pública TheMealDB (https://www.themealdb.com/api.php)
// Os dados da API vêm em inglês, então traduzimos para português antes de exibir.

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const TRADUCAO_URL = "https://translate.googleapis.com/translate_a/single";
const TAMANHO_LOTE_TRADUCAO = 25;
const MARCADOR_QUEBRA_LINHA = " ZZNEWLINEZZ ";

const campoBusca = document.getElementById("campo-busca");
const formBusca = document.getElementById("form-busca");
const botaoExplorar = document.getElementById("botao-explorar");
const areaStatus = document.getElementById("status");
const areaResultado = document.getElementById("resultado");
const modal = document.getElementById("modal");
const modalCorpo = document.getElementById("modal-corpo");
const fecharModalBtn = document.getElementById("fechar-modal");

// ---------- Utilitários de UI ----------

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

// ---------- Tradução (inglês -> português) ----------
// A TheMealDB só responde em inglês. Traduzimos os textos exibidos usando o
// endpoint público do Google Tradutor, em lotes, para não travar a página.

const cacheTraducao = new Map();

async function traduzirLote(lista) {
  const texto = lista.join("\n");
  const url = `${TRADUCAO_URL}?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(texto)}`;

  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error("Falha ao traduzir");

  const dados = await resposta.json();
  const traduzido = dados[0].map((parte) => parte[0]).join("");
  const partes = traduzido.split("\n");

  if (partes.length !== lista.length) {
    throw new Error("Tradução com formato inesperado");
  }
  return partes;
}

async function traduzirTextos(lista) {
  const resultado = new Array(lista.length);
  const pendentesIndices = [];
  const pendentesTextos = [];

  lista.forEach((texto, indice) => {
    if (!texto) {
      resultado[indice] = texto;
    } else if (cacheTraducao.has(texto)) {
      resultado[indice] = cacheTraducao.get(texto);
    } else {
      pendentesIndices.push(indice);
      pendentesTextos.push(texto);
    }
  });

  const lotes = [];
  for (let i = 0; i < pendentesTextos.length; i += TAMANHO_LOTE_TRADUCAO) {
    lotes.push({
      indices: pendentesIndices.slice(i, i + TAMANHO_LOTE_TRADUCAO),
      textos: pendentesTextos.slice(i, i + TAMANHO_LOTE_TRADUCAO),
    });
  }

  await Promise.all(
    lotes.map(async (lote) => {
      try {
        const traduzidos = await traduzirLote(lote.textos);
        lote.indices.forEach((indice, i) => {
          resultado[indice] = traduzidos[i];
          cacheTraducao.set(lote.textos[i], traduzidos[i]);
        });
      } catch (erro) {
        console.error("Erro ao traduzir lote, mantendo texto original:", erro);
        lote.indices.forEach((indice, i) => {
          resultado[indice] = lote.textos[i];
        });
      }
    })
  );

  return resultado;
}

// ---------- Busca por nome (search.php) ----------
// Retorna objetos completos: strMeal, strCategory, strArea, strMealThumb, strInstructions, ingredientes...

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
    await renderizarCartoes(dados.meals);
  } catch (erro) {
    mostrarStatus("Ops! Não foi possível falar com a API agora. Verifique sua conexão e tente novamente.", "erro");
    console.error("Erro ao buscar por nome:", erro);
  }
}

// ---------- Explorar categoria Seafood (filter.php) ----------
// Retorna apenas idMeal, strMeal e strMealThumb — detalhes completos vêm no clique (lookup.php)

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
    await renderizarCartoes(dados.meals, { resumido: true });
  } catch (erro) {
    mostrarStatus("Ops! A API de receitas parece estar fora do ar. Tente novamente em instantes.", "erro");
    console.error("Erro ao explorar frutos do mar:", erro);
  }
}

// ---------- Renderização da grade de cartões ----------

async function renderizarCartoes(receitas, { resumido = false } = {}) {
  const nomes = await traduzirTextos(receitas.map((r) => r.strMeal));

  let categorias = [];
  let areas = [];
  if (!resumido) {
    [categorias, areas] = await Promise.all([
      traduzirTextos(receitas.map((r) => r.strCategory ?? "")),
      traduzirTextos(receitas.map((r) => r.strArea ?? "")),
    ]);
  }

  const grade = document.createDocumentFragment();

  receitas.forEach((receita, indice) => {
    const nomeTraduzido = nomes[indice] || receita.strMeal;

    const cartao = document.createElement("article");
    cartao.className = "cartao";
    cartao.tabIndex = 0;
    cartao.setAttribute("role", "button");
    cartao.setAttribute("aria-label", `Ver detalhes de ${nomeTraduzido}`);

    const tags = resumido
      ? `<span class="tag coral">Clique para ver detalhes</span>`
      : `
        <span class="tag">${categorias[indice] || "—"}</span>
        <span class="tag coral">${areas[indice] || "—"}</span>
      `;

    cartao.innerHTML = `
      <img src="${receita.strMealThumb}" alt="Foto do prato ${nomeTraduzido}" loading="lazy">
      <div class="cartao-corpo">
        <h3>${nomeTraduzido}</h3>
        <div class="tag-linha">${tags}</div>
      </div>
    `;

    const abrir = () => abrirDetalhes(receita.idMeal);
    cartao.addEventListener("click", abrir);
    cartao.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrir();
      }
    });

    grade.appendChild(cartao);
  });

  areaResultado.appendChild(grade);
}

// ---------- Detalhes de uma receita (lookup.php) ----------

async function abrirDetalhes(idMeal) {
  modalCorpo.innerHTML = "<p>Carregando detalhes...</p>";
  modal.classList.remove("escondido");

  try {
    const resposta = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(idMeal)}`);

    if (!resposta.ok) {
      throw new Error("A API não respondeu corretamente.");
    }

    const dados = await resposta.json();
    const receita = dados.meals ? dados.meals[0] : null;

    if (!receita) {
      modalCorpo.innerHTML = "<p>Não foi possível carregar os detalhes desta receita.</p>";
      return;
    }

    modalCorpo.innerHTML = await montarHtmlDetalhes(receita);
  } catch (erro) {
    modalCorpo.innerHTML = "<p>Ops! Não foi possível carregar os detalhes agora. Tente novamente.</p>";
    console.error("Erro ao carregar detalhes:", erro);
  }
}

async function montarHtmlDetalhes(receita) {
  const ingredientesOriginais = listarIngredientes(receita);
  const instrucoesProtegidas = (receita.strInstructions || "").replace(
    /\r\n|\r|\n/g,
    MARCADOR_QUEBRA_LINHA
  );

  const textosParaTraduzir = [
    receita.strMeal,
    receita.strCategory ?? "",
    receita.strArea ?? "",
    instrucoesProtegidas,
    ...ingredientesOriginais,
  ];

  const traduzidos = await traduzirTextos(textosParaTraduzir);

  const [nomeTraduzido, categoriaTraduzida, areaTraduzida, instrucoesTraduzidas, ...ingredientesTraduzidos] =
    traduzidos;

  const instrucoesFinal = instrucoesTraduzidas
    .split(/\s*ZZNEWLINEZZ\s*/i)
    .join("\n");

  const ingredientesHtml = ingredientesTraduzidos.map((item) => `<li>${item}</li>`).join("");

  const linkVideo = receita.strYoutube
    ? `<p class="detalhe-links"><a href="${receita.strYoutube}" target="_blank" rel="noopener">Ver vídeo no YouTube</a></p>`
    : "";

  return `
    <img class="detalhe-img" src="${receita.strMealThumb}" alt="Foto do prato ${nomeTraduzido}">
    <h2 class="detalhe-titulo">${nomeTraduzido}</h2>
    <div class="tag-linha">
      <span class="tag">${categoriaTraduzida || "—"}</span>
      <span class="tag coral">${areaTraduzida || "—"}</span>
    </div>
    <h3>Ingredientes</h3>
    <ul class="detalhe-ingredientes">${ingredientesHtml}</ul>
    <h3>Modo de preparo</h3>
    <p class="detalhe-instrucoes">${instrucoesFinal}</p>
    ${linkVideo}
  `;
}

function listarIngredientes(receita) {
  const lista = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receita[`strIngredient${i}`];
    const medida = receita[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      lista.push(`${ingrediente}${ medida && medida.trim() ? ` — ${medida.trim()}` : ""}`);
    }
  }
  return lista;
}

// ---------- Eventos ----------

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

fecharModalBtn.addEventListener("click", () => modal.classList.add("escondido"));

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    modal.classList.add("escondido");
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    modal.classList.add("escondido");
  }
});

// Carrega frutos do mar automaticamente ao abrir a página
explorarFrutosDoMar();
