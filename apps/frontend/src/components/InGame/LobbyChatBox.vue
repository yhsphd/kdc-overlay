<script setup>
import ChatBox from "@/components/ChatBox.vue";
</script>

<template>
  <div class="master-lobby-chat-box">
    <div class="header row">Lobby</div>
    <div class="line-highlight"></div>
    <chat-box class="chat"></chat-box>
    <div class="line-highlight"></div>
  </div>
</template>

<style scoped>
.master-lobby-chat-box {
  width: 100%;
  font-size: 20px;
  margin-bottom: 40px;
  margin-top: 120px;
  height: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.line-highlight {
  width: 100%;
}

.header {
  font-size: 24px;
}

.row {
  height: 40px;
}

.chat {
  height: 0;
  flex-grow: 1;
}
</style>
