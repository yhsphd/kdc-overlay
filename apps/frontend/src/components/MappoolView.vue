<script setup>
import { useOverlayDataStore } from "@/socket.js";
import { computed } from "vue";
import { splitCode } from "@/assets/main.js";

const state = useOverlayDataStore();

const mappool = computed(() => state.data?.mappool);
const mapIndex = computed(() => {
  if (!mappool.value?.length) {
    return 0;
  }

  for (let i = 0; i < mappool.value.length; i++) {
    if (state.data.now_playing.osu.code === mappool.value[i].code) {
      return i + 1;
    }
  }

  return 0;
});
</script>

<template>
  <div v-if="mapIndex" class="master-mappool-view">
    <div class="line-highlight"></div>
    <!--Iteration-->
    <div v-for="(item, i) in mappool" :key="i">
      <div class="line"></div>
      <div :key="i">
        <div :style="{ opacity: 1 ? 1 : 0 }" class="horizontal-box row">
          <div class="cell horizontal-box">
            <div
              class="modCircle"
              :style="{ background: `var(--color-${splitCode(item.code)[0]}-translucent)` }"
            ></div>
            <p class="title" :style="{ opacity: mapIndex > i ? 1 : 0 }">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
    <!---->
    <div class="line-highlight"></div>
  </div>
</template>

<style scoped>
.master-mappool-view {
  width: 300px;
}

.line,
.line-highlight {
  width: 100%;
}

.row {
  height: 24px;
}

.cell {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modCircle {
  width: 20px;
  height: 20px;
  border-radius: 99999px;
  margin: 0 10px 0 10px;
}

.title {
  font-size: 18px;
  width: 0;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 500ms;
}
</style>
