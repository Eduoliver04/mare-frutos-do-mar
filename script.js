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

// TODO: implementar busca por nome, exploracao da categoria "Seafood"
// e exibicao dos resultados na pagina.
