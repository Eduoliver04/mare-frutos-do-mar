// ===== Funções puras e testáveis do Maré =====
// Este arquivo existe separado do script.js para que as funções possam ser
// testadas com Jest (Node) e também usadas direto no navegador (via <script>).
// Padrão "funciona nos dois lados": funções em window/global no navegador,
// e exportadas via module.exports quando rodando em Node (testes).

function validarTermoBusca(termo) {
  return typeof termo === "string" && termo.trim().length > 0;
}

function listarIngredientes(receita) {
  const lista = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receita[`strIngredient${i}`];
    const medida = receita[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim()) {
      lista.push(`${ingrediente}${medida && medida.trim() ? ` — ${medida.trim()}` : ""}`);
    }
  }
  return lista;
}

function formatarRotuloFavorito(nomeItem, nota) {
  const nomeSeguro = (nomeItem || "").trim() || "Receita sem nome";
  const notaSegura = (nota || "").trim();
  return notaSegura ? `${nomeSeguro} — ${notaSegura}` : nomeSeguro;
}

// Exporta para Node (Jest) quando o módulo CommonJS existir;
// no navegador, expõe as mesmas funções em window para o script.js usar.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validarTermoBusca, listarIngredientes, formatarRotuloFavorito };
} else if (typeof window !== "undefined") {
  window.MareUtils = { validarTermoBusca, listarIngredientes, formatarRotuloFavorito };
}
