<script setup lang="ts">
import type { ProfessionalProject, ProfessionalReview } from '#shared/professional'

defineProps<{ projects: ProfessionalProject[], reviews: ProfessionalReview[] }>()
</script>

<template>
  <div class="flex flex-col gap-5">
    <section aria-labelledby="portfolio">
      <span class="section-label !mb-2.5 !text-xs">[Portfólio]</span>
      <h2 id="portfolio" class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-primary">Projetos recentes</h2>
      <ul class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        <li v-for="pr in projects" :key="pr.name" class="card overflow-hidden">
          <div class="flex h-[170px] items-center justify-center border-b border-subtle p-4 [background:repeating-linear-gradient(135deg,#0e0c0a_0px,#0e0c0a_8px,#131110_8px,#131110_16px)]" aria-hidden="true">
            <span class="text-center font-mono text-[10.5px] tracking-[0.06em] text-tertiary">[ SCREENSHOT DO PRODUTO ]</span>
          </div>
          <div class="flex flex-col gap-[9px] p-[18px]">
            <h3 class="text-base font-semibold tracking-[-0.02em] text-primary">{{ pr.name }}</h3>
            <p class="text-[13px] leading-[1.6] text-body">{{ pr.desc }}</p>
            <ul class="flex flex-wrap gap-1.5">
              <li v-for="t in pr.techs" :key="t" class="rounded-full border border-subtle px-[9px] py-1 font-mono text-[10.5px] text-body">{{ t }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <section aria-labelledby="avaliacoes">
      <span class="section-label !mb-2.5 !text-xs">[Avaliações]</span>
      <h2 id="avaliacoes" class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-primary">O que os clientes dizem</h2>
      <ul class="flex flex-col gap-3.5">
        <li v-for="r in reviews" :key="r.author" class="flex flex-col gap-3 rounded-card bg-card p-[22px] shadow-card">
          <div class="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true"><polygon points="12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9" /></svg>
            <strong class="text-sm font-semibold text-primary">{{ r.score }}</strong>
            <span class="ml-auto font-mono text-[11px] text-tertiary">{{ r.date }}</span>
          </div>
          <p class="text-[15px] leading-[1.7] text-primary [text-wrap:pretty]">“{{ r.text }}”</p>
          <div class="flex items-center gap-[11px] border-t border-subtle pt-3">
            <span class="flex size-9 items-center justify-center rounded-button border border-medium bg-surface font-mono text-xs text-body" aria-hidden="true">{{ r.initials }}</span>
            <div>
              <p class="text-[13.5px] font-semibold text-primary">{{ r.author }}</p>
              <p class="mt-0.5 text-xs text-tertiary">{{ r.role }}</p>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
