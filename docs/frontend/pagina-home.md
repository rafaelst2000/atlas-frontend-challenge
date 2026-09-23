# Página Home (`/`)

## O que é

Página inicial do catálogo DevMatch: hero, filtros e a listagem paginada dos profissionais. Arquivo: `app/pages/index.vue`.

## Rota e arquivo

- Rota: `/`
- Arquivo: `app/pages/index.vue`
- `routeRules` (`nuxt.config.ts`): `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=300` — cache de borda com revalidação, não `swr`/ISR. A home varia por query string de filtro, e ISR não varia por query string, então `swr` aqui colidiria com os filtros (ver `code-patterns.md`).

## Estrutura / componentes

- `<HomeHero :catalog-total="...">` — headline e input de busca com debounce de 300ms.
- `<ProfessionalFilters>` — os 4 filtros (especialidade, preço, avaliação, experiência) e ordenação; abre `<LazyProfessionalFiltersSheet>` sob demanda no mobile.
- `<HomeResultsGrid>` — grid de `<ProfessionalCard>`, skeletons de carregamento, estado de erro com retry, estado vazio com "Limpar filtros", botão "Carregar mais".

## Fluxo de dados

`useProfessionals()` (`app/composables/useProfessionals.ts`) é a única fonte de dados da página:

- `useFetch('/api/professionals', { query: filters })` — refaz a busca automaticamente sempre que `useProfessionalFilters().filters` muda (a URL é a fonte de verdade dos filtros).
- "Carregar mais" (`loadMore()`) acumula páginas seguintes num `shallowRef` local, sem duplicar a página inicial do `useFetch`.
- Trocar de filtro aborta uma request de "carregar mais" em andamento (`AbortController`) e reseta a paginação, pra uma resposta atrasada de busca antiga não aparecer depois da lista já ter sido zerada.
- `hasError` (falha na carga inicial) e `hasLoadMoreError` (falha no "carregar mais") são estados de UI separados.

## SEO

- `useSeoMeta` com title/description fixos — nenhuma combinação de filtro é indexada como página separada.
- Canonical sempre `/`, independente da query string.
- JSON-LD `WebSite`.

## Referência

- `app/pages/index.vue`
- `app/composables/useProfessionals.ts`, `useProfessionalFilters.ts`
- `app/components/home/Hero.vue`, `ResultsGrid.vue`
- `app/components/professional/ProfessionalFilters.vue`, `ProfessionalFiltersSheet.vue`, `ProfessionalCard.vue`
