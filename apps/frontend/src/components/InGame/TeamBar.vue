<script setup>
import { computed, ref, watch } from "vue";
import StarComponent from "@/components/InGame/TeamBar/StarComponent.vue";
import RoundBox from "@/components/RoundBox.vue";
import { useOverlayDataStore } from "@/socket.js";

const state = useOverlayDataStore();

const props = defineProps({
  teamIndex: {
    type: Number,
    default: 0,
  },
});

const teamInfo = computed(() => state.data?.teams?.[props.teamIndex]);
const slots = computed(() => (state.data?.lobby?.bo + 1) / 2);
const points = computed(() => state.data?.lobby?.set_scores[props.teamIndex]);
const stars = computed(() => {
  if (!state.data?.lobby || !state.data.lobby.bo) return [];

  const stars = new Array(slots.value);
  for (let i = 0; i < points.value; i++) stars[i] = true;

  return stars;
});

const masterRef = ref();
watch(points, (newPoints, oldPoints) => {
  if (masterRef.value && newPoints > oldPoints) {
    console.log("New star added!");
    masterRef.value.style.backgroundColor = "rgba(237,206,25,0.3)";
    setTimeout(() => (masterRef.value.style.backgroundColor = ""), 500);
  }
});
</script>

<template>
  <div ref="masterRef" class="master-team-bar horizontal-box">
    <round-box
      :color="teamIndex ? 'blue' : 'red'"
      :value="teamInfo?.acronym"
      class="acronym"
    ></round-box>
    <div class="teamName">{{ teamInfo?.name }}</div>
    <div :style="{ flexGrow: 1 }"></div>
    <div class="stars horizontal-box">
      <star-component v-for="(item, i) in stars" :key="i" :value="item"></star-component>
    </div>
  </div>
</template>

<style scoped>
.master-team-bar {
  align-items: center;
  transition: background-color 500ms ease;
  padding: 8px;
}

.acronym {
  width: 100px;
  height: 50px;
}

.teamName {
  font-size: 40px;
  font-weight: bold;
  margin-left: 40px;
  line-height: 50px;
}

.stars {
  margin-right: 20px;
}
</style>
