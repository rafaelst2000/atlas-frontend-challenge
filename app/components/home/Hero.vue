<script setup lang="ts">
defineProps<{ catalogTotal: number }>()

const { filters, update } = useProfessionalFilters()

// Debounced search: keeps typing (INP) cheap and avoids a request per keystroke
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

const suggestions = ['React', 'Front-end', 'Designer UX', 'DevOps']
</script>

<template>
  <section class="relative overflow-hidden px-5 pb-10 pt-14">
    <div
      class="hero-orb"
      aria-hidden="true"
    />
    <div class="relative mx-auto max-w-205 text-center">
      <p class="hero-badge mb-6 !text-[13px]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent)"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><circle
          cx="12"
          cy="12"
          r="9"
        /><path d="m9 12 2 2 4-4" /></svg>
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
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-tertiary)"
            stroke-width="1.7"
            stroke-linecap="round"
            class="shrink-0"
            aria-hidden="true"
          ><circle
            cx="11"
            cy="11"
            r="7"
          /><path d="m20 20-3.5-3.5" /></svg>
          <span class="sr-only">Buscar profissionais</span>
          <input
            v-model="search"
            type="search"
            placeholder="Busque por nome, profissão ou tecnologia..."
            class="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-primary outline-none placeholder:text-tertiary"
            autocomplete="off"
          >
        </label>
        <button
          type="submit"
          class="btn btn-primary ml-auto hidden w-full max-w-45 flex-[1_1_100%] !bg-surface !py-3.25 md:inline-flex"
        >
          Buscar
        </button>
      </form>

      <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span class="font-mono text-label tracking-[0.04em] text-tertiary">POPULARES //</span>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          class="rounded-full border border-subtle px-3 py-1.5 text-xs text-body transition-colors hover:text-primary"
          @click="search = suggestion; update({ q: suggestion })"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </section>
</template>
