<script setup>
defineProps({
  id: { type: Number, default: 1 },
  nick: { type: String, default: "" },
  rank: { type: Number, default: 0 },
});
</script>

<template>
  <div class="master-player-box">
    <div class="pfp" :style="{ backgroundImage: `url(https://a.ppy.sh/${id})` }"></div>
    <div class="contentBg">
      <div :class="{ nick: 1, nickLarge: nick.length > 10 }">{{ nick }}</div>
      <div class="line"></div>
      <div class="rank roboto">#{{ rank.toLocaleString() }}</div>
    </div>
  </div>
</template>

<style scoped>
.master-player-box {
  display: flex;
  flex-direction: row;
  width: 346px;
  height: 96px;
  padding: 17px;
  margin-bottom: 10px;
  background-color: var(--color-black-translucent);
}

.pfp {
  width: 96px;
  min-width: 96px;
  height: 96px;
  background-size: cover;
}

.contentBg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  width: 100%;
}

.nick {
  font-size: 32px;
  font-weight: bold;
}

.nickLarge {
  font-size: 24px;
}

.line {
  width: 100%;
  height: 2px;
  margin: 8px 0 8px 0;
}

.rank {
  font-size: 24px;
  font-weight: normal;
  text-align: right;
}
</style>
