<script setup>
import NumberAnimation from "vue-number-animation";

defineProps({
  value: Number,
});
</script>

<template>
  <number-animation
    :to="value"
    :format="(x) => Math.round(x).toLocaleString()"
    :duration="0.2"
    autoplay
    easing="easeInOutSine"
  />
</template>

<style scoped></style>
