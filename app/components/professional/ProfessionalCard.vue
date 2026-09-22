<script setup lang="ts">
import type { Professional } from '#types/professional'
import { formatPrice } from '#shared/professional'

defineProps<{ professional: Professional }>()
</script>

<template>
  <article class="card flex flex-col gap-3.5 p-5">
    <div class="flex items-start gap-3">
      <ProfessionalAvatar
        :src="professional.photo"
        :name="professional.name"
        :initials="professional.initials"
        :size="46"
      />
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold tracking-[-0.02em] text-primary">
          {{ professional.name }}
        </h3>
        <p class="mt-0.75 text-[13px] text-body">
          {{ professional.role }}
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-success/30 bg-success/10 px-2.5 py-1.25 text-label text-[#6dc48b]">
        <span
          class="size-1.25 rounded-full bg-success"
          aria-hidden="true"
        />Disponível
      </span>
    </div>

    <p class="text-[13.5px] leading-[1.6] text-body">
      {{ professional.bio }}
    </p>

    <ul
      class="flex flex-wrap gap-1.5"
      aria-label="Tecnologias"
    >
      <li
        v-for="tech in professional.techs"
        :key="tech"
        class="rounded-full border border-subtle px-2.5 py-1.25 font-mono text-label text-body"
      >
        {{ tech }}
      </li>
    </ul>

    <div class="flex flex-col gap-1.75 text-[12.5px] text-body">
      <div class="flex items-center gap-1.75">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="var(--color-accent)"
          class="shrink-0"
          aria-hidden="true"
        ><polygon points="12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9" /></svg>
        <strong class="font-semibold text-primary">{{ professional.rating.toFixed(1) }}</strong><span class="text-tertiary">·</span><span>{{ professional.reviews }} avaliações</span>
      </div>
      <div class="flex items-center gap-1.75">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-tertiary)"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0"
          aria-hidden="true"
        ><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><circle
          cx="12"
          cy="10"
          r="2.5"
        /></svg>
        <span>{{ professional.location }}</span>
      </div>
      <div class="flex items-center gap-1.75">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-tertiary)"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0"
          aria-hidden="true"
        ><rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
        /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /></svg>
        <span>{{ professional.years }} {{ professional.years === 1 ? 'ano' : 'anos' }} de experiência</span>
      </div>
    </div>

    <div class="h-px bg-subtle" />

    <div class="mt-auto flex items-center justify-between gap-3">
      <div>
        <strong class="text-lg font-bold tracking-[-0.02em] text-primary">{{ formatPrice(professional.price) }}</strong>
        <span class="text-xs text-tertiary">/h</span>
      </div>
      <NuxtLink
        :to="`/professionals/${professional.id}`"
        prefetch-on="interaction"
        class="btn btn-secondary btn-sm"
        :aria-label="`Ver perfil de ${professional.name}`"
      >
        Ver perfil
      </NuxtLink>
    </div>
  </article>
</template>
