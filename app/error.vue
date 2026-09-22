<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.status === 404)

useSeoMeta({
  title: isNotFound.value ? 'Página não encontrada · DevMatch' : 'Erro · DevMatch',
  robots: 'noindex'
})
</script>

<template>
  <NuxtLayout>
    <main class="relative flex min-h-[70vh] items-center overflow-hidden px-5 py-24">
      <div class="hero-orb" aria-hidden="true" />
      <div class="relative mx-auto max-w-140 text-center">
        <div class="mx-auto mb-6 flex size-13 items-center justify-center rounded-xl border border-accent-border bg-accent-subtle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /><path d="m8 8 6 6" /><path d="m14 8-6 6" /></svg>
        </div>

        <span class="section-label !mb-4">{{ isNotFound ? '[Erro 404]' : '[Erro]' }}</span>

        <p class="text-[clamp(64px,14vw,120px)] font-extrabold leading-none tracking-tight text-accent">{{ error.status }}</p>

        <h1 class="mt-4 text-[clamp(28px,5vw,44px)] font-extrabold leading-tight tracking-tight [text-wrap:pretty]">
          <template v-if="isNotFound"><span class="hl-muted">Essa página </span><span class="hl-bright">não existe</span></template>
          <template v-else><span class="hl-muted">Algo deu </span><span class="hl-bright">errado</span></template>
        </h1>

        <p class="mx-auto mt-5 max-w-100 text-[15px] leading-relaxed text-body">
          {{ isNotFound
            ? 'O profissional ou a página que você procura pode ter sido removida, ou o endereço está incorreto.'
            : 'Não conseguimos carregar essa página agora. Tente novamente em instantes.' }}
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button type="button" class="btn btn-primary" @click="clearError({ redirect: '/' })">Voltar para o início</button>
          <button type="button" class="btn btn-secondary" @click="clearError({ redirect: '/#profissionais' })">Ver profissionais</button>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>
