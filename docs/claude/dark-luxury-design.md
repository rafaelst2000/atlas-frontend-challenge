# dark-luxury-design — sistema de design "Dark Luxury"

## Para que serve

Skill de carregamento automático usada ao desenhar ou construir qualquer UI nova no estilo "Dark Luxury" — fundos quase-pretos, acentos metálicos quentes, tipografia editorial, textura de grão, glow ambiente e microanimações. É a skill genérica/portável (descreve como construir um site Dark Luxury do zero, em qualquer stack), **não** um documento escrito especificamente para o DevMatch.

## O que ela cobre

Dez regras fixas (labels `[Label]` em bracket notation, headlines com contraste por cor e não por peso, botões com borda âmbar + glow multi-camada nunca preenchidos, cards sem borda com destaque via inset highlight, cards de feature com painel de ilustração grande, metadados técnicos em monospace, hero com órbita elíptica única, cards de preço com glow âmbar no destaque, footer dentro de painel elevado arredondado, navbar transparente→blur no scroll), mais tokens de cor/tipografia/espaçamento, animações obrigatórias (scroll reveal, countup, marquee) e um checklist de anti-padrões.

## ⚠️ O que ela NÃO faz

No repositório do DevMatch, quatro partes do documento **não se aplicam** e um preâmbulo no topo do arquivo escopa isso:

- **Não** adicionar `<link>`/`@import` do Google Fonts — as fontes são self-hosted via `@nuxt/fonts` (ver skill `nuxt-seo-performance`).
- **Não** usar tokens em `:root`/`var(--…)` inline — os tokens vivem no bloco `@theme` de `app/assets/css/main.css` e viram utilities do Tailwind (`bg-card`, `text-primary`, `rounded-card`, `shadow-glow`).
- Algumas classes do documento (`.display-headline`, `.hl-highlight`, `.card-featured`, `.reveal`, `.marquee` e os tokens `--text-h1/h2/h3`/`--text-display`) **não existem no projeto** — foram removidas como código morto porque nunca chegaram a ser usadas. Só recriar se a seção que precisa delas for realmente construída.
- O Passo 1 (perguntas de clarificação: acento, fundo, fonte) e as notas de stack React do Passo 6 **não se aplicam** — essas decisões já foram tomadas e o projeto é Vue + Tailwind, não React.

Fora esses quatro pontos, o resto do documento (as dez regras, o checklist de anti-padrões, a anatomia de sombra/órbita/botão) vale como está escrito.

## Pré-requisitos

Nenhum — é um documento de referência, não uma ferramenta.

## Como usar

Carrega automaticamente ao construir algo novo no estilo. Para o DevMatch especificamente, `DESIGN.md` (raiz do repo) e o `@theme` de `main.css` são a fonte da verdade — consultar esses dois primeiro, e usar esta skill como referência complementar (não para redecidir tokens/regras que já existem).

## Saída / o que revisar depois

Nenhum artefato próprio — orienta decisões de CSS/markup que o próprio Claude aplica no código.

## Referência

- `.claude/skills/dark-luxury-design/SKILL.md`
- `DESIGN.md` (raiz — fonte da verdade específica do DevMatch)
- `app/assets/css/main.css` (tokens reais em `@theme`)
