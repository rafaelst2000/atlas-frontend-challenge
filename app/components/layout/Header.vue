<template>
  <header class="sticky top-0 z-[300] border-b border-subtle bg-base/80 backdrop-blur-xl backdrop-saturate-150">
    <div class="mx-auto flex max-w-300 items-center gap-4 px-5 py-3">
      <NuxtLink
        to="/"
        class="mr-auto flex items-center gap-2.5"
        aria-label="DevMatch, página inicial"
      >
        <span class="flex size-6.5 items-center justify-center rounded-lg border border-accent-border bg-accent-subtle">
          <UiIcon
            name="code"
            class="text-accent"
          />
        </span>
        <span class="text-[17px] font-bold tracking-[-0.02em] text-primary">DevMatch</span>
      </NuxtLink>

      <UiButton
        to="/#profissionais"
        size="sm"
      >
        Quero contratar
      </UiButton>
    </div>
  </header>
</template>
