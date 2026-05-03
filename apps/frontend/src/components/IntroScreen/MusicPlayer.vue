<script setup>
import { rootUrl, secondsToMMSS } from "@/assets/main.js";
import { useOverlayDataStore } from "@/socket.js";
import { computed, ref, watch } from "vue";

const state = useOverlayDataStore();

const np = computed(() => {
  if (!state.data.now_playing) {
    return {
      cover: "",
      title: "",
      artist: "",
      time: 0,
      length: 1,
    };
  }
  return state.data.now_playing[state.data.now_playing.mode];
});

const coverUrl = ref("");
const cover = computed(() => np.value.cover);
const title = computed(() => np.value.title);
const artist = computed(() => np.value.artist);
const duration = computed(() => np.value.length / 1000);
const position = computed(() => np.value?.time / 1000);
watch([cover, title], ([newCover]) => {
  coverUrl.value = (newCover?.startsWith("/") ? rootUrl : "") + newCover + "?" + Math.random();
});

const positionFrac = computed(() => (position.value / duration.value) * 100);
const hideDuration = computed(() => positionFrac.value > 90);
const hidePositionBar = computed(() => positionFrac.value < 10);
</script>

<template>
  <div class="master-music-player">
    <div class="line-highlight"></div>
    <div class="contentBg horizontal-box">
      <div class="cover" :style="{ backgroundImage: `url('${coverUrl}')` }"></div>
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="artist">{{ artist }}</div>
      </div>
    </div>
    <div class="progressBar roboto">
      <div ref="baseRef" class="progressBar-base">
        <div class="progressBar-bg"></div>
        <Transition name="show">
          <span v-show="!hideDuration" class="progressBar-duration">
            {{ secondsToMMSS(duration) }}
          </span>
        </Transition>
      </div>
      <div ref="valueRef" class="progressBar-value" :style="{ width: `${positionFrac}%` }">
        <div class="progressBar-line"></div>
        <span class="progressBar-position">{{ secondsToMMSS(position) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-highlight {
  width: 100%;
}

.contentBg {
  padding: 20px;
  align-items: center;
}

.cover {
  width: 100px;
  height: 100px;
  min-width: 100px;
  min-height: 100px;
  background-position: center;
  background-size: cover;
}

.info {
  padding-left: 20px;
}

.title {
  font-size: 24px;
  font-weight: 900;
}

.artist {
  font-size: 16px;
}

.progressBar {
  position: relative;
  width: 100%;
  font-size: 12px;
  line-height: 25px;
  text-align: right;
}

.progressBar-base {
  position: absolute;
  width: 100%;
}

.progressBar-bg {
  width: 100%;
  background-color: var(--color-line-highlight);
  height: 10px;
}

.show-enter-active {
  animation: fadeIn 0.5s;
}

.show-leave-active {
  animation: fadeIn 0.5s reverse;
}

.progressBar-value {
  position: absolute;
}

.progressBar-line {
  background-color: #ffffff;
  height: 10px;
}

.progressBar-line::after {
  content: "";
  opacity: v-bind("hidePositionBar ? 0 : 1");
  position: absolute;
  right: 0;
  top: 0;
  width: 2px;
  height: 40px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.progressBar-position {
  margin-right: 5px;
}
</style>
