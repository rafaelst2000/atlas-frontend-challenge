---
description: Document a frontend topic (tools, environment, conventions, setup, process) as a local Markdown file in docs/frontend/. NOT for Claude skills/commands (use /generate-claude-doc for those) and NOT for the challenge brief or delivery README.
---

# /generate-frontend-doc — document a frontend topic in docs/frontend/

Generates and saves Markdown documentation under **`docs/frontend/`**. This is for **anything frontend-related that isn't Claude-specific**: tools, environment, conventions, setup, process.

> Scope:
>
> - **This command** → frontend knowledge in `docs/frontend/`.
> - **`/generate-claude-doc`** → anything about how Claude Code is set up/used in this repo (skills, commands, workflows) in `docs/claude/`.
>
> If what's being documented is a Claude skill or command, stop and point to `/generate-claude-doc` instead.

Content comes from the real source (code, config file, script, etc.) — **don't invent, read it**.

## Step 1 — Understand what to document

1. What are we documenting? If it's not clear, **ask**.
2. **Read the real source** and pull the content from it — don't invent:
   - a tool/script/setup step → the actual file/config/script in the repo;
   - a convention → the code that demonstrates it.

## Step 2 — Ask where it goes (required)

There's no page tree here, just files in `docs/frontend/`:

1. List the current contents of `docs/frontend/` (`ls docs/frontend`; the folder may not exist yet — that's fine, treat it as empty).
2. Ask the dev: is this a **new file**, or an **update to an existing one**? If new, propose a kebab-case filename (e.g. `docs/frontend/vercel-deploy.md`) and confirm it.

## Step 3 — Generate the Markdown

Write in **pt-BR** (matches the rest of this project's user-facing/delivery docs). Structure with whatever sections actually apply — a common shape:

```markdown
# <título>

## O que é / para que serve

## Pré-requisitos <!-- se houver -->

## Como usar / passo a passo

## Detalhes / regras <!-- gotchas, limites -->

## Referência <!-- arquivos/scripts/config no repo -->
```

## Step 4 — Review and publish

1. **Show the user** the generated Markdown and the resolved destination path. **Wait for an OK** before writing — this becomes a file other people (or a future session) will read as-is.
2. Write it (`docs/frontend/<slug>.md`) — for an update to an existing file, replace its content, don't append.
3. If `docs/frontend/README.md` exists (or this is the first doc, in which case create it), make sure it links the new/updated file.
4. Report back: file path and a one-line summary of what it covers.

## Rules

- Content comes from the real source — read, don't invent.
- Never write Claude skill/command docs here — redirect to `/generate-claude-doc`.
- Never touch `docs/challenge.md` (the brief) or `README.md` (the delivery doc) — different purpose, different owner of truth.
- A file that already exists → update it, don't create a near-duplicate with a slightly different name.
