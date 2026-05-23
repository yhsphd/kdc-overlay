<script setup>
import RoundBox from "@/components/RoundBox.vue";
import { usePhaseOverviewViewModel } from "@/composables/usePhaseOverviewViewModel";

const { allPhases } = usePhaseOverviewViewModel();
</script>

<template>
  <div class="master-phase-overview-playing">
    <div v-for="(phase, phaseIdx) in allPhases" :key="'compact-' + phaseIdx" class="phase">
      <!-- Phase Header -->
      <div class="phaseHeader">
        <div class="line red"></div>
        <div class="label">{{ phase.label }}</div>
        <div class="line blue"></div>
      </div>

      <!-- Phase Content (Bans and Picks) with Vertical Divider -->
      <div class="phaseContent">
        <div
          v-if="phase.label !== 'TB' && !phase.label.toLowerCase().includes('tiebreaker')"
          class="vertical-divider"
        ></div>

        <!-- Bans Section -->
        <div v-if="phase.label === 'Ban'" class="bans">
          <div class="bansSide left">
            <RoundBox
              v-for="(b, bIdx) in phase.items.filter((b) => b.team === 0)"
              :key="'ban-red-' + bIdx"
              class="code"
              :value="b.code || ''"
              :mode="b.code ? 'code' : 'manual'"
              :color="b.code ? undefined : 'var(--color-white-translucent)'"
            ></RoundBox>
          </div>
          <div class="bansGap"></div>
          <div class="bansSide right">
            <RoundBox
              v-for="(b, bIdx) in phase.items.filter((b) => b.team === 1)"
              :key="'ban-blue-' + bIdx"
              class="code"
              :value="b.code || ''"
              :mode="b.code ? 'code' : 'manual'"
              :color="b.code ? undefined : 'var(--color-white-translucent)'"
            ></RoundBox>
          </div>
        </div>

        <!-- Picks Section -->
        <div v-else class="picks">
          <div v-for="(pick, i) in phase.items" :key="'pick-' + i" class="pickRow">
            <!-- Left (Red) Result Indicator -->
            <div v-if="pick.win === 0" class="pickResult win" style="grid-column: 1">W</div>
            <div v-else-if="pick.win === 1" class="pickResult lose" style="grid-column: 1">L</div>

            <!-- Left (Red side) Line -->
            <div
              v-if="pick.win === 0"
              class="resultLine red solid"
              :style="
                pick.team === 1
                  ? 'grid-column: 2 / 5;'
                  : pick.team !== 0 && pick.team !== 1
                    ? 'grid-column: 2 / 4; margin-right: 27.5px;'
                    : 'grid-column: 2;'
              "
            ></div>
            <div
              v-else-if="pick.win === 1"
              class="resultLine red dashed"
              :style="
                pick.team === 1
                  ? 'grid-column: 2 / 5;'
                  : pick.team !== 0 && pick.team !== 1
                    ? 'grid-column: 2 / 4; margin-right: 27.5px;'
                    : 'grid-column: 2;'
              "
            ></div>

            <!-- Map Box -->
            <RoundBox
              v-if="pick.team === 0"
              class="code"
              :value="pick.code || ''"
              :mode="pick.code ? 'code' : 'manual'"
              :color="pick.code ? undefined : 'var(--color-white-translucent)'"
              style="grid-column: 3"
            ></RoundBox>
            <RoundBox
              v-else-if="pick.team === 1"
              class="code"
              :value="pick.code || ''"
              :mode="pick.code ? 'code' : 'manual'"
              :color="pick.code ? undefined : 'var(--color-white-translucent)'"
              style="grid-column: 5"
            ></RoundBox>
            <RoundBox
              v-else
              class="code"
              :value="pick.code || ''"
              :mode="pick.code ? 'code' : 'manual'"
              :color="pick.code ? undefined : 'var(--color-white-translucent)'"
              style="grid-column: 3 / 6; justify-self: center"
            ></RoundBox>

            <!-- Right (Blue side) Line -->
            <div
              v-if="pick.win === 1"
              class="resultLine blue solid"
              :style="
                pick.team === 0
                  ? 'grid-column: 4 / 7;'
                  : pick.team !== 0 && pick.team !== 1
                    ? 'grid-column: 5 / 7; margin-left: 27.5px;'
                    : 'grid-column: 6;'
              "
            ></div>
            <div
              v-else-if="pick.win === 0"
              class="resultLine blue dashed"
              :style="
                pick.team === 0
                  ? 'grid-column: 4 / 7;'
                  : pick.team !== 0 && pick.team !== 1
                    ? 'grid-column: 5 / 7; margin-left: 27.5px;'
                    : 'grid-column: 6;'
              "
            ></div>

            <!-- Right (Blue) Result Indicator -->
            <div v-if="pick.win === 1" class="pickResult win" style="grid-column: 7">W</div>
            <div v-else-if="pick.win === 0" class="pickResult lose" style="grid-column: 7">L</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Bottom White Design Line -->
    <div class="bottomLine"></div>
  </div>
</template>

<style scoped>
.master-phase-overview-playing {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phase {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.phaseHeader {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 5px;
}
.phaseHeader > .label {
  padding: 0 15px;
  font-size: 20px;
}
.phaseHeader > .line {
  flex: 1;
  height: 2px;
}
.phaseHeader > .line.red {
  background-color: var(--color-red-translucent);
}
.phaseHeader > .line.blue {
  background-color: var(--color-blue-translucent);
}

.bans {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
  position: relative;
  z-index: 1;
}

.bansSide {
  display: flex;
  flex: 1;
  gap: 8px;
}
.bansSide.left {
  justify-content: flex-end;
}
.bansSide.right {
  justify-content: flex-start;
}
.bansGap {
  width: 25px; /* Center gap for bans */
}

.picks {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.pickRow {
  display: grid;
  grid-template-columns: 30px 1fr 70px 25px 70px 1fr 30px;
  align-items: center;
  height: 25px;
}

.pickRow > * {
  grid-row: 1;
}

.phaseContent {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.vertical-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: var(--color-white-translucent);
  transform: translateX(-50%);
  z-index: 0;
}

.pickResult {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  justify-self: center;
  z-index: 2;
}

.pickResult.win {
  background-color: var(--color-yellow);
  color: black;
  box-shadow: 0 0 5px var(--color-yellow);
}

.pickResult.lose {
  background-color: var(--color-black-translucent);
  color: var(--color-white-translucent);
  border: 1px dashed var(--color-white-translucent);
}

.code {
  width: 70px;
  height: 25px;
  z-index: 2;
}

.resultLine.solid {
  height: 2px;
  background-color: var(--color-line-highlight);
}
.resultLine.dashed {
  height: 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.3);
  background-color: transparent;
}
.resultLine.red {
  margin-right: 5px;
}
.resultLine.blue {
  margin-left: 5px;
}

.bottomLine {
  width: 100%;
  height: 2px;
  background-color: var(--color-line);
  margin-top: 10px;
}
</style>
