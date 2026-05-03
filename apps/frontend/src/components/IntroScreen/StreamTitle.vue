<script setup>
import { useOverlayDataStore } from "@/socket.js";
import { computed, ref } from "vue";

const state = useOverlayDataStore();

// eslint-disable-next-line no-undef
const intro = ref(_intro);

const title = computed(() => (state.data.stream_title ? state.data.stream_title : ""));
const titleHTML = computed(() => {
  if (!intro.value) {
    return "Stream Ended.<br />Thank You for Watching!";
  }
  return title.value.replace(/(?:\r\n|\r|\n)/g, "<br />");
});
</script>

<template>
  <div class="master-stream-title">
    <div class="title" v-html="titleHTML"></div>
    <svg width="100" height="100">
      <rect y="50" width="50" height="50" fill="white" fill-opacity="0.5" />
      <line x1="25" y1="75" x2="100" y2="0" stroke="white" />
    </svg>
  </div>
</template>

<style scoped>
.master-stream-title {
  position: relative;
}

.title {
  position: absolute;
  left: 128px;
  bottom: 128px;
  width: 1000px;
  white-space: break-spaces;
  font-size: 64px;
  font-weight: bold;
}
</style>
