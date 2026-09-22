# /generate-claude-doc — documentar um ativo do Claude Code

## Para que serve

Gera e salva documentação em Markdown sob `docs/claude/` para **qualquer coisa que venha do/sobre o Claude Code neste repositório**: uma skill, um comando, o próprio `CLAUDE.md`, uma memória salva, ou uma convenção de workflow combinada em sessão. É o comando irmão do `/generate-frontend-doc`, com o mesmo padrão (ler a fonte real, perguntar destino, mostrar antes de publicar) mas escopado para conhecimento sobre o próprio Claude — inclusive foi usado para gerar os documentos que estão nesta mesma pasta.

## Quando usar

Quando alguém pede para documentar uma skill, um comando, ou uma decisão de workflow do Claude Code neste repo. Se o assunto não for sobre o Claude Code em si, o comando redireciona para `/generate-frontend-doc`.

## O que ele faz (passo a passo)

1. **Entender o que documentar** — pergunta se não estiver claro qual skill/comando/convenção; lê a fonte real por completo antes de escrever qualquer coisa: `.claude/skills/<nome>/SKILL.md` (e `references/*.md`) para uma skill, `.claude/commands/<nome>.md` para um comando, a seção real do `CLAUDE.md` ou arquivo de memória para uma convenção.
2. **Perguntar o destino** — lista o conteúdo atual de `docs/claude/` e pergunta se é arquivo novo ou atualização, propondo um nome em kebab-case que combine com o ativo (ex.: skill `devmatch-patterns` → `docs/claude/devmatch-patterns.md`).
3. **Gerar o Markdown** — em pt-BR, escolhendo o template certo:
   - **Skill**: Para que serve / O que ela gera ou faz / ⚠️ O que ela NÃO faz / Pré-requisitos / Como usar / Fontes opcionais (só se consumir dado externo) / Saída ou o que revisar depois / Referência.
   - **Comando**: Para que serve / Quando usar / O que ele faz (passo a passo) / Pré-requisitos / Referência.
   - **Convenção/seção do CLAUDE.md/outro**: O que é ou para que serve / Como funciona / Detalhes ou regras / Referência.
4. **Revisar e publicar** — mostra o Markdown e o destino resolvido, **espera confirmação** antes de escrever; ao publicar, atualiza `docs/claude/README.md` (cria se for o primeiro doc) para linkar o novo arquivo.

## Pré-requisitos

Nenhum — não depende de nenhuma integração externa.

## Referência

- `.claude/commands/generate-claude-doc.md`
- Comando irmão: `/generate-frontend-doc` (mesmo padrão, mas para `docs/frontend/`)
