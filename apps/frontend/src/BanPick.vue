<script setup>
import LogoHeader from "@/components/LogoHeader.vue";
import BanPickVisual from "@/components/BanPick/BanPickVisual.vue";
import MapList from "@/components/BanPick/MapList.vue";
import ChatBox from "@/components/ChatBox.vue";
import { socket, useOverlayDataStore } from "@/socket.js";
import MatchOverviewWidget from "./components/BanPick/MatchOverviewWidget.vue";

const state = useOverlayDataStore();
socket.off(); // remove any existing listeners (after a hot module replacement)
state.bindEvents();
state.connect();
</script>

<template>
  <div class="master-ban-pick">
    <div class="topBar horizontal-box">
      <LogoHeader class="header" orientation="horizontal"></LogoHeader>
       <div class="flex-grow"></div>
      <MatchOverviewWidget class="matchWidget"></MatchOverviewWidget>
    </div>
    <div class="line-highlight"></div>
    <!-- <BanPickVisual class="visual"></BanPickVisual> -->
    <div class="line"></div>
    <MapList></MapList>
    <div class="line-highlight"></div>
    <ChatBox class="chat"></ChatBox>
  </div>
</template>

<style scoped>
.topBar {
  height: 85px;
  margin: 60px 60px 40px 60px;
}

.line-highlight,
.line {
  margin: 10px;
}

.desc {
  flex-grow: 1;
  text-align: right;
  font-size: 36px;
  line-height: 45px;
}

.visual {
  height: 370px;
  margin: 10px;
}

.chat {
  width: 1200px;
  margin: 20px 0 40px 40px;
  height: 180px;
}
</style>
