<script setup lang="ts">
import type { ProfessionalDetail } from '#shared/professional'

const props = defineProps<{ p: ProfessionalDetail }>()

const infos = computed(() => [
  { label: 'Disponibilidade', value: '30h por semana · imediata' },
  { label: 'Horário de atendimento', value: 'Seg a sex, 9h–18h (BRT)' },
  { label: 'Tipo de contratação', value: 'PJ · projeto fechado ou hora' },
  { label: 'Experiência', value: `${props.p.years} anos · ${props.p.delivered} projetos entregues` },
  { label: 'Idiomas', value: 'Português (nativo) · Inglês (fluente)' }
])
</script>

<template>
  <aside class="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 md:sticky md:top-21" aria-label="Informações">
    <div class="rounded-card bg-card p-5.5 shadow-card">
      <span class="section-label !mb-4 !text-xs">[Informações]</span>
      <dl class="flex flex-col gap-3.5">
        <div v-for="i in infos" :key="i.label" class="flex flex-col gap-1 border-b border-subtle pb-3.5">
          <dt class="font-mono text-[11.5px] uppercase tracking-[0.02em] text-tertiary">{{ i.label }}</dt>
          <dd class="text-sm font-medium text-primary">{{ i.value }}</dd>
        </div>
      </dl>
      <button type="button" class="btn btn-primary mt-4.5 w-full !bg-surface !py-3.25">Solicitar orçamento</button>
    </div>
    <div class="rounded-card bg-card p-5.5 shadow-card">
      <h3 class="mb-2 text-[15px] font-semibold text-primary">Contratação protegida</h3>
      <p class="text-[13px] leading-relaxed text-body">O pagamento fica retido até a aprovação de cada etapa. Se algo sair do combinado, a DevMatch media a negociação.</p>
    </div>
  </aside>
</template>
