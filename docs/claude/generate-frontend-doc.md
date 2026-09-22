# /generate-frontend-doc — documentar um assunto de frontend

## Para que serve

Gera e salva documentação em Markdown sob `docs/frontend/` para **qualquer conhecimento de frontend que não seja específico do Claude**: ferramentas, ambiente, convenções, setup, processo. Escreve o arquivo direto no repositório, sem depender de nenhuma integração externa.

## Quando usar

Quando alguém pede para documentar algo do frontend que não é uma skill/comando do Claude nem faz parte do brief do desafio (`docs/challenge.md`) ou do README de entrega. Se o assunto for sobre o Claude Code em si (uma skill, um comando, uma convenção de workflow), o comando redireciona para `/generate-claude-doc`.

## O que ele faz (passo a passo)

1. **Entender o que documentar** — pergunta se não estiver claro; lê a fonte real (código, config, script) em vez de inventar conteúdo.
2. **Perguntar o destino** — lista o conteúdo atual de `docs/frontend/` (a pasta pode ainda não existir) e pergunta se é um arquivo novo ou atualização de um existente, propondo um nome em kebab-case.
3. **Gerar o Markdown** — em pt-BR, com uma estrutura comum (O que é/para que serve, Pré-requisitos, Como usar, Detalhes/regras, Referência), ajustada ao que fizer sentido.
4. **Revisar e publicar** — mostra o Markdown e o destino resolvido, **espera confirmação** antes de escrever; ao publicar, atualiza `docs/frontend/README.md` (cria se for o primeiro doc) para linkar o novo arquivo.

## Pré-requisitos

Nenhum — não depende de nenhuma integração externa.

## Referência

- `.claude/commands/generate-frontend-doc.md`
- Comando irmão: `/generate-claude-doc` (mesmo padrão, mas para `docs/claude/`)
