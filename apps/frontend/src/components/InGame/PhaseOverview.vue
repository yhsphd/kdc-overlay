<script setup>
import { computed, onMounted, ref } from "vue";
import RoundBox from "@/components/RoundBox.vue";
import { useOverlayDataStore } from "@/socket.js";
import { getMappool } from "@/assets/main.js";

const state = useOverlayDataStore();

defineProps({
  idle: Boolean,
});

const progressData = computed(() => state.data.progress);
const overviewData = computed(() => {
  const data = [];

  for (let i = 0; i < progressData.value?.phase; i++) {
    const phase = [];
    progressData.value.phases[i].order.forEach((pick) => {
      if (pick.pick === 1) {
        // pick === 1 means the entry is a pick info, not ban
        phase.push(pick);
      }
    });
    data.push(phase);
  }

  if (data.length >= 2) {
    const maxLen = Math.max(data[0].length, data[1].length);
    for (let i = 0; i < data.length; i++) {
      if (data[i].length < maxLen) {
        while (data[i].length !== maxLen) {
          data[i].push({ code: "", team: 0, win: 0, pick: 0 });
        }
      }
    }
  }

  return data;
});
const mappoolData = computed(() => state.data.mappool);

const currentShownPhase = ref(0);
onMounted(() => {
  setInterval(() => {
    const currPhase = progressData.value.phase;
    currentShownPhase.value = (currentShownPhase.value + 1) % currPhase;
  }, 10 * 1000);
});
</script>

<template>
  <div class="master-phase-overview">
    <Transition name="switchPhase" mode="out-in">
      <div :key="currentShownPhase" class="header row">
        Phase <b>{{ currentShownPhase + 1 }}</b>
      </div>
    </Transition>
    <div class="line-highlight"></div>
    <div class="horizontal-box row labels">
      <div class="cell fixed">Pick</div>
      <div class="cell">Map</div>
      <div class="cell fixed">Win</div>
    </div>
    <!--Iteration-->
    <div v-for="(item, i) in overviewData[currentShownPhase]" :key="i">
      <div class="line"></div>
      <Transition name="switchPhase" mode="out-in">
        <div :key="currentShownPhase">
          <div :style="{ opacity: item.code ? 1 : 0 }" class="horizontal-box row">
            <div class="cell fixed">
              <div
                :class="{
                  colorBox: 1,
                  red: item.team === 0,
                  blue: item.team === 1,
                }"
              ></div>
            </div>
            <div class="cell horizontal-box">
              <round-box class="code" :value="item.code" mode="code"></round-box>
              <Transition name="titleAnim">
                <p v-show="idle" class="title">
                  {{
                    (() => {
                      const map = getMappool(mappoolData, item.code);
                      return `${map.artist} - ${map.title}`;
                    })()
                  }}
                </p>
              </Transition>
            </div>
            <div class="cell fixed">
              <div
                :class="{
                  winCircle: 1,
                  playing:
                    item.win === -1 &&
                    (i === 0 || overviewData[currentShownPhase][i - 1].win !== -1),
                  red: item.win === 0,
                  blue: item.win === 1,
                }"
              >
                <svg
                  v-if="item.win === -1"
                  class="absolute-center"
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                >
                  <path
                    d="M11.7627 6.77808L0.512695 13.2733V0.282886L11.7627 6.77808Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <!---->
    <div class="line-highlight"></div>
  </div>
</template>

<style scoped>
.master-phase-overview {
  width: 100%;
  font-size: 20px;
  margin-bottom: 10px;
}

.line,
.line-highlight {
  width: 100%;
}

.header {
  font-size: 24px;
}

.labels {
  text-align: center;
}

.row {
  height: 40px;
}

.cell {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell.fixed {
  flex-grow: unset;
  width: 90px;
}

.colorBox {
  width: 60px;
  height: 10px;
}

.red {
  background-color: var(--color-red-translucent);
}

.blue {
  background-color: var(--color-blue-translucent);
}

.code {
  width: 70px;
  height: 30px;
}

.title {
  width: 0;
  flex-grow: 1;
  margin-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titleAnim-enter-active {
  animation: titleAnim 1s ease;
}

.titleAnim-leave-active {
  animation: titleAnim 1s ease reverse;
}

@keyframes titleAnim {
  0% {
    margin-left: 0;
    opacity: 0;
    flex-grow: 0;
  }
  100% {
    margin-left: 20px;
    opacity: 1;
    flex-grow: 1;
  }
}

.switchPhase-enter-active {
  animation: fadeIn 500ms;
}

.switchPhase-leave-active {
  animation: fadeIn 500ms reverse;
}

.winCircle {
  position: relative;
  border-radius: 9999px;
  width: 30px;
  height: 30px;
}

.winCircle > * {
  opacity: 0;
}

.winCircle.playing {
  background-color: var(--color-line-highlight);
}

.winCircle.playing > * {
  opacity: 1;
}
</style>
