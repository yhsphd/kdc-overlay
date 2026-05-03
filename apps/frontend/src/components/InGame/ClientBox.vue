<script setup>
import { computed, ref } from "vue";
import DimensionInfo from "@/components/DimensionInfo.vue";

const props = defineProps({
  index: Number,
  ratio: {
    type: Array,
    validator(value) {
      return value.length === 2;
    },
  },
  teamSize: Number,
});

const masterElem = ref(null);
const positionInfo = computed(() => {
  if (!masterElem.value) {
    return { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
  }
  return masterElem.value.getBoundingClientRect();
});

const computedWidth = computed(() => (positionInfo.value.height * props.ratio[0]) / props.ratio[1]);
</script>

<template>
  <!-- Not rendering client 1, 3 if teamSize isn't 2 (KDC24) -->
  <div
    v-if="teamSize === 2 || index % 2 === 0"
    ref="masterElem"
    class="master-client-box"
    :style="{ width: `${computedWidth}px` }"
  >
    <dimension-info
      class="posInfo"
      :name="`osu!tourney client ${index}`"
      :source="masterElem"
    ></dimension-info>
  </div>
</template>

<style scoped>
.master-client-box {
  height: 100%;
  width: 480px;
  background: black;
  color: white;
}

.master-client-box:only-child {
  margin: 0 auto;
}

.posInfo {
  margin-top: 40px;
  margin-left: 20px;
  width: 400px;
}
</style>
