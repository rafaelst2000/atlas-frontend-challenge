<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  name: string
  initials: string
  size: number
  eager?: boolean
}>(), { eager: false })

// If the photo fails to load, fall back to the initials avatar
const failed = ref(false)
</script>

<template>
  <div
    class="shrink-0 overflow-hidden border border-medium bg-surface"
    :class="size >= 80 ? 'rounded-card border-accent-border shadow-[0_0_30px_rgba(212,160,60,0.12)]' : 'rounded-xl'"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <NuxtImg
      v-if="!failed && src"
      :src="src"
      :alt="`Foto de ${name}`"
      :width="size"
      :height="size"
      densities="x1 x2"
      format="webp"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="size-full object-cover brightness-[0.85] contrast-[1.1]"
      @error="failed = true"
    />
    <span v-else class="flex size-full items-center justify-center font-mono text-accent" :class="size >= 80 ? 'text-[28px]' : 'text-sm'" aria-hidden="true">
      {{ initials }}
    </span>
  </div>
</template>
