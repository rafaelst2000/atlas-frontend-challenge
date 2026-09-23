# Página de Perfil (`/professionals/:id`)

## O que é

Página de detalhe de um profissional: hero, sobre/tecnologias/serviços/portfólio/avaliações e sidebar de disponibilidade, mais um CTA fixo no mobile. Arquivo: `app/pages/professionals/[id].vue`.

## Rota e arquivo

- Rota: `/professionals/:id`
- `routeRules`: `swr: 3600` (ISR nativo da Vercel) — seguro aqui porque a única variação é o segmento `:id`, nunca query string.
- `/profissionais/**` (URL antiga em português) redireciona 301 pra `/professionals/**`.

## Fluxo de dados

`useProfessionalDetail(id)` (`app/composables/useProfessionalDetail.ts`): `useFetch('/api/professionals/:id')`.

- 404 da API → erro fatal 404 do Nuxt (renderiza `error.vue`).
- Qualquer outra falha (rede, 500) → erro fatal 500 genérico, pra não ser confundido com "não encontrado".
- `await useProfessionalDetail(id)` acontece direto no `<script setup>` (bloqueia o SSR) — o profissional já chega pronto pro template, sem estado de loading nessa página.

## Estrutura / componentes

- Breadcrumb (Profissionais / especialidade / nome), com o link de especialidade voltando pra Home já filtrada.
- `<ProfessionalProfileHero>` — foto, nome, avaliação, localização, anos de experiência, preço.
- `<ProfessionalProfileContent>` — sobre, tecnologias, serviços, e `<LazyProfessionalPortfolioAndReviews hydrate-on-visible>` (portfólio + avaliações, abaixo da dobra).
- `<ProfessionalProfileSidebar>` — disponibilidade, horário, tipo de contratação, idiomas.
- CTA fixo (`fixed`, `md:hidden`) com preço e botão "Solicitar orçamento" (hoje só visual).

## SEO

- `useSeoMeta` com title/description montados a partir dos dados reais do profissional.
- Canonical e Open Graph apontam pra URL do perfil; imagem = foto do profissional.
- JSON-LD `ProfilePage` > `Person` com `AggregateRating`.

## Detalhes / gotchas

`<LazyProfessionalPortfolioAndReviews>` precisa do prefixo `Lazy` pra Nuxt aplicar `hydrate-on-visible` de verdade — sem ele a estratégia é silenciosamente ignorada (aviso de build `NUXT_B3006`).

## Referência

- `app/pages/professionals/[id].vue`
- `app/composables/useProfessionalDetail.ts`
- `app/components/professional/ProfileHero.vue`, `ProfileContent.vue`, `ProfileSidebar.vue`, `ProfessionalPortfolioAndReviews.vue`
