<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  acronym: { type: String, default: "" },
  seed: { type: Number, default: 0 },
  players: {
    type: Array,
    default() {
      return [];
    },
  },
});

const avgRank = computed(() => {
  let count = 0;
  let sum = 0;

  if (!props.players) {
    return 0;
  }

  props.players.forEach((player) => {
    count++;
    sum += player.rank;
  });
  return Math.ceil(sum / count);
});
</script>

<template>
  <div class="master-team-info">
    <div class="section">
      <div class="label">avg. rank</div>
      <div class="value">#{{ avgRank.toLocaleString() }}</div>
    </div>
    <div class="line"></div>
    <div class="section">
      <div class="label">quals. seeding</div>
      <div class="value">#{{ seed.toLocaleString() }}</div>
    </div>
  </div>
</template>

<style scoped>
.master-team-info {
  width: 360px;
  height: 60px;
  padding: 10px;
  background-color: var(--color-black-translucent);
  display: flex;
  flex-direction: row;
}

.section {
  width: 50%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.line {
  width: 2px;
  height: 100%;
}

.label {
  font-size: 16px;
}

.value {
  font-size: 24px;
}
</style>
