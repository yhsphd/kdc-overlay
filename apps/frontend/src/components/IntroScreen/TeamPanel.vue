<script setup>
import { computed } from "vue";
import RoundBox from "@/components/RoundBox.vue";
import PlayerBox from "@/components/IntroScreen/TeamPanel/PlayerBox.vue";
import TeamInfo from "@/components/IntroScreen/TeamPanel/TeamInfo.vue";

const props = defineProps({ teamIndex: Number, teamData: Object });

const teamColor = computed(() => ["red", "blue"][props.teamIndex]);
</script>

<template>
  <div class="master-team-panel">
    <round-box :color="teamColor" :value="teamData.acronym" class="acronym"></round-box>
    <div class="teamName">{{ teamData.name }}</div>
    <div class="masterBox">
      <player-box v-for="(player, i) in teamData.players" v-bind="player" :key="i"></player-box>
      <team-info v-bind="teamData"></team-info>
    </div>
  </div>
</template>

<style scoped>
.master-team-panel {
  margin-right: 200px;
}

.acronym {
  width: 100px;
  height: 50px;
}

.teamName {
  font-size: 40px;
  height: 80px;
  line-height: 80px;
}

.masterBox {
  width: 380px;
  height: 360px;
  background-color: var(--color-white-translucent);
  padding: 10px 10px 10px 20px;
}
</style>
