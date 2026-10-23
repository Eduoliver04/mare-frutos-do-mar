const { validarTermoBusca, listarIngredientes, formatarRotuloFavorito } = require("./utils");

test("rejeita termo de busca vazio", () => {
  expect(validarTermoBusca("")).toBe(false);
  expect(validarTermoBusca("   ")).toBe(false);
});

test("aceita termo de busca valido", () => {
  // Teste de fogo: expectativa invertida de proposito para provar que o CI bloqueia o merge
  expect(validarTermoBusca("shrimp")).toBe(false);
});

test("lista apenas ingredientes preenchidos, com medida quando houver", () => {
  const receitaFalsa = {
    strIngredient1: "Camarão",
    strMeasure1: "200g",
    strIngredient2: "",
    strIngredient3: "Alho",
    strMeasure3: "  ",
  };
  expect(listarIngredientes(receitaFalsa)).toEqual(["Camarão — 200g", "Alho"]);
});

test("formata rotulo do favorito com e sem anotacao", () => {
  expect(formatarRotuloFavorito("Moqueca", "pra fazer no domingo")).toBe(
    "Moqueca — pra fazer no domingo"
  );
  expect(formatarRotuloFavorito("Moqueca", "")).toBe("Moqueca");
  expect(formatarRotuloFavorito("", "")).toBe("Receita sem nome");
});
