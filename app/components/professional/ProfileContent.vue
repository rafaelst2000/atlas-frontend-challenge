<script setup lang="ts">
import type { ProfessionalDetail } from '#types/professional'

defineProps<{ professional: ProfessionalDetail }>()
</script>

<template>
  <div class="flex min-w-0 flex-[3_1_420px] flex-col gap-5">
    <section aria-labelledby="sobre">
      <span class="section-label !mb-2.5 !text-xs">[Sobre]</span>
      <h2
        id="sobre"
        class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-tight text-primary"
      >
        Sobre mim
      </h2>
      <div class="flex flex-col gap-3.5 rounded-card bg-card p-6 shadow-card">
        <p
          v-for="(paragraph, index) in professional.about"
          :key="index"
          class="text-[15px] leading-[1.7] text-body [text-wrap:pretty]"
        >
          {{ paragraph }}
        </p>
      </div>
    </section>

    <section aria-labelledby="tecnologias">
      <span class="section-label !mb-2.5 !text-xs">[Especialidades]</span>
      <h2
        id="tecnologias"
        class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-tight text-primary"
      >
        Tecnologias
      </h2>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="tech in professional.techs"
          :key="tech"
          class="rounded-full bg-card px-4 py-2.25 font-mono text-[12.5px] text-primary shadow-[inset_0_1px_0_rgba(255,248,230,0.08),0_2px_12px_rgba(0,0,0,0.35)]"
        >
          {{ tech }}
        </li>
      </ul>
    </section>

    <section aria-labelledby="servicos">
      <span class="section-label !mb-2.5 !text-xs">[Serviços]</span>
      <h2
        id="servicos"
        class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-tight text-primary"
      >
        O que eu entrego
      </h2>
      <ul class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        <li
          v-for="service in professional.services"
          :key="service.title"
          class="card flex flex-col gap-2.5 p-5"
        >
          <span
            class="flex size-10.5 items-center justify-center rounded-button border border-medium bg-surface"
            aria-hidden="true"
          >
            <UiIcon
              name="calendar"
              :size="20"
              class="text-accent"
            />
          </span>
          <h3 class="text-base font-semibold tracking-[-0.02em] text-primary">
            {{ service.title }}
          </h3>
          <p class="text-[13px] leading-[1.6] text-body">
            {{ service.desc }}
          </p>
          <p class="mt-auto pt-2 font-mono text-xs text-accent">
            {{ service.price }}
          </p>
        </li>
      </ul>
    </section>

    <LazyProfessionalPortfolioAndReviews
      hydrate-on-visible
      :projects="professional.projects"
      :reviews="professional.reviewsList"
    />
  </div>
</template>
