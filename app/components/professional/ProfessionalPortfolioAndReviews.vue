<script setup lang="ts">
import type { ProfessionalProject, ProfessionalReview } from '#types/professional'

defineProps<{ projects: ProfessionalProject[], reviews: ProfessionalReview[] }>()
</script>

<template>
  <div class="flex flex-col gap-5">
    <section aria-labelledby="portfolio">
      <span class="section-label !mb-2.5 !text-xs">[Portfólio]</span>
      <h2
        id="portfolio"
        class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-tight text-primary"
      >
        Projetos recentes
      </h2>
      <ul class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        <li
          v-for="project in projects"
          :key="project.name"
          class="card overflow-hidden"
        >
          <NuxtImg
            :src="project.image"
            :alt="`Captura de tela do projeto ${project.name}`"
            width="480"
            height="320"
            loading="lazy"
            format="webp"
            class="h-42.5 w-full border-b border-subtle object-cover"
          />
          <div class="flex flex-col gap-2.25 p-4.5">
            <h3 class="text-base font-semibold tracking-[-0.02em] text-primary">
              {{ project.name }}
            </h3>
            <p class="text-[13px] leading-[1.6] text-body">
              {{ project.desc }}
            </p>
            <ul class="flex flex-wrap gap-1.5">
              <li
                v-for="tech in project.techs"
                :key="tech"
                class="rounded-full border border-subtle px-2.25 py-1 font-mono text-[10.5px] text-body"
              >
                {{ tech }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <section aria-labelledby="avaliacoes">
      <span class="section-label !mb-2.5 !text-xs">[Avaliações]</span>
      <h2
        id="avaliacoes"
        class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-tight text-primary"
      >
        O que os clientes dizem
      </h2>
      <ul class="flex flex-col gap-3.5">
        <li
          v-for="review in reviews"
          :key="review.author"
          class="flex flex-col gap-3 rounded-card bg-card p-5.5 shadow-card"
        >
          <div class="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="var(--color-accent)"
              aria-hidden="true"
            ><polygon points="12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9" /></svg>
            <strong class="text-sm font-semibold text-primary">{{ review.score }}</strong>
            <span class="ml-auto font-mono text-label text-tertiary">{{ review.date }}</span>
          </div>
          <p class="text-[15px] leading-[1.7] text-primary [text-wrap:pretty]">
            “{{ review.text }}”
          </p>
          <div class="flex items-center gap-2.75 border-t border-subtle pt-3">
            <span
              class="flex size-9 items-center justify-center rounded-button border border-medium bg-surface font-mono text-xs text-body"
              aria-hidden="true"
            >{{ review.initials }}</span>
            <div>
              <p class="text-[13.5px] font-semibold text-primary">
                {{ review.author }}
              </p>
              <p class="mt-0.5 text-xs text-tertiary">
                {{ review.role }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
