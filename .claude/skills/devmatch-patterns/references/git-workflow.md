# Git workflow — DevMatch Frontend

This is a single-contributor technical-challenge submission: one branch, no PRs, no protected-branch rules. What matters here isn't branch naming or review process — it's the handful of conventions that aren't the tool's default behavior.

## Commits

- **Conventional Commits** for every commit message (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, ...). This was an explicit, deliberate choice for this project — don't fall back to free-form messages.
- Before committing, both of these must pass: `npx nuxi typecheck` and `npm run build`. For a UI or SEO/performance-relevant change, also run the `/check` command (typecheck + build + a review against the `nuxt-seo-performance` checklist).
- Prefer a new commit over amending, unless explicitly asked to amend — matches the general repo-safety default, not something specific to this project.

## Branch

- `main` is the only branch, tracking `origin` (`rafaelst2000/atlas-frontend-challenge`). There's no feature-branch/PR flow to follow here.

## Push

**Never `git push` without the user's explicit confirmation for that push** — even right after a commit they just asked for. Commit, state what changed, and ask (e.g. "quer que eu envie para origin/main?"); only push after an explicit yes. An earlier confirmation doesn't carry over to a later, separate push.
