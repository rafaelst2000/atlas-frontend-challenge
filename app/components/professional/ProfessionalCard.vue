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
      <ProfessionalAvailabilityBadge>Disponível</ProfessionalAvailabilityBadge>
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
        <UiIcon
          name="star"
          class="text-accent"
        />
        <strong class="font-semibold text-primary">{{ professional.rating.toFixed(1) }}</strong><span class="text-tertiary">·</span><span>{{ professional.reviews }} avaliações</span>
      </div>
      <div class="flex items-center gap-1.75">
        <UiIcon
          name="pin"
          class="text-tertiary"
        />
        <span>{{ professional.location }}</span>
      </div>
      <div class="flex items-center gap-1.75">
        <UiIcon
          name="briefcase"
          class="text-tertiary"
        />
        <span>{{ professional.years }} {{ professional.years === 1 ? 'ano' : 'anos' }} de experiência</span>
      </div>
    </div>

    <div class="h-px bg-subtle" />

    <div class="mt-auto flex items-center justify-between gap-3">
      <div>
        <strong class="text-lg font-bold tracking-[-0.02em] text-primary">{{ formatPrice(professional.price) }}</strong>
        <span class="text-xs text-tertiary">/h</span>
      </div>
      <UiButton
        :to="`/professionals/${professional.id}`"
        variant="secondary"
        size="sm"
        prefetch-on="interaction"
        :aria-label="`Ver perfil de ${professional.name}`"
      >
        Ver perfil
      </UiButton>
    </div>
  </article>
</template>
