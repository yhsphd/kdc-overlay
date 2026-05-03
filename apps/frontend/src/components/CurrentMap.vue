<script setup>
import { useOverlayDataStore } from "@/socket.js";
import { computed, onMounted, ref } from "vue";
import { secondsToMMSS } from "../assets/main.js";
import RoundBox from "@/components/RoundBox.vue";

const state = useOverlayDataStore();

const np = computed(() => state.data?.now_playing?.osu);
const bgUrl = computed(
  () => `https://assets.ppy.sh/beatmaps/${np.value?.mapset_id}/covers/slimcover.jpg`
);
const currentMapPicker = computed(() => {
  // [teamName, acronym]
  const code = np.value?.code;
  let data = ["", ""];

  if (!code) {
    return data;
  }

  const phases = state.data?.progress.phases;
  const teams = state.data?.teams;
  for (let i = 0; i < phases.length; i++) {
    for (let j = 0; j < phases[i].order.length; j++) {
      if (phases[i].order[j].code === code) {
        const team = teams[phases[i].order[j].team];
        data[0] = team.name;
        data[1] = team.acronym;
        return data;
      }
    }
  }
  return data;
});
const activePages = computed(() => {
  if (currentMapPicker.value[0]) {
    return ["metadata", "title", "pick"];
  } else {
    return ["metadata", "title"];
  }
});
const currPage = ref(0);

onMounted(() => {
  setInterval(() => (currPage.value = (currPage.value + 1) % activePages.value.length), 10000);
});
</script>

<template>
  <div class="master-current-map" :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="bgDim absolute-center"></div>
    <div class="contents">
      <Transition name="switchPage" mode="out-in">
        <div v-if="activePages[currPage] === 'metadata'" :key="currPage" class="page">
          CS <b>{{ np?.stats.modified.cs.toFixed(1) }}</b> / AR
          <b>{{ np?.stats.modified.ar.toFixed(1) }}</b> / OD
          <b>{{ np?.stats.modified.od.toFixed(1) }}</b> / HP
          <b>{{ np?.stats.modified.hp.toFixed(1) }}</b> /
          <b>{{ np?.stats.modified.sr.toFixed(2) }}</b> ☆ /
          <b>{{ secondsToMMSS(np?.stats.modified.length / 1000) }}</b> /
          <b>{{ np?.stats.modified.bpm }}</b> BPM
        </div>
      </Transition>
      <Transition name="switchPage" mode="out-in">
        <div v-if="activePages[currPage] === 'title'" :key="currPage" class="page">
          <round-box v-if="np?.code" mode="code" :value="np?.code" class="roundBox"></round-box>
          <b>{{ np?.artist }}</b> - <b>{{ np?.title }}</b> [{{ np?.difficulty }}] by
          {{ np?.mapper }}
        </div>
      </Transition>
      <Transition name="switchPage" mode="out-in">
        <div v-if="activePages[currPage] === 'pick'" :key="currPage" class="page">
          <b>Picked</b> by:
          <round-box mode="acronym" :value="currentMapPicker[1]" class="roundBox"></round-box>
          {{ currentMapPicker[0] }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.master-current-map {
  width: 1090px;
  height: 50px;
  background-position: center;
  background-size: cover;
}

.bgDim {
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.contents {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 20px;
  white-space: pre;
}

.switchPage-enter-active {
  opacity: 0;
  animation: 500ms fadeIn 500ms;
}

.switchPage-leave-active {
  animation: fadeIn 500ms reverse;
}

.page {
  position: absolute;
  display: flex;
  justify-content: center;
  height: fit-content;
  text-align: center;
  width: 100%;
}

.roundBox {
  height: 30px;
  width: 50px;
  margin: 0 10px 0 10px;
}
</style>
