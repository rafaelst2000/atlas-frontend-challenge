<script setup lang="ts">
import type { ProfessionalDetail } from '#types/professional'

const props = defineProps<{ professional: ProfessionalDetail }>()

const infos = computed(() => [
  { label: 'Disponibilidade', value: props.professional.availability },
  { label: 'Horário de atendimento', value: props.professional.workingHours },
  { label: 'Tipo de contratação', value: props.professional.contractType },
  { label: 'Experiência', value: `${props.professional.years} anos · ${props.professional.delivered} projetos entregues` },
  { label: 'Idiomas', value: props.professional.languages },
])
</script>

<template>
  <aside
    class="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 md:sticky md:top-21"
    aria-label="Informações"
  >
    <div class="rounded-card bg-card p-5.5 shadow-card">
      <span class="section-label !mb-4 !text-xs">[Informações]</span>
      <dl class="flex flex-col gap-3.5">
        <div
          v-for="info in infos"
          :key="info.label"
          class="flex flex-col gap-1 border-b border-subtle pb-3.5"
        >
          <dt class="font-mono text-[11.5px] uppercase tracking-[0.02em] text-tertiary">
            {{ info.label }}
          </dt>
          <dd class="text-sm font-medium text-primary">
            {{ info.value }}
          </dd>
        </div>
      </dl>
      <UiButton
        size="lg"
        class="mt-4.5 w-full"
      >
        Solicitar orçamento
      </UiButton>
    </div>
    <div class="rounded-card bg-card p-5.5 shadow-card">
      <h3 class="mb-2 text-[15px] font-semibold text-primary">
        Contratação protegida
      </h3>
      <p class="text-[13px] leading-relaxed text-body">
        O pagamento fica retido até a aprovação de cada etapa. Se algo sair do combinado, a DevMatch media a negociação.
      </p>
    </div>
  </aside>
</template>
