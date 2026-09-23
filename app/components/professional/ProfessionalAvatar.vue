<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  name: string
  initials: string
  size: number
  eager?: boolean
}>(), { eager: false })

const failed = ref(false)
const isLarge = computed(() => props.size >= 80)
const frameClasses = computed(() => isLarge.value
  ? 'rounded-card border-accent-border shadow-[0_0_30px_rgba(212,160,60,0.12)]'
  : 'rounded-xl')
const initialsClasses = computed(() => isLarge.value ? 'text-[28px]' : 'text-sm')
</script>

<template>
  <div
    class="shrink-0 overflow-hidden border border-medium bg-surface"
    :class="frameClasses"
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
    <span
      v-else
      class="flex size-full items-center justify-center font-mono text-accent"
      :class="initialsClasses"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
  </div>
</template>
