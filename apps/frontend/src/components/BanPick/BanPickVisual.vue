<script setup>
import TeamBox from "@/components/BanPick/BanPickVisual/TeamBox.vue";
import DecisionBox from "@/components/BanPick/BanPickVisual/DecisionBox.vue";
import { computed, onMounted, ref } from "vue";
import { useOverlayDataStore } from "@/socket.js";
import { getMappool } from "@/assets/main.js";

const state = useOverlayDataStore();

const cellData = computed(() => {
  let insertOrder = [];
  let disableOrder = [];
  let hideOrder = [6, 9];
  let data = new Array(12);

  /*
   * data array structure
   *
   * [visibility, pick/ban, team, code, mapSetId]
   * visibility: Number / -2 hidden / -1 disable / 0 undecided / 1 waiting / 2 fixed
   * pick/ban: string / "ban" / "pick"
   * team: string / "red" / "blue"
   * code: string / "NM1"
   * mapSetId: Number
   */

  /*
   * Cell Order
   *
   * 0 2 | 5 7 9 11
   *  1 3|4 6 8 10
   * */

  if (phase.value === 1) {
    insertOrder = [0, 1, 2, 3];
  } else {
    disableOrder = [0, 1, 2, 3];
  }
  insertOrder = [...insertOrder, 4, 5, 7, 8];
  if (bo.value === 13) {
    insertOrder = [...insertOrder, 10, 11];
  } else {
    disableOrder = [...disableOrder, 10, 11];
  }

  for (let i = 0; i < insertOrder.length; i++) {
    if (i < banPickData.value?.length) {
      data[insertOrder[i]] = {
        visibility: 2,
        pickBan: banPickData.value[i][0],
        team: banPickData.value[i][1],
        code: banPickData.value[i][2],
        mapSetId: banPickData.value[i][3],
      };
    } else if (i === banPickData.value?.length) {
      data[insertOrder[i]] = { visibility: 1 };
    } else {
      data[insertOrder[i]] = { visibility: 0 };
    }
  }

  for (let i = 0; i < disableOrder.length; i++) {
    data[disableOrder[i]] = { visibility: -1 };
  }

  for (let i = 0; i < hideOrder.length; i++) {
    data[hideOrder[i]] = { visibility: -2 };
  }

  return data;
});

const bo = computed(() => state.data?.bo);
const phase = computed(() => state.data?.progress?.phase);
const currentPhase = computed(() => state.data?.progress?.phases[phase.value - 1]);
const firstPick = computed(() => currentPhase.value?.first_pick);
const banPickData = computed(() =>
  currentPhase.value?.order
    .filter((pick) => pick.code)
    .map((x) => [x.pick, x.team, x.code, getMappool(state.data.mappool, x.code).mapset_id])
);

const pointsFromSheet = computed(() => {
  const data = [0, 0];
  const phases = state.data?.progress?.phases;

  for (let i = 0; i < phases.length; i++) {
    for (let j = 0; j < phases[i].order.length; j++) {
      if (phases[i].order[j].win === 0 || phases[i].order[j].win === 1) {
        data[phases[i].order[j].win]++;
      }
    }
  }

  return data;
});

const teamBoxes = ref([]);
onMounted(() => {
  setInterval(() => {
    teamBoxes.value.forEach((teamBox) => {
      teamBox.advancePage();
    });
  }, 10000); // Synchronize two carousels
});
</script>

<template>
  <div class="master-ban-pick-visual horizontal-box">
    <!--TeamBox Area-->
    <div>
      <div
        v-for="(team, i) in state.data.teams"
        :key="i"
        :class="{ teamBox: true, red: !i, blue: i }"
      >
        <div class="content">
          <team-box ref="teamBoxes" :team="team" :point="pointsFromSheet[i]"></team-box>
        </div>
      </div>
    </div>
    <!--BanBox Area-->
    <div class="mapBox banBox">
      <div class="horizontal-box mapsRow">
        <div class="decisionBoxOffset" :style="{ flexGrow: firstPick ? 0 : 1 }">
          <div>Ban</div>
        </div>
        <decision-box
          v-for="i in firstPick ? [0, 2] : [1, 3]"
          v-bind="cellData[i]"
          :key="i"
          :index="i"
        ></decision-box>
      </div>
      <div class="horizontal-box mapsRow">
        <div class="decisionBoxOffset" :style="{ flexGrow: firstPick ? 1 : 0 }">
          <div>BAN</div>
        </div>
        <decision-box
          v-for="i in firstPick ? [1, 3] : [0, 2]"
          v-bind="cellData[i]"
          :key="i"
          :index="i"
        ></decision-box>
      </div>
      <div class="boxDivider absolute-center"></div>
    </div>
    <!--PickBox Area-->
    <div class="mapBox pickBox">
      <div class="horizontal-box mapsRow">
        <div class="decisionBoxOffset" :style="{ flexGrow: firstPick ? 1 : 0 }">
          <div>Pick</div>
        </div>
        <decision-box
          v-for="i in firstPick ? [5, 7, 9, 11] : [4, 6, 8, 10]"
          v-bind="cellData[i]"
          :key="i"
          :index="i"
        ></decision-box>
      </div>
      <div class="horizontal-box mapsRow">
        <div class="decisionBoxOffset" :style="{ flexGrow: firstPick ? 0 : 1 }">
          <div>Pick</div>
        </div>
        <decision-box
          v-for="i in firstPick ? [4, 6, 8, 10] : [5, 7, 9, 11]"
          v-bind="cellData[i]"
          :key="i"
          :index="i"
        ></decision-box>
      </div>
      <div class="boxDivider absolute-center"></div>
    </div>
  </div>
</template>

<style scoped>
.teamBox {
  width: 390px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.teamBox.red {
  background-color: var(--color-red-translucent);
}

.teamBox.blue {
  margin-top: 10px;
  background-color: var(--color-blue-translucent);
}

.teamBox > .content {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: var(--color-black-translucent);
}

.mapBox {
  position: relative;
  height: calc(100% - 30px);
  background-color: var(--color-white-translucent);
  margin-left: 10px;
  padding: 15px 10px 15px 10px;
}

.mapBox.banBox {
  width: 515px;
}

.mapBox.pickBox {
  width: 935px;
}

.boxDivider {
  width: calc(100% - 20px);
  height: 2px;
  background-color: black;
}

.mapsRow {
  width: 100%;
  margin-bottom: 40px;
}

.decisionBoxOffset {
  width: 0;
  overflow: hidden;
  transition: flex-grow 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  text-align: center;
  font-style: italic;
  font-weight: bold;
  opacity: 0.3;
}
</style>
