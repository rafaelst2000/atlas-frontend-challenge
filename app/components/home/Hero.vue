<script setup lang="ts">
defineProps<{ catalogTotal: number }>()

const { filters, update } = useProfessionalFilters()

const search = ref(filters.value.q ?? '')
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => update({ q: value.trim() || undefined }), 300)
})
watch(() => filters.value.q, (value) => {
  if ((value ?? '') !== search.value.trim()) search.value = value ?? ''
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section class="relative overflow-hidden px-5 pb-10 pt-14">
    <div
      class="hero-orb"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-205 text-center">
      <p class="hero-badge mb-6 !text-[13px]">
        <UiIcon
          name="check-circle"
          class="text-accent"
        />
        <span>{{ catalogTotal }} profissionais verificados</span>
      </p>
      <h1 class="text-[clamp(32px,7vw,64px)] font-extrabold leading-[1.08] tracking-tight [text-wrap:pretty]">
        <span class="hl-muted">Encontre o profissional de </span><span class="hl-bright">tecnologia ideal</span><span class="hl-muted"> para o seu projeto</span>
      </h1>
      <p class="mx-auto mt-5 max-w-140 text-[clamp(14px,3.4vw,17px)] leading-relaxed text-body">
        Conecte-se com especialistas avaliados em desenvolvimento, design, dados, infraestrutura e muito mais.
      </p>

      <form
        role="search"
        class="mt-7.5 flex flex-wrap gap-2.5 rounded-card bg-card p-2.5 shadow-card"
        @submit.prevent="update({ q: search.trim() || undefined })"
      >
        <label class="flex min-w-0 flex-[1_1_220px] items-center gap-2.5 px-3">
          <UiIcon
            name="search"
            :size="18"
            class="text-tertiary"
          />
          <span class="sr-only">Buscar profissionais</span>
          <input
            v-model="search"
            type="search"
            placeholder="Busque por nome, profissão ou tecnologia..."
            class="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-primary outline-none placeholder:text-tertiary"
            autocomplete="off"
          >
        </label>
        <UiButton
          type="submit"
          size="lg"
          class="ml-auto hidden w-full max-w-45 flex-[1_1_100%] md:inline-flex"
        >
          Buscar
        </UiButton>
      </form>
    </div>
  </section>
</template>
