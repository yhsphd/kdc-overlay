<script setup>
import AnimatedNumber from "@/components/AnimatedNumber.vue";

defineProps({
  rank: Number,
  playerStatus: Object,
});
</script>

<template>
  <div class="master-player-score">
    <b>#{{ rank }} {{ playerStatus?.nick }}</b
    ><br />
    <animated-number :value="playerStatus.score"></animated-number>
    / x{{ playerStatus?.combo.toLocaleString() }} / {{ playerStatus?.acc.toFixed(2) }}%
  </div>
</template>

<style scoped>
.master-player-score {
  position: absolute;
  left: 40px;
  font-size: 16px;
  white-space: nowrap;
}
</style>
