<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  value: String,
  color: {
    type: String,
    validator: (value) => ["red", "blue", "white"].includes(value),
  },
});

const masterRef = ref(null);

const bgcol = computed(() => {
  if (props.color === "red") {
    return "var(--color-red-translucent)";
  } else if (props.color === "blue") {
    return "var(--color-blue-translucent)";
  } else if (props.color === "grey") {
    return "var(--color-grey-translucent)";
  } else {
    return props.color;
  }
});

const txtsize = computed(() => {
  if (masterRef.value) {
    return masterRef.value.getBoundingClientRect().height * 0.64 + "px";
  } else {
    return "0px";
  }
});
</script>

<template>
  <div ref="masterRef" class="master-team-acronym" :style="{ backgroundColor: bgcol }">
    <span class="value" :style="{ fontSize: txtsize }">{{ value }}</span>
  </div>
</template>

<style scoped>
.master-team-acronym {
  border-radius: 999999px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
</style>
