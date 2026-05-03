<script setup>
import { secondsToMMSS } from "@/assets/main.js";
import { useOverlayDataStore } from "@/socket.js";
import { computed, onMounted, ref } from "vue";

const state = useOverlayDataStore();

const smaller = computed(() => {
  return timeLeftString.value.length > 5;
});

const secondsLeft = ref(0);

const timeLeftString = computed(() => {
  if (secondsLeft.value < 0) {
    return "Starting Soon!";
  }
  return secondsToMMSS(secondsLeft.value);
});

onMounted(() => {
  setInterval(() => {
    secondsLeft.value = (new Date(state.data.schedule) - new Date()) / 1000;
  }, 1000);
});
</script>

<template>
  <div class="master-time-left">
    <div class="data" :style="{ fontSize: smaller ? '56px' : '96px' }">
      {{ timeLeftString }}
    </div>
  </div>
</template>

<style scoped>
.master-time-left {
  width: 400px;
  height: 100%;
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data {
  height: fit-content;
}
</style>
