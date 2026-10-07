# Maré — Receitas de Frutos do Mar

## Autor
Eduardo — Matrícula 0000000
<!-- Substitua pela sua matrícula real -->

## Descrição
Aplicação web que permite buscar receitas por nome ou explorar um catálogo de receitas de frutos do mar de diversas culinárias do mundo, exibindo ingredientes, modo de preparo e origem de cada prato. Agora também permite salvar receitas como favoritas, com uma anotação pessoal, em um banco de dados real.

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

## Persistência de dados (Etapa 02)
- **Banco:** Supabase (PostgreSQL).
- **Tabela `favoritos`:**

  | coluna | tipo | descrição |
  |---|---|---|
  | `id` | `int8` (identity) | chave primária |
  | `criado_em` | `timestamptz`, default `now()` | data de criação |
  | `nome_item` | `text` | nome (traduzido) da receita favoritada |
  | `dados_extra` | `jsonb` | `{ "nota": "...", "idMeal": "...", "imagem": "..." }` — anotação pessoal, id da receita na TheMealDB e url da foto |

- **CRUD implementado:** criar (favoritar), listar (seção "Meus favoritos", carregada ao abrir a página) e excluir (botão "×" em cada favorito). Edição (update) também está implementada: favoritar a mesma receita novamente com uma nota diferente atualiza a anotação.
- **Limitação conhecida:** nesta etapa as políticas de RLS da tabela `favoritos` estão abertas para o papel `anon` (leitura, escrita e exclusão livres), conforme sugerido no enunciado. Isso significa que qualquer visitante do site pode ver/alterar os favoritos de qualquer outra pessoa — aceitável para este exercício, mas não para produção.

## Empacotamento com Docker
A aplicação é servida por um Nginx dentro de um container Docker.

```
docker run -d -p 8080:80 SEU_USUARIO_DOCKERHUB/mare-frutos-do-mar:latest
```

Depois, abra **http://localhost:8080**.

### Sidequests
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
