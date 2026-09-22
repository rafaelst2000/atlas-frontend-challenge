# DevMatch: catálogo de profissionais de tecnologia

Solução do desafio técnico front-end da Atlas Technologies (enunciado em [`docs/challenge.md`](docs/challenge.md)): catálogo de profissionais com busca, filtros, ordenação, carregamento sob demanda e página de perfil. Stack: **Nuxt 4, Vue 3, TypeScript e Tailwind CSS v4**.

## Como executar

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e DATABASE_URL_UNPOOLED (Neon Postgres)
npm run db:push        # cria a tabela
npm run db:seed        # popula os 524 profissionais
npm run dev            # http://localhost:3000
npm run build      # build de produção
npm run preview    # serve o build
npx nuxi typecheck # checagem de tipos

npm run test           # suíte de testes (Vitest)
npm run test:watch     # modo watch
npm run test:coverage  # testes + relatório de cobertura (falha abaixo de 90% por componente)
```

Não há lint configurado: `typecheck`, testes e build são as checagens automatizadas do projeto.

Em produção (Vercel), a integração do Neon injeta `DATABASE_URL` automaticamente; a URL do site (canonical, sitemap e robots) vem de `NUXT_PUBLIC_SITE_URL` ou, na falta dela, de `VERCEL_PROJECT_PRODUCTION_URL`, que a Vercel injeta.

## O que foi entregue

- **Listagem** com 524 profissionais, busca por nome, profissão ou tecnologia, 4 filtros (especialidade, faixa de preço, avaliação mínima e experiência), 5 ordenações e botão "Carregar mais" (12 por página).
- **Perfil** em página dedicada (`/professionals/:id`) com sobre, tecnologias, serviços, portfólio, avaliações e CTA fixo no mobile.
- Design system "Dark Luxury" ([`DESIGN.md`](DESIGN.md)), mobile first e responsivo.
- **93 testes** (Vitest + `@nuxt/test-utils` + Testing Library) cobrindo todos os componentes a 100%, com piso de cobertura de 90% por arquivo imposto na configuração — mais os testes do construtor de SQL, incluindo o escape de curingas do `LIKE`.

## Decisões técnicas

**Dados e arquitetura**
- Os dados ficam em **Postgres (Neon)**, acessados com **Drizzle ORM** pelo driver HTTP serverless (sem pool de conexões, ideal para a Vercel). O seed (`npm run db:seed`) gera 524 profissionais de forma determinística — **incluindo o conteúdo da página de perfil** (sobre, serviços, projetos, avaliações, disponibilidade, horário, tipo de contratação, idiomas): tudo é gerado uma vez no seed e persistido como coluna real, não sintetizado a cada request nem mockado no componente. A API de detalhe (`GET /api/professionals/:id`) é um `SELECT` direto; a de listagem seleciona só as colunas que o card precisa, sem carregar o conteúdo do perfil à toa.
- A API (`GET /api/professionals` e `GET /api/professionals/:id`) faz busca (`unaccent` + `ILIKE`, ignorando acentos), filtros, ordenação e paginação **no banco**, com índices nas colunas usadas. O cliente nunca recebe o catálogo inteiro.
- Tipos e constantes de filtros ficam em `shared/` e são usados por servidor e cliente.
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

## Uso de IA

Claude Code (Anthropic) foi usado para apoiar a implementação, a revisão e a documentação. Todas as decisões foram revisadas por mim.

## Melhorias futuras

- Testes end-to-end (Playwright) para os fluxos principais, e lint/format (ESLint + Prettier) — hoje a consistência de estilo é manual.
- Formulário de orçamento real (hoje o botão "Solicitar orçamento" é apenas visual).
- Upload de fotos reais (Vercel Blob) no lugar dos retratos de exemplo e medição contínua de Web Vitals em produção.
