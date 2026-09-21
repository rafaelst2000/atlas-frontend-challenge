<script setup lang="ts">
const menuOpen = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <header class="sticky top-0 z-[300] border-b border-subtle bg-base/80 backdrop-blur-xl backdrop-saturate-150">
    <div class="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-3">
      <NuxtLink to="/" class="mr-auto flex items-center gap-2.5" aria-label="DevMatch, página inicial">
        <span class="flex size-[26px] items-center justify-center rounded-lg border border-accent-border bg-accent-subtle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6 3 12l5 6" /><path d="m16 6 5 6-5 6" /></svg>
        </span>
        <span class="text-[17px] font-bold tracking-[-0.02em] text-primary">DevMatch</span>
      </NuxtLink>

      <nav class="mr-2 hidden items-center gap-6 md:flex" aria-label="Principal">
        <NuxtLink to="/" class="text-sm text-body transition-colors hover:text-primary">Profissionais</NuxtLink>
      </nav>

      <NuxtLink to="/#profissionais" class="btn btn-primary btn-sm">Quero contratar</NuxtLink>

      <button
        type="button"
        class="flex size-[38px] items-center justify-center rounded-button border border-medium bg-card md:hidden"
        aria-label="Menu"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></svg>
      </button>
    </div>

    <nav v-if="menuOpen" id="mobile-menu" class="border-t border-subtle px-5 pb-5 pt-2 md:hidden" aria-label="Mobile">
      <NuxtLink to="/" class="block border-b border-subtle py-3 text-[15px] text-primary">Profissionais</NuxtLink>
    </nav>
  </header>
</template>
