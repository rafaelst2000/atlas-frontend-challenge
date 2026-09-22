# devmatch-patterns — regras fundamentais do frontend

## Para que serve

Skill de carregamento automático (não invocável manualmente — `user-invokable: false`) que reúne as convenções do projeto DevMatch (Nuxt 4 + Vue 3 + TypeScript, Neon Postgres + Drizzle, deploy na Vercel). Carrega **antes** de escrever ou revisar código, criar um commit, ou planejar um teste.

É o índice de quatro referências, cada uma sobre um assunto específico. O objetivo é evitar redecidir a cada sessão coisas que já foram decididas e documentadas.

## O que ela cobre

- **`references/code-patterns.md`** — a estrutura `app/` + `server/` + `shared/` + `test/`, composables em vez de uma camada de serviço, filtros vivendo na URL, a camada de dados (Neon/Drizzle, filtragem em SQL), organização de componentes por pasta de domínio, a armadilha do prefixo `Lazy` na hidratação, e as regras de Tailwind (tokens do `@theme`, classes canônicas em vez de valores arbitrários).
- **`references/code-style.md`** — nomes (proibido `p`, `o`, `s` etc. mesmo em `v-for`), política de comentários (só explicar o "porquê" não óbvio, nunca o "o quê"), formatação manual (aspas simples, sem ponto e vírgula — não há Prettier/ESLint configurado), TypeScript (sem `any` novo), imports (por que `server/data/` usa caminho relativo em vez do alias `#shared`).
- **`references/git-workflow.md`** — Conventional Commits obrigatório, as três checagens que precisam passar antes de commitar (typecheck, `test:coverage`, build), e a regra de nunca dar `git push` sem confirmação explícita para aquele push específico.
- **`references/testing.md`** — a stack (Vitest + `@nuxt/test-utils` + `@testing-library/vue`), o piso de cobertura de 90% por componente (`perFile: true`), onde os testes vivem (`test/`, espelhando a árvore que cobrem), como mockar uma composable sem quebrar a reatividade, o que cobrir em cada camada.

## ⚠️ O que ela NÃO faz

- Não é a fonte da verdade — o `CLAUDE.md` da raiz vence sempre que os dois divergirem.
- Não cobre SEO, performance ou Core Web Vitals (isso é a skill `nuxt-seo-performance`).
- Não cobre regras visuais/design system (isso é a skill `dark-luxury-design`).
- Não é invocável via `/devmatch-patterns` — carrega sozinha quando o contexto da tarefa bate com a descrição dela.

## Como usar

Na prática, não é preciso fazer nada: ela carrega automaticamente sempre que a tarefa envolve escrever/revisar código, commitar ou testar. Para consultar deliberadamente uma referência específica, basta ler o arquivo direto (`.claude/skills/devmatch-patterns/references/<nome>.md`) ou pedir para carregar a skill.

## Saída / o que revisar depois

Não produz nenhum artefato — é só orientação. As referências, porém, precisam ser mantidas em sincronia com o código real: sempre que uma decisão documentada aqui mudar (ex.: um novo endpoint que justifique uma camada de serviço, ou a chegada de ESLint/Prettier), atualize o arquivo correspondente no mesmo commit da mudança.

## Referência

- `.claude/skills/devmatch-patterns/SKILL.md`
- `.claude/skills/devmatch-patterns/references/code-patterns.md`
- `.claude/skills/devmatch-patterns/references/code-style.md`
- `.claude/skills/devmatch-patterns/references/git-workflow.md`
- `.claude/skills/devmatch-patterns/references/testing.md`
- Skills relacionadas: `nuxt-seo-performance`, `dark-luxury-design`
