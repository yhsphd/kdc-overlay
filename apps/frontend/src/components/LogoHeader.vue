<script setup>
import { useOverlayDataStore } from "@/socket.js";
import { computed, ref } from "vue";
import logoUrl from "@/assets/logo.png";

const state = useOverlayDataStore();

const props = defineProps({
  orientation: {
    type: String,
    validator: (value) => ["vertical", "horizontal"].includes(value),
  },
});

const tournamentName = ref("Duo Cup: Korea 2026");
const text1 = computed(() => state.data.bracket);
const text1Bold = ref(false);
const text2 = computed(() => {
  if (state.data.type === "showcase") {
    return "Mappool Showcase";
  } else if (state.data.type === "match") {
    return "Match " + state.data.match_code;
  }
  return state.data.type;
});
const text2Bold = ref(true);

const horizontal = ref(props.orientation === "horizontal");
</script>

<template>
  <div class="master-logo-header" :class="{ 'horizontal-box': horizontal }">
    <img class="logo" :src="logoUrl" />
    <div class="texts">
      <div class="bold">{{ tournamentName }}</div>
      <div :class="{ bold: text1Bold }">{{ text1 }}</div>
      <div :class="{ bold: text2Bold }">{{ text2 }}</div>
    </div>
  </div>
</template>

<style scoped>
.master-logo-header {
  font-size: 24px;
  white-space: nowrap;
}

.logo {
  max-width: 180px;
  width: auto;
  height: auto;
}

.texts {
  margin-left: v-bind("horizontal ? '40px' : 'unset'");
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
