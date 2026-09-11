# Maré — Receitas de Frutos do Mar

## Autor
Eduardo — Matrícula 0000000
<!-- Substitua pela sua matrícula real -->

## Descrição
Aplicação web que permite buscar receitas por nome ou explorar um catálogo de receitas de frutos do mar de diversas culinárias do mundo, exibindo ingredientes, modo de preparo e origem de cada prato.

## API utilizada
- **TheMealDB** — [documentação](https://www.themealdb.com/api.php)
- Endpoints consumidos:
  - `GET /search.php?s={termo}` — busca receitas pelo nome
  - `GET /filter.php?c=Seafood` — lista receitas da categoria "Seafood" (frutos do mar)
  - `GET /lookup.php?i={id}` — detalhes completos de uma receita (ingredientes, modo de preparo, categoria, origem)

## Funcionalidades
- Buscar receitas digitando um termo (ex.: "shrimp", "salmon", "fish") e ver os resultados em cartões.
- Explorar automaticamente um catálogo de receitas de frutos do mar com um clique.
- Clicar em qualquer receita para ver detalhes: imagem, categoria, origem, lista de ingredientes com medidas e modo de preparo.
- Mensagens amigáveis quando a busca não retorna resultados ou quando a API está indisponível.

## Como executar localmente
1. Clone: `git clone https://github.com/Eduoliver04/mare-frutos-do-mar.git`
2. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code)

## Links
- **Aplicação no ar (GitHub Pages):** https://eduoliver04.github.io/mare-frutos-do-mar/
- **Repositório:** https://github.com/Eduoliver04/mare-frutos-do-mar
