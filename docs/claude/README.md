# Claude Code neste repositório

Documentação de todas as skills e comandos configurados para o projeto DevMatch. Gerada com `/generate-claude-doc`; a fonte da verdade continua sendo os próprios arquivos em `.claude/` e o `CLAUDE.md` na raiz — se algo aqui divergir deles, os arquivos reais vencem.

## Skills

Carregam automaticamente quando a tarefa bate com o assunto — não são invocadas por comando.

- [`devmatch-patterns`](devmatch-patterns.md) — regras fundamentais do projeto: estrutura, composables, camada de dados, estilo de código, git workflow, testes.
- [`nuxt-seo-performance`](nuxt-seo-performance.md) — checklist de SEO, performance e Core Web Vitals.
- [`dark-luxury-design`](dark-luxury-design.md) — sistema de design "Dark Luxury" (versão genérica; `DESIGN.md` é a fonte da verdade específica do projeto).

## Comandos

Invocados explicitamente via `/<comando>`.

- [`/check`](check.md) — o portão de verificação padrão (typecheck → testes com cobertura → build → revisão de SEO/performance).
- [`/a11y`](a11y.md) — auditoria e correção de acessibilidade (WCAG 2.2 AA).
- [`/generate-frontend-doc`](generate-frontend-doc.md) — documenta um assunto de frontend em `docs/frontend/`.
- [`/generate-claude-doc`](generate-claude-doc.md) — documenta um ativo do Claude Code em `docs/claude/` (este mesmo comando gerou os documentos desta pasta).
