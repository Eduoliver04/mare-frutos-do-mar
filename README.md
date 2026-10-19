# Maré — Receitas de Frutos do Mar

> Projeto evoluído ao longo do Bootcamp II: Etapa 01 (frontend + API pública), Etapa 02 (persistência real + Docker) e Etapa 03 (trabalho em grupo com fluxo de PR, revisão e CI).

## Integrantes (Etapa 03)

| Nome | Matrícula | GitHub | Funcionalidade | PR principal |
|---|---|---|---|---|
| Eduardo Gabriel de Oliveira Santos | 22505511 | [@Eduoliver04](https://github.com/Eduoliver04) | Frontend, busca/exibição de receitas, persistência (Supabase), CRUD de favoritos | _pendente_ |
| Leonardo Jiahao Lin Chen | 22510052 | [@leonardojiahao-bit](https://github.com/leonardojiahao-bit) | Testes automatizados, GitHub Actions (CI), Docker Hub | _pendente_ |

_Links de PR preenchidos conforme cada funcionalidade for mesclada na `main`._

## Descrição
Aplicação web que permite buscar receitas por nome ou explorar um catálogo de receitas de frutos do mar de diversas culinárias do mundo, exibindo ingredientes, modo de preparo e origem de cada prato. Permite salvar receitas como favoritas, com uma anotação pessoal, em um banco de dados real.

## API utilizada
- **TheMealDB** — [documentação](https://www.themealdb.com/api.php)
- Endpoints consumidos:
  - `GET /search.php?s={termo}` — busca receitas pelo nome
  - `GET /filter.php?c=Seafood` — lista receitas da categoria "Seafood" (frutos do mar)
  - `GET /lookup.php?i={id}` — detalhes completos de uma receita (ingredientes, modo de preparo, categoria, origem)
- Os textos retornados pela API (em inglês) são traduzidos para português no próprio navegador, usando o endpoint público do Google Tradutor, em lotes.

## Funcionalidades
- Buscar receitas digitando um termo (ex.: "shrimp", "salmon", "fish") e ver os resultados em cartões.
- Explorar automaticamente um catálogo de receitas de frutos do mar com um clique.
- Clicar em qualquer receita para ver detalhes: imagem, categoria, origem, lista de ingredientes com medidas e modo de preparo.
- **Favoritar uma receita com uma anotação pessoal**, listar os favoritos salvos e removê-los — tudo persistido em um banco de dados real (sobrevive ao fechar o navegador).
- Mensagens amigáveis quando a busca não retorna resultados ou quando a API está indisponível.

## Persistência de dados
- **Banco:** Supabase (PostgreSQL).
- **Tabela `favoritos`:**

  | coluna | tipo | descrição |
  |---|---|---|
  | `id` | `int8` (identity) | chave primária |
  | `criado_em` | `timestamptz`, default `now()` | data de criação |
  | `nome_item` | `text` | nome (traduzido) da receita favoritada |
  | `dados_extra` | `jsonb` | `{ "nota": "...", "idMeal": "...", "imagem": "..." }` — anotação pessoal, id da receita na TheMealDB e url da foto |

- **CRUD implementado:** criar (favoritar), listar (seção "Meus favoritos", carregada ao abrir a página) e excluir (botão "×" em cada favorito). Edição (update) também está implementada: favoritar a mesma receita novamente com uma nota diferente atualiza a anotação.
- **Limitação conhecida:** as políticas de RLS da tabela `favoritos` estão abertas para o papel `anon` (leitura, escrita e exclusão livres), conforme sugerido no enunciado. Aceitável para este exercício, mas não para produção.

## Fluxo de colaboração (Etapa 03)
- A branch `main` é protegida: exige Pull Request com pelo menos 1 aprovação de outro integrante antes do merge.
- Padrão de nome de branch: `feature/nome-da-funcionalidade` (ex.: `feature/testes-ci`, `feature/docker-hub`).
- Toda PR tem título claro, descrição (o que foi feito / por que / como testar) e um revisor designado, que comenta antes de aprovar.
- Checks do GitHub Actions (CI) precisam estar verdes para o merge ser permitido.

## Testes automatizados
_Seção preenchida por Leonardo assim que o workflow de CI e os testes forem mesclados na `main`._
- Framework: a definir conforme a stack (Jest, caso a suíte de testes use Node).
- Como rodar localmente: `npm install && npm test` (instruções finais a confirmar na PR de CI).

## Evidências
- **Print da PR bloqueada pelo CI:** _a adicionar após o "teste de fogo" da Fase 3 (PR com teste quebrando de propósito)._
- **Relato de conflito de merge resolvido:** _a adicionar se/quando ocorrer durante o trabalho em paralelo das duas features._

## Empacotamento com Docker
A aplicação é servida por um Nginx dentro de um container Docker.

```
docker run -d -p 8080:80 SEU_USUARIO_DOCKERHUB/mare-frutos-do-mar:latest
```

Depois, abra **http://localhost:8080**.

### Sidequests (Etapa 02)
- **SQ1 — `.dockerignore`:** exclui `.git`, `README.md`, `Dockerfile` e arquivos de log/rascunho da imagem. Isso deixa a imagem menor (menos camadas e bytes copiados) e o build mais rápido, já que o Docker não precisa processar arquivos que a aplicação não usa em tempo de execução.
- **SQ2 — versionamento:** publicadas as tags `1.0`, `1.1` e `latest` no Docker Hub.
- **SQ3 — overview do Docker Hub:** preenchido com descrição, o comando `docker run` e o link do repositório GitHub.
- **SQ4 — dois containers simultâneos:** ver print em `docs/docker-ps.png` (ou seção abaixo) mostrando dois containers da mesma imagem rodando nas portas 8080 e 8081.

  **Se eu tivesse 100 containers, como gerenciaria?** Rodar e atualizar 100 containers manualmente com `docker run`/`docker stop` um por um não escala: não há como distribuir carga entre eles, substituir automaticamente um que caiu, ou atualizar a versão sem downtime. É exatamente esse problema que o **Kubernetes** resolve: ele organiza containers em **Pods** (a menor unidade executável, um ou mais containers que sempre rodam juntos), agrupa Pods idênticos em um **Deployment** com um número desejado de **réplicas**, e distribui esses Pods entre as máquinas de um **cluster** (um conjunto de servidores gerenciados como um só). Se um Pod falha, o Kubernetes cria outro automaticamente para manter o número de réplicas; se a demanda cresce, basta aumentar o número de réplicas (ou configurar autoscaling) e o cluster se reorganiza para acomodar. Ou seja: em vez de eu gerenciar 100 containers um a um, eu descrevo o estado desejado (esta imagem, estas réplicas, estes recursos) e o Kubernetes cuida de manter esse estado — é a ponte entre "rodar um container" e "operar um sistema em produção".

## Como executar localmente
1. Clone: `git clone https://github.com/Eduoliver04/mare-frutos-do-mar.git`
2. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code)

   **Ou, via Docker:**
   ```
   docker build -t mare-frutos-do-mar .
   docker run -d -p 8080:80 mare-frutos-do-mar
   ```
   Depois abra http://localhost:8080.

## Links
- **Aplicação no ar (GitHub Pages):** https://eduoliver04.github.io/mare-frutos-do-mar/
- **Repositório:** https://github.com/Eduoliver04/mare-frutos-do-mar
- **Imagem no Docker Hub:** https://hub.docker.com/r/SEU_USUARIO_DOCKERHUB/mare-frutos-do-mar
