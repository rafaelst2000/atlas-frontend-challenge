<template>
  <header class="sticky top-0 z-[300] border-b border-subtle bg-base/80 backdrop-blur-xl backdrop-saturate-150">
    <div class="mx-auto flex max-w-300 items-center gap-4 px-5 py-3">
      <NuxtLink to="/" class="mr-auto flex items-center gap-2.5" aria-label="DevMatch, página inicial">
        <span class="flex size-6.5 items-center justify-center rounded-lg border border-accent-border bg-accent-subtle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6 3 12l5 6" /><path d="m16 6 5 6-5 6" /></svg>
        </span>
        <span class="text-[17px] font-bold tracking-[-0.02em] text-primary">DevMatch</span>
      </NuxtLink>

      <NuxtLink to="/#profissionais" class="btn btn-primary btn-sm">Quero contratar</NuxtLink>
    </div>
  </header>
</template>
