<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  size?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
})
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    class="icon"
  />
</template>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
