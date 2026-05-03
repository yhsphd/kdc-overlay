<script setup>
import { socket, useOverlayDataStore } from "@/socket.js";
import { ref } from "vue";
import IntroTopBar from "@/components/IntroScreen/TopBar.vue";
import StreamTitle from "@/components/IntroScreen/StreamTitle.vue";
import MusicPlayer from "@/components/IntroScreen/MusicPlayer.vue";
import TeamPanel from "@/components/IntroScreen/TeamPanel.vue";

const state = useOverlayDataStore();
socket.off(); // remove any existing listeners (after a hot module replacement)
state.bindEvents();
state.connect();

// eslint-disable-next-line no-undef
const intro = ref(_intro);
// eslint-disable-next-line no-undef
const showcase = ref(_showcase);
</script>

<template>
  <intro-top-bar class="topBar" :show-countdown="intro"></intro-top-bar>
  <stream-title v-if="showcase || !intro" class="title"></stream-title>
  <div v-if="!showcase && intro" class="teams horizontal-box">
    <team-panel
      v-for="(team, i) in state.data.teams"
      :key="i"
      :team-index="i"
      :team-data="team"
    ></team-panel>
  </div>
  <music-player class="player"></music-player>
</template>

<style scoped>
.topBar {
  margin: 128px;
  width: calc(100% - 128 * 2px);
}

.title {
  position: absolute;
  left: 128px;
  bottom: 128px;
}

.player {
  position: absolute;
  right: 128px;
  bottom: 128px;
  width: 400px;
}

.teams {
  position: absolute;
  left: 128px;
  bottom: 128px;
}
</style>
