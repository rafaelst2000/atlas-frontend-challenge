<template>
  <div class="bg-base px-4 pb-6 pt-6">
    <footer
      class="mx-auto max-w-[1200px] rounded-panel bg-footer px-6 pb-5 pt-8 shadow-panel"
    >
      <div
        class="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]"
      >
        <div>
          <div class="mb-3 flex items-center gap-2.5">
            <span
              class="flex size-6 items-center justify-center rounded-lg border border-accent-border bg-accent-subtle"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M8 6 3 12l5 6" />
                <path d="m16 6 5 6-5 6" />
              </svg>
            </span>
            <span class="text-base font-bold tracking-[-0.02em] text-primary"
              >DevMatch</span
            >
          </div>
          <p class="max-w-[260px] text-[13px] leading-[1.65] text-body">
            O marketplace de profissionais de tecnologia avaliados por quem
            contrata.
          </p>
        </div>
        <nav class="flex flex-col gap-2.5" aria-label="Produto">
          <span class="font-mono text-[11px] tracking-[0.06em] text-accent"
            >[PRODUTO]</span
          >
          <NuxtLink to="/" class="text-[13px] text-body hover:text-primary"
            >Profissionais</NuxtLink
          >
        </nav>
      </div>
      <div
        class="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-subtle pt-[18px]"
      >
        <span class="font-mono text-[11px] text-tertiary"
          >© 2026 DEVMATCH TECNOLOGIA LTDA</span
        >
        <span
          class="inline-flex items-center gap-2 font-mono text-[11px] text-success"
        >
          <span
            class="size-1.5 rounded-full bg-success"
            aria-hidden="true"
          />[ALL SYSTEMS OPERATIONAL]
        </span>
      </div>
    </footer>
  </div>
</template>
