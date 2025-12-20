<script lang="ts" setup>
interface Props {
  styleList?: any[]
  activeName?: string
}

interface Emits {
  (e: 'click', path: string, name: string): void
}

withDefaults(defineProps<Props>(), {
  styleList: () => [],
  activeName: '',
})

const emit = defineEmits<Emits>()

function handleChangeView(item: any) {
  emit('click', item.path, item.name)
}
</script>

<template>
  <ul class="yin-header-nav">
    <li v-for="item in styleList" :key="item.path" :class="{ active: item.name === activeName }" @click="handleChangeView(item)">
      {{ item.name }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

li {
  margin: $header-nav-margin;
  padding: $header-nav-padding;
  line-height: 3.3rem;
  color: $color-grey;
  border-bottom: none;
  cursor: pointer;
}

li.active {
  color: $color-black;
  font-weight: 600;
  border-bottom: 5px solid $color-black;
}
</style>
