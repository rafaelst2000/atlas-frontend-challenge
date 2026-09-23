<script setup lang="ts">
import type { IconName } from '~/utils/icons'

withDefaults(defineProps<{
  icon: IconName
  title: string
  description: string
  tone?: 'neutral' | 'error'
}>(), { tone: 'neutral' })
</script>

<template>
  <div class="rounded-card bg-card px-6 py-12 text-center shadow-card">
    <div
      class="mx-auto mb-5 flex size-13 items-center justify-center rounded-xl border"
      :class="tone === 'error' ? 'border-error/40 bg-error/10 text-error' : 'border-medium bg-surface text-accent'"
    >
      <UiIcon
        :name="icon"
        :size="22"
      />
    </div>
    <h3 class="text-xl font-bold tracking-[-0.02em] text-primary">
      {{ title }}
    </h3>
    <p class="mx-auto mt-2.5 max-w-100 text-sm leading-relaxed text-body">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
