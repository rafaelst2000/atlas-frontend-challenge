<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  to?: RouteLocationRaw
}>(), { variant: 'primary', size: 'md' })

const classes = computed(() => ['btn', `btn-${props.variant}`, props.size !== 'md' && `btn-${props.size}`])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    type="button"
    :class="classes"
  >
    <slot />
  </button>
</template>
