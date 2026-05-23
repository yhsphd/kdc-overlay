<script setup>
import RoundBox from "@/components/RoundBox.vue";
import { usePhaseOverviewViewModel } from "@/composables/usePhaseOverviewViewModel";

const { currentPhase } = usePhaseOverviewViewModel();
</script>

<template>
  <div v-if="currentPhase" class="master-phase-overview-idle">
    <!-- KDC26: Phase 순차 표시 삭제 (현재 Phase만 표시) -->
    <div>
      <div class="header row">{{ currentPhase.label }}</div>
      <div class="line-highlight"></div>
      <div class="horizontal-box row labels">
        <div class="cell fixed">Team</div>
        <div class="cell">Map</div>
        <div class="cell fixed">Win</div>
      </div>
      <!--Iteration-->
      <div v-for="(item, i) in currentPhase.items" :key="'item-' + i">
        <div class="line"></div>
        <div class="horizontal-box row">
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
            <p class="title">
              {{ item.artistTitle }}
            </p>
          </div>
          <div class="cell fixed">
            <div
              v-if="item.pick === 1"
              :class="{
                winCircle: 1,
                playing: item.win === -1 && (i === 0 || currentPhase.items[i - 1].win !== -1),
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
      <div class="line-highlight"></div>
    </div>
  </div>
</template>

<style scoped>
.master-phase-overview-idle {
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
  font-weight: bold;
}
.header::before {
  content: "- ";
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
