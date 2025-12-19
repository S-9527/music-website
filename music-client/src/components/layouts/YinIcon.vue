<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: String,
  },
})
</script>

<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="icon" />
  </svg>
</template>
