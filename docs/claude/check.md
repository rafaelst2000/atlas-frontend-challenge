# /check — portão de verificação padrão

## Para que serve

É o gate de verificação padrão do projeto: typecheck, testes com o piso de cobertura, build, e uma revisão do diff contra o checklist de SEO/performance. Não commita nada — só verifica e reporta.

## Quando usar

Antes de qualquer commit que toque código (a skill `devmatch-patterns`, em `git-workflow.md`, recomenda usá-lo em vez de rodar as três checagens manualmente). Também serve como checagem isolada depois de qualquer mudança relevante, mesmo sem intenção imediata de commitar.

## O que ele faz (passo a passo)

1. **Typecheck** — `npx nuxi typecheck`. Precisa estar limpo (o warning de `nuxt-site-config` sobre localhost é ruído esperado, não falha).
2. **Testes** — `npm run test:coverage`. Todos os testes precisam passar **e** todo componente precisa estar em 90% ou mais de cobertura por arquivo — uma falha de threshold é falha real, não aviso.
3. **Build** — `npm run build`. Precisa ter sucesso. O comando instrui a **ler** o output, não só procurar a palavra "error": o Nuxt reporta alguns defeitos reais como warning (ex.: `NUXT_B3006`, um componente com prop `hydrate-on-*` sem o prefixo `Lazy` — a estratégia de hidratação é ignorada silenciosamente).
4. **Revisão** — carrega a skill `nuxt-seo-performance` e revisa o `git diff` contra o checklist dela: meta de SEO e canonical, JSON-LD, hidratação lazy, reserva de espaço para CLS, cache em `routeRules`, nomes acessíveis.
5. **Relatório** — o que passou, o que foi corrigido, e o que ainda precisa de um humano (números de Lighthouse, contraste, qualquer coisa só visível num navegador).

## Pré-requisitos

Nenhum além do projeto já instalado (`npm install`).

## Referência

- `.claude/commands/check.md`
- Skill usada no passo 4: `nuxt-seo-performance`
- Para uma auditoria de acessibilidade mais profunda que o passo 4 cobre, use `/a11y` em vez deste.
