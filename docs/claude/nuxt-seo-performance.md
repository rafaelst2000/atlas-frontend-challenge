# nuxt-seo-performance — checklist de SEO e Core Web Vitals

## Para que serve

Skill de carregamento automático usada ao adicionar ou revisar qualquer rota, componente, imagem, fonte, data fetch ou script de terceiro. O desafio técnico avalia explicitamente SEO, performance e Core Web Vitals (LCP, CLS, INP), então essa skill existe para essas decisões não dependerem de lembrança — viram checklist.

## O que ela cobre

- **Dados e renderização**: `useFetch`/`useAsyncData` (nunca fetch em `onMounted` para conteúdo indexável), `key` estável, cache via `routeRules`, paginação no servidor, tipos compartilhados via `shared/`.
- **SEO**: `useSeoMeta` + canonical únicos por página, JSON-LD (`Person`/`ProfilePage`/`AggregateRating`) nas páginas de perfil, um `h1` por página, landmarks semânticos, `<NuxtLink>` real (nunca clique em `<span>`), 404 real via `createError`, sitemap/robots via `@nuxtjs/sitemap`/`@nuxtjs/robots`.
- **Core Web Vitals**: LCP (markup acima da dobra servido no SSR, fontes self-hosted), CLS (skeletons com altura fixa, `width`/`height` explícitos em mídia), INP (busca com debounce, `shallowRef` para listas grandes), hidratação lazy com o prefixo `Lazy` + estratégia (`hydrate-on-visible` etc. — **sem o prefixo `Lazy` a estratégia é ignorada silenciosamente**, e isso já quebrou uma vez em produção), `prefers-reduced-motion`, imagens via `<NuxtImg>` (lazy por padrão, `eager`+`fetchpriority="high"` só na imagem LCP).
- **Acessibilidade** (afeta SEO e UX): botões reais, inputs com label, foco visível, `aria-label` em botões só-ícone, `aria-live` em contagens de resultado.

## ⚠️ O que ela NÃO faz

- Não substitui uma auditoria de acessibilidade completa — para isso, use o comando `/a11y`, que vai bem mais fundo do que a única linha desta skill sobre o assunto.
- Não mede Lighthouse/DevTools por si — números de LCP/CLS/INP só existem olhando o build rodando (`npm run preview`), não lendo o código-fonte.
- Não roda sozinha: a verificação final aponta para o comando `/check`, que é quem de fato executa typecheck, testes e build antes da revisão.

## Como usar

Carrega automaticamente na tarefa certa. Para uma checagem explícita e completa, use o comando `/check`, que roda typecheck → `npm run test:coverage` → `npm run build` → revisão do `git diff` contra este checklist.

## Saída / o que revisar depois

Nenhum artefato — é checklist para revisão de diff. Depois de uma mudança de UI, ainda é necessário rodar `npm run preview` e checar LCP/CLS/INP num navegador real; a skill não faz isso por conta própria.

## Referência

- `.claude/skills/nuxt-seo-performance/SKILL.md`
- Comando relacionado: `/check`
- Skill relacionada: `devmatch-patterns` (estrutura/composables que sustentam essas decisões)
