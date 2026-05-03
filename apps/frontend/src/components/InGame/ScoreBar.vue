<script setup>
import { computed } from "vue";
import { useOverlayDataStore } from "@/socket.js";
import { clamp, rankDuplicate } from "@/assets/main.js";
import PlayerScore from "@/components/InGame/ScoreBar/PlayerScore.vue";
import AnimatedNumber from "@/components/AnimatedNumber.vue";

const state = useOverlayDataStore();

const props = defineProps({
  teamSize: Number,
});

const lobbyData = computed(() => state.data?.lobby);

const diff = computed(() => lobbyData.value?.scores[0] - lobbyData.value?.scores[1]);
const innerTeamRank = computed(() => {
  if (props.teamSize === 2) {
    const data = [[], []];

    for (let i = 0; i < props.teamSize; i++) {
      if (lobbyData.value.players[2 * i]?.score >= lobbyData.value.players[2 * i + 1]?.score) {
        data[i] = [0, 1];
      } else {
        data[i] = [1, 0];
      }
    }
    return data;
  } else {
    return [[0], [0]];
  }
});
const scores = computed(() => lobbyData.value?.players.map((x) => x.score));
const rank = computed(() => (scores.value ? rankDuplicate(scores.value) : []));
const proportions = computed(() => {
  let data = props.teamSize === 1 ? [50, 0, 50, 0] : [25, 25, 25, 25]; // default value

  if (!scores.value) return data; // default value if scores are not ready

  const sum = scores.value.reduce((s, a) => s + a, 0);
  if (!sum) return data; // default value if sum is 0 (avoid dividing with 0)

  if (props.teamSize === 1) {
    // 1vs1: ^(1/1.7) scale, diff cap 200,000
    data = [50, 0, 0, 0]; // base value
    data[0] +=
      30 *
      clamp((diff.value > 0 ? 1 : -1) * Math.pow(Math.abs(diff.value) / 200000, 1 / 1.7), -1, 1);
    data[2] = 100 - data[0];
    data[1] = data[3] = 0;
  } else {
    // 2vs2: proportion of scores subtracted by the lowest, added to the base value
    const baseValue = 17 + Math.max(0, 1 - Math.max(...scores.value) / 150000) * 8; // minned to 17 at 150,000 scores
    data.fill(baseValue);
    const lowest = Math.min(...scores.value);
    const reduced = scores.value.map((x) => x - lowest);
    const reducedSum = reduced.reduce((s, a) => s + a, 0);

    for (let i = 0; i < reduced.length; i++) {
      data[i] += 4 * (25 - baseValue) * (reduced[i] / reducedSum);
    }
  }

  return data;
});

const redTeamProportion = computed(() => proportions.value[0] + proportions.value[1]);
const redLeaderProportion = computed(
  () => (Math.max(proportions.value[0], proportions.value[1]) / redTeamProportion.value) * 100
);
const blueLeaderProportion = computed(
  () =>
    (Math.max(proportions.value[2], proportions.value[3]) / (100 - redTeamProportion.value)) * 100
);
</script>

<template>
  <div class="master-score-bar roboto">
    <!--Middle Point-->
    <div class="middlePoint horizontal-box">
      <div class="middleLine"></div>
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
        <path d="M0 5L7.5 0.669872L7.5 9.33013L0 5Z" fill="white" />
      </svg>
    </div>

    <!--Bars-->
    <div class="bar red" :style="{ height: `${redTeamProportion}%` }">
      <div class="bar subBar red" :style="{ height: `${redLeaderProportion}%` }">
        <div v-if="teamSize === 2" class="divider sub" :style="{ bottom: 0 }">
          <Transition v-for="i in [0, 1]" :key="i" name="rankChanged" mode="out-in">
            <player-score
              :key="rank?.[innerTeamRank[0][i]] + '' + innerTeamRank[0][i]"
              class="individualScore"
              :class="{
                upper: i === 0,
                lower: i === 1,
              }"
              :rank="rank?.[innerTeamRank[0][i]]"
              :player-status="lobbyData?.players[innerTeamRank[0][i]]"
            ></player-score>
          </Transition>
        </div>
      </div>
    </div>
    <div class="divider" :style="{ top: `calc(${redTeamProportion}% - 1px)` }">
      <div class="scoreContainer red" :class="{ leading: diff > 0 }">
        <div class="scoreDiff red">
          +
          <animated-number :value="diff"></animated-number>
        </div>
        <div class="scoreSum red">
          <animated-number :value="lobbyData?.scores[0]"></animated-number>
        </div>
      </div>
      <div class="scoreContainer blue" :class="{ leading: diff < 0 }">
        <div class="scoreSum blue">
          <animated-number :value="lobbyData?.scores[1]"></animated-number>
        </div>
        <div class="scoreDiff blue">
          +
          <animated-number :value="-diff"></animated-number>
        </div>
      </div>
    </div>
    <div class="bar blue" :style="{ height: `${100 - redTeamProportion}%` }">
      <div class="bar subBar blue" :style="{ height: `${blueLeaderProportion}%` }">
        <div v-if="teamSize === 2" class="divider sub" :style="{ top: 0 }">
          <Transition v-for="i in [0, 1]" :key="i" name="rankChanged" mode="out-in">
            <player-score
              :key="rank?.[2 + innerTeamRank[1][i]] + '' + innerTeamRank[1][i]"
              class="individualScore"
              :class="{
                upper: i === 1,
                lower: i === 0,
              }"
              :rank="rank?.[2 + innerTeamRank[1][i]]"
              :player-status="lobbyData?.players[2 + innerTeamRank[1][i]]"
            ></player-score>
          </Transition>
        </div>
      </div>
    </div>

    <!--Background Color-->
    <div
      class="bgCol"
      :style="{
        backgroundColor:
          diff === 0 ? 'unset' : `var(--color-${diff > 0 ? 'red' : 'blue'}-translucent)`,
      }"
    ></div>
  </div>
</template>

<style scoped>
.master-score-bar {
  position: relative;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease;
}

.bgCol {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.middlePoint {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
}

.middleLine {
  width: 20px;
  height: 2px;
  background-color: var(--color-white-translucent);
  transition: height ease 0.2s;
}

.bar {
  position: absolute;
  left: 0;
  width: 20px;
}

.bar.red {
  top: 0;
  background-color: var(--color-red-translucent);
}

.bar.blue {
  bottom: 0;
  background-color: var(--color-blue-translucent);
}

.bar.red.subBar {
  background-color: var(--color-red);
}

.bar.blue.subBar {
  background-color: var(--color-blue);
}

.divider {
  position: absolute;
  height: 2px;
  width: 240px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
}

.bar,
.divider {
  transition: all ease 0.2s;
}

.scoreContainer {
  position: absolute;
  left: 50px;
}

.scoreContainer.red {
  bottom: 10px;
  color: var(--color-red);
}

.scoreContainer.blue {
  top: 10px;
  color: var(--color-blue);
}

.scoreSum {
  font-size: 32px;
}

.scoreDiff {
  opacity: 0;
  font-size: 24px;
}

.leading > .scoreSum {
  font-size: 40px;
  font-weight: bold;
}

.leading > .scoreDiff {
  opacity: 1;
}

.divider.sub {
  width: 100px;
}

.individualScore.upper {
  bottom: 5px;
}

.individualScore.lower {
  top: 5px;
}

.rankChanged-enter-active {
  animation: fadeIn 100ms;
}

.rankChanged-leave-active {
  animation: fadeIn 100ms reverse;
}
</style>
