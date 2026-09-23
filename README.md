# DevMatch — catálogo de profissionais de tecnologia

[![CI](https://img.shields.io/github/actions/workflow/status/rafaelst2000/atlas-frontend-challenge/ci.yml?branch=main&label=CI&logo=githubactions&logoColor=white)](https://github.com/rafaelst2000/atlas-frontend-challenge/actions)
![Coverage](https://img.shields.io/badge/coverage-100%25-3fb950)
![Node](https://img.shields.io/badge/Node-22.19%2B-339933?logo=nodedotjs&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxtdotjs&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18?logo=vitest&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Postgres-Neon-00E5C0?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Solução do desafio técnico front-end da Atlas Technologies (enunciado em [`docs/challenge.md`](docs/challenge.md)): catálogo de profissionais com busca, filtros, ordenação, carregamento sob demanda e página de perfil.

**Deploy:** https://rafaelst2000-devmatch.vercel.app/

## Stack

Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS v4 · Postgres (Neon) + Drizzle ORM · Vitest · ESLint · Vercel (hospedagem, Speed Insights, Analytics)

## Como executar

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e DATABASE_URL_UNPOOLED (Neon Postgres)
npm run db:push        # cria a tabela
npm run db:seed        # popula os 524 profissionais

npm run dev            # http://localhost:3000
npm run build           # build de produção
npm run preview         # serve o build
npx nuxi typecheck # checagem de tipos

npm run test           # suíte de testes (Vitest)
npm run test:watch     # modo watch
npm run test:coverage  # testes + relatório de cobertura (falha abaixo de 90% por componente)

npm run lint       # ESLint (typescript-eslint + eslint-plugin-vue + regras de formatação)
npm run lint:fix   # aplica as correções automáticas
```

`typecheck`, lint, testes e build são as checagens automatizadas do projeto — rodam em CI ([GitHub Actions](.github/workflows/ci.yml)) a cada push/PR em `main`, além de localmente antes de cada commit. O lint usa o módulo oficial `@nuxt/eslint` com `stylistic: true`: um único config (gerado a partir da própria estrutura do projeto) cobre lint e formatação, sem precisar manter Prettier à parte nem arbitrar entre os dois quando divergem.

Em produção (Vercel), a integração do Neon injeta `DATABASE_URL` automaticamente; a URL do site (canonical, sitemap e robots) vem de `NUXT_PUBLIC_SITE_URL` ou, na falta dela, de `VERCEL_PROJECT_PRODUCTION_URL`, que a Vercel injeta.

## Organização do projeto

```
app/       # Nuxt app-dir: páginas, componentes por domínio, composables, layouts
server/    # Nitro: rotas de API e camada de dados (Drizzle)
shared/    # Constantes/valores isomórficos, usados por servidor e cliente (#shared/*)
types/     # Tipos puros de view-model, sem valor de runtime por trás (#types/*)
test/      # Testes, espelhando a árvore que cada um cobre
scripts/   # Geração determinística do dataset de 524 profissionais + seed
docs/      # Enunciado do desafio e documentação técnica de apoio
```

Componentes ficam agrupados por domínio (`professional/`, `home/`, `layout/`); o acesso à API passa por composables finos (`useProfessionals`, `useProfessionalFilters`, `useProfessionalDetail`) em vez de uma camada de serviço — com só dois endpoints, um composable por recurso já é a abstração inteira necessária.

## O que foi entregue

- **Listagem** com 524 profissionais, busca por nome, profissão ou tecnologia, 4 filtros (especialidade, faixa de preço, avaliação mínima e experiência), 5 ordenações e botão "Carregar mais" (12 por página).
- **Perfil** em página dedicada (`/professionals/:id`) com sobre, tecnologias, serviços, portfólio, avaliações e CTA fixo no mobile.
- Design system "Dark Luxury" ([`DESIGN.md`](DESIGN.md)), mobile first e responsivo.
- **95 testes** (Vitest + `@nuxt/test-utils` + Testing Library) cobrindo todos os componentes a 100%, com piso de cobertura de 90% por arquivo imposto na configuração — mais os testes do construtor de SQL, incluindo o escape de curingas do `LIKE`.

## Decisões técnicas

**Dados e arquitetura**
- Os dados ficam em **Postgres (Neon)**, acessados com **Drizzle ORM** pelo driver HTTP serverless (sem pool de conexões, ideal para a Vercel). O seed (`npm run db:seed`) gera 524 profissionais de forma determinística — **incluindo o conteúdo da página de perfil** (sobre, serviços, projetos, avaliações, disponibilidade, horário, tipo de contratação, idiomas): tudo é gerado uma vez no seed e persistido como coluna real, não sintetizado a cada request nem mockado no componente. A API de detalhe (`GET /api/professionals/:id`) é um `SELECT` direto; a de listagem seleciona só as colunas que o card precisa, sem carregar o conteúdo do perfil à toa.
- A API (`GET /api/professionals` e `GET /api/professionals/:id`) faz busca (`unaccent` + `ILIKE`, ignorando acentos), filtros, ordenação e paginação **no banco**, com índices nas colunas usadas. O cliente nunca recebe o catálogo inteiro.
- Constantes de filtros ficam em `shared/`, tipos puros (`Professional`, `ProfessionalDetail`, ...) em `types/` — ambos usados por servidor e cliente.
- Os filtros vivem na **query string** (`/?spec=QA&sort=rating`): URL compartilhável, botão voltar funcional e uma única fonte de verdade (`useProfessionalFilters`).

**SEO**
- Renderização no servidor (SSR) em todas as páginas; `useSeoMeta` com título e descrição únicos, Open Graph e Twitter Card.
- Canonical por página (a home aponta sempre para `/`, evitando conteúdo duplicado por filtro).
- JSON-LD: `WebSite` na home e `ProfilePage` + `Person` + `AggregateRating` nos perfis.
- `sitemap.xml` com todos os perfis e `robots.txt` via `@nuxtjs/sitemap` e `@nuxtjs/robots`; perfil inexistente devolve **404 real**.
- HTML semântico (um `h1` por página, landmarks, `aria-live` na contagem de resultados, breadcrumb).

**Performance e Core Web Vitals**
- **LCP:** conteúdo principal renderizado no servidor; fontes autohospedadas com `@nuxt/fonts` (sem stylesheet de terceiros bloqueante) e fallbacks com métricas ajustadas.
- **CLS:** skeletons com altura reservada, grid estável e `width`/`height` explícitos em todas as fotos.
- **Imagens:** fotos dos profissionais (coluna `photo` no banco) e capturas de tela dos projetos do portfólio (coluna `projects`, uma imagem por projeto) servidas por `@nuxt/image`: redimensionadas por densidade (`1x`/`2x`), em WebP, com `loading="lazy"` nos cards e `eager` + `fetchpriority="high"` só na foto do perfil (imagem principal da página). Se a foto falhar, o avatar de iniciais aparece como fallback. Na Vercel, o otimizador nativo é usado automaticamente.
- **INP:** busca com debounce de 300 ms, listas com `shallowRef`, sem watchers desnecessários.
- **Menos JS:** o painel de filtros mobile é carregado sob demanda (`LazyProfessionalFiltersSheet`), e portfólio e avaliações do perfil usam hidratação preguiçosa (`hydrate-on-visible`). Breakpoints são resolvidos só com CSS.
- **Cache:** `routeRules` com `swr` para páginas e API públicas.
- Animações usam apenas `transform`/`opacity` e respeitam `prefers-reduced-motion`.

**Acessibilidade**
- Contraste de texto auditado contra WCAG 2.2 AA (mínimo 4.5:1 em texto normal) — os tokens de cor do design system foram ajustados quando necessário para atender ao critério mesmo sobre o fundo quase preto da paleta.
- Landmarks semânticos, um `h1` por página, `aria-live` na contagem de resultados e nomes acessíveis em botões/links interativos.

**Observabilidade**
- **Vercel Speed Insights** mede Core Web Vitals de usuários reais em produção (não só em auditoria local/Lighthouse), e **Vercel Analytics** dá visão de tráfego e das páginas mais acessadas — ambos via o módulo Nuxt oficial (`@vercel/speed-insights/nuxt`, `@vercel/analytics/nuxt`), zero-config, sem cookies e sem impacto de bundle relevante (scripts carregados sob demanda pela própria Vercel). Só coletam dado quando servidos pela Vercel; não rodam em `npm run dev`/`preview` local.

## Uso de IA

Claude Code (Anthropic) foi usado para apoiar a implementação, a revisão e a documentação. Todas as decisões foram revisadas por mim.
