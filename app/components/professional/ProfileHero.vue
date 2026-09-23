<script setup lang="ts">
import type { ProfessionalDetail } from '#types/professional'
import { formatPrice } from '#shared/professional'

const props = defineProps<{ professional: ProfessionalDetail }>()

const stars = computed(() => Array.from({ length: 5 }, (_, index) => index < Math.round(props.professional.rating)))
const experienceLabel = computed(() => `${props.professional.years} ${props.professional.years === 1 ? 'ano' : 'anos'} de experiência`)
const responseLabel = computed(() => `${props.professional.responseHours} ${props.professional.responseHours === 1 ? 'hora' : 'horas'}`)
</script>

<template>
  <section class="relative overflow-hidden rounded-card bg-card p-6 shadow-card">
    <div
      class="pointer-events-none absolute -bottom-55 left-1/2 h-95 w-190 max-w-[150vw] -translate-x-1/2 rounded-full opacity-90 blur-2xl [background:radial-gradient(ellipse_at_center_bottom,rgba(180,100,15,0.22)_0%,rgba(150,75,10,0.10)_35%,transparent_70%)]"
      aria-hidden="true"
    />
    <div class="relative flex flex-wrap items-start gap-5">
      <ProfessionalAvatar
        :src="professional.photo"
        :name="professional.name"
        :initials="professional.initials"
        :size="96"
        eager
      />
      <div class="min-w-0 flex-[1_1_260px]">
        <ProfessionalAvailabilityBadge class="mb-3">
          Disponível para projetos
        </ProfessionalAvailabilityBadge>
        <h1 class="text-[clamp(28px,6vw,44px)] font-extrabold leading-tight tracking-tight text-primary">
          {{ professional.name }}
        </h1>
        <p class="mt-2 text-[clamp(14px,3.6vw,17px)] text-body">
          {{ professional.role }}
        </p>

        <div class="mt-4 flex flex-wrap gap-x-5.5 gap-y-3.5 text-[13.5px] text-body">
          <div class="flex items-center gap-1.75">
            <span
              class="flex gap-0.5"
              aria-hidden="true"
            >
              <UiIcon
                v-for="(isFilled, index) in stars"
                :key="index"
                name="star"
                :class="isFilled ? 'text-accent' : 'text-accent/35'"
              />
            </span>
            <strong class="font-semibold text-primary">{{ professional.rating.toFixed(1) }}</strong><span>({{ professional.reviews }} avaliações)</span>
          </div>
          <div class="flex items-center gap-1.75">
            <UiIcon
              name="pin"
              :size="15"
              class="text-tertiary"
            />
            <span>{{ professional.location }}</span>
          </div>
          <div class="flex items-center gap-1.75">
            <UiIcon
              name="briefcase"
              :size="15"
              class="text-tertiary"
            />
            <span>{{ experienceLabel }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-[1_1_220px] flex-col items-stretch gap-3">
        <div class="flex items-baseline gap-1">
          <strong class="text-[clamp(26px,6vw,34px)] font-extrabold tracking-tight text-primary">{{ formatPrice(professional.price) }}</strong>
          <span class="text-sm text-tertiary">/hora</span>
        </div>
        <UiButton size="lg">
          Solicitar orçamento
        </UiButton>
        <p class="text-center text-xs text-tertiary">
          Resposta média em {{ responseLabel }} · Sem taxa de contato
        </p>
      </div>
    </div>
  </section>
</template>
