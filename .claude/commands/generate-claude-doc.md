---
description: Document anything about how Claude Code is set up/used in this repo (a skill, a command, CLAUDE.md, a workflow convention) as a local Markdown file in docs/claude/. NOT for general frontend topics (use /generate-frontend-doc for those).
---

# /generate-claude-doc — document a Claude Code asset in docs/claude/

Generates and saves Markdown documentation under **`docs/claude/`**. This is for **anything that comes from/about Claude Code in this repo**: a skill, a command, `CLAUDE.md` itself, a saved memory, or a workflow convention we've settled on for how Claude works here. Split from `/generate-frontend-doc` into its own folder since the scope is "Claude", not "frontend".

> Scope:
>
> - **This command** → Claude-specific knowledge (skills, commands, `CLAUDE.md`, workflow conventions) in `docs/claude/`.
> - **`/generate-frontend-doc`** → general frontend topics (tools, environment, setup, conventions not specific to Claude) in `docs/frontend/`.
>
> If what's being documented isn't actually about Claude Code itself, stop and point to `/generate-frontend-doc` instead.

Content comes from the real source — **don't invent, read it**:

- a skill → `.claude/skills/<name>/SKILL.md` (and its `references/*.md` if any)
- a command → `.claude/commands/<name>.md`
- a workflow convention → the actual `CLAUDE.md` section or memory file that states it
- project-wide guidance → `CLAUDE.md` itself

## Step 1 — Understand what to document

If it's not clear which skill/command/convention is being asked about, **ask**. Then read the real source file(s) in full before writing anything — don't summarize from memory of the conversation.

## Step 2 — Ask where it goes (required)

There's no page tree here, just files in `docs/claude/`:

1. List the current contents of `docs/claude/` (`ls docs/claude`; the folder may not exist yet — treat it as empty).
2. Ask the dev: **new file** or **update an existing one**? If new, propose a kebab-case filename matching the asset (e.g. a skill named `devmatch-patterns` → `docs/claude/devmatch-patterns.md`) and confirm it.

## Step 3 — Generate the Markdown

Write in **pt-BR**. Pick the template that fits what's being documented:

**Skill:**
```markdown
# <nome> — <subtítulo>

## Para que serve

## O que ela gera / faz

## ⚠️ O que ela NÃO faz

## Pré-requisitos

## Como usar

## Fontes opcionais <!-- só se a skill consumir dados externos além do código do repo -->

## Saída / o que revisar depois

## Referência <!-- .claude/skills/<nome>/SKILL.md + skills relacionadas -->
```

**Command:**
```markdown
# /<comando> — <subtítulo>

## Para que serve

## Quando usar

## O que ele faz (passo a passo)

## Pré-requisitos <!-- se houver -->

## Referência <!-- .claude/commands/<comando>.md -->
```

**Convention / CLAUDE.md section / other:**
```markdown
# <título>

## O que é / para que serve

## Como funciona

## Detalhes / regras <!-- gotchas, exceções -->

## Referência <!-- arquivo(s) no repo -->
```

## Step 4 — Review and publish

1. **Show the user** the generated Markdown and the resolved destination path. **Wait for an OK** before writing.
2. Write it (`docs/claude/<slug>.md`) — for an update to an existing file, replace its content, don't append.
3. If `docs/claude/README.md` exists (or this is the first doc, in which case create it), make sure it links the new/updated file.
4. Report back: file path and a one-line summary of what it covers.

## Rules

- Content comes from the real source — read, don't invent.
- Never write general frontend-topic docs here — redirect to `/generate-frontend-doc`.
- A file that already exists → update it, don't create a near-duplicate with a slightly different name.
