<script setup>
import { computed } from "vue";

const props = defineProps({
  value: Boolean,
});

const opacity = computed(() => (props.value ? 1 : 0));
</script>

<template>
  <div class="master-star-component">
    <div class="color" :style="{ opacity: opacity }"></div>
  </div>
</template>

<style scoped>
.master-star-component {
  width: 33px;
  height: 33px;
  background-color: white;
  mask-image: url("@/assets/star.svg");
}

.color {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s;
  background-color: var(--color-star);
}
</style>
