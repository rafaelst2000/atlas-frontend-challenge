# Página de Erro (`error.vue`)

## O que é

Página de erro global do Nuxt (404 e outros erros fatais), com visual "Dark Luxury" em vez da tela de erro padrão. Arquivo: `app/error.vue`.

## Como é acionada

Renderizada automaticamente pelo Nuxt sempre que um `createError({ fatal: true })` é lançado em qualquer página/composable. Hoje isso só acontece em `useProfessionalDetail.ts`: 404 pra id inexistente, 500 genérico pra qualquer outra falha da API de perfil.

## Estrutura

- Recebe `error: NuxtError` via prop; `isNotFound` deriva de `error.status === 404`.
- Título, código e mensagem mudam conforme é 404 ou outro erro.
- Os dois botões usam `clearError({ redirect: ... })`, não navegação direta — isso limpa o estado de erro do Nuxt antes de navegar; sem isso a próxima navegação ainda carregaria como se estivesse em erro.
- Envolvida em `<NuxtLayout>` explicitamente — a página de erro não herda o layout automaticamente como as páginas normais.

## SEO

- `useSeoMeta({ robots: 'noindex' })` — nunca indexada.
- Título muda entre "Página não encontrada" e "Erro" conforme o status.

## Referência

- `app/error.vue`
- `app/composables/useProfessionalDetail.ts` (única fonte de erro fatal do app hoje)
