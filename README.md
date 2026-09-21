# DevMatch: catálogo de profissionais de tecnologia

Solução do desafio técnico front-end da Atlas Technologies (enunciado em [`docs/challenge.md`](docs/challenge.md)): catálogo de profissionais com busca, filtros, ordenação, carregamento sob demanda e página de perfil. Stack: **Nuxt 4, Vue 3, TypeScript e Tailwind CSS v4**.

## Como executar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run preview    # serve o build
npx nuxi typecheck # checagem de tipos
```

Em produção, defina `NUXT_PUBLIC_SITE_URL` (ex.: `https://devmatch.example.com`) para canonical, sitemap e robots.

## O que foi entregue

- **Listagem** com 524 profissionais, busca por nome, profissão ou tecnologia, 6 filtros (especialidade, tecnologia, preço, avaliação, experiência, localização/distância), 5 ordenações e botão "Carregar mais" (12 por página).
- **Perfil** em página dedicada (`/profissionais/:id`) com sobre, tecnologias, serviços, portfólio, avaliações e CTA fixo no mobile.
- Design system "Dark Luxury" ([`DESIGN.md`](DESIGN.md)), mobile first e responsivo.

## Decisões técnicas

**Dados e arquitetura**
- Os dados são gerados de forma determinística no servidor (`server/data`) e expostos por `GET /api/professionals` (filtros, ordenação e paginação no servidor) e `GET /api/professionals/:id`. O cliente nunca recebe o catálogo inteiro.
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
- **CLS:** skeletons com altura reservada, grid estável, sem imagens que carreguem depois (avatares por iniciais, sem fotos de banco de imagens, conforme o design system).
- **INP:** busca com debounce de 300 ms, listas com `shallowRef`, sem watchers desnecessários.
- **Menos JS:** o painel de filtros mobile é carregado sob demanda (`LazyProfessionalFiltersSheet`), e portfólio e avaliações do perfil usam hidratação preguiçosa (`hydrate-on-visible`). Breakpoints são resolvidos só com CSS.
- **Cache:** `routeRules` com `swr` para páginas e API públicas.
- Animações usam apenas `transform`/`opacity` e respeitam `prefers-reduced-motion`.

## Uso de IA

Claude Code (Anthropic) foi usado para apoiar a implementação, a revisão e a documentação. Todas as decisões foram revisadas por mim.

## Melhorias futuras

- Testes automatizados (Vitest para a lógica de filtros, Playwright para os fluxos principais) e lint.
- Persistência real dos favoritos e formulário de orçamento.
- Fotos reais otimizadas com `@nuxt/image` e medição contínua de Web Vitals em produção.
