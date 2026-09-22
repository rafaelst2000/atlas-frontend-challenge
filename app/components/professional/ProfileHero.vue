<script setup lang="ts">
import type { ProfessionalDetail } from '#shared/professional'
import { formatPrice } from '#shared/professional'

const props = defineProps<{ p: ProfessionalDetail }>()

const favorite = ref(false)
const stars = computed(() => Array.from({ length: 5 }, (_, i) => i < Math.round(props.p.rating)))
</script>

<template>
  <section class="relative overflow-hidden rounded-card bg-card p-6 shadow-card">
    <div class="pointer-events-none absolute -bottom-55 left-1/2 h-95 w-190 max-w-[150vw] -translate-x-1/2 rounded-full opacity-90 blur-2xl [background:radial-gradient(ellipse_at_center_bottom,rgba(180,100,15,0.22)_0%,rgba(150,75,10,0.10)_35%,transparent_70%)]" aria-hidden="true" />
    <div class="relative flex flex-wrap items-start gap-5">
      <ProfessionalAvatar :src="p.photo" :name="p.name" :initials="p.initials" :size="96" eager />
      <div class="min-w-0 flex-[1_1_260px]">
        <span class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.75 py-1.25 text-[11.5px] text-[#6dc48b]">
          <span class="size-1.25 rounded-full bg-success" aria-hidden="true" />Disponível para projetos
        </span>
        <h1 class="text-[clamp(28px,6vw,44px)] font-extrabold leading-tight tracking-tight text-primary">{{ p.name }}</h1>
        <p class="mt-2 text-[clamp(14px,3.6vw,17px)] text-body">{{ p.role }}</p>

        <div class="mt-4 flex flex-wrap gap-x-5.5 gap-y-3.5 text-[13.5px] text-body">
          <div class="flex items-center gap-1.75">
            <span class="flex gap-0.5" aria-hidden="true">
              <svg v-for="(on, i) in stars" :key="i" width="14" height="14" viewBox="0 0 24 24" :fill="on ? 'var(--color-accent)' : 'rgba(212,160,60,0.35)'"><polygon points="12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9" /></svg>
            </span>
            <strong class="font-semibold text-primary">{{ p.rating.toFixed(1) }}</strong><span>({{ p.reviews }} avaliações)</span>
          </div>
          <div class="flex items-center gap-1.75">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <span>{{ p.location }}</span>
          </div>
          <div class="flex items-center gap-1.75">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /></svg>
            <span>{{ p.years }} {{ p.years === 1 ? 'ano' : 'anos' }} de experiência</span>
          </div>
        </div>
      </div>

      <div class="flex flex-[1_1_220px] flex-col items-stretch gap-3">
        <div class="flex items-baseline gap-1">
          <strong class="text-[clamp(26px,6vw,34px)] font-extrabold tracking-tight text-primary">{{ formatPrice(p.price) }}</strong>
          <span class="text-sm text-tertiary">/hora</span>
        </div>
        <div class="flex gap-2.5">
          <button type="button" class="btn btn-primary flex-1 !bg-surface !py-3.25">Solicitar orçamento</button>
          <button type="button" class="flex w-11.5 shrink-0 items-center justify-center rounded-button border bg-surface" :class="favorite ? 'border-accent' : 'border-medium'" aria-label="Favoritar" :aria-pressed="favorite" @click="favorite = !favorite">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="var(--color-accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" :fill="favorite ? 'var(--color-accent)' : 'none'" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1C19 15.6 12 20 12 20Z" /></svg>
          </button>
        </div>
        <p class="text-center text-xs text-tertiary">Resposta média em {{ p.responseHours }} {{ p.responseHours === 1 ? 'hora' : 'horas' }} · Sem taxa de contato</p>
      </div>
    </div>
  </section>
</template>
