<script setup>
import { useOverlayDataStore } from "@/socket.js";
import { computed, ref } from "vue";
import { teamName2color } from "@/assets/main.js";

const state = useOverlayDataStore();

const props = defineProps({
  value: String,
  mode: {
    type: String,
    default: "manual",
    validator(value) {
      return ["acronym", "code", "manual"].includes(value);
    },
  },
  color: String,
  textColor: String,
});

const masterRef = ref(null);

const bgcol = computed(() => {
  if (props.color) {
    // color specified
    if (props.color === "red") {
      return "var(--color-red-translucent)";
    } else if (props.color === "blue") {
      return "var(--color-blue-translucent)";
    } else if (props.color === "grey") {
      return "var(--color-grey-translucent)";
    } else {
      // custom color specified
      return props.color;
    }
  } else if (props.mode === "acronym") {
    // acronym mode: red/blue depending on acronym, which is passed as value prop
    if (teamName2color(state.data, 1, props.value) === "red") {
      return "var(--color-red-translucent)";
    } else if (teamName2color(state.data, 1, props.value) === "blue") {
      return "var(--color-blue-translucent)";
    }
  } else if (props.mode === "code") {
    // mappool code mode: set background color depending on the mod
    const mod = props.value.replace(/[0-9]/g, "");
    return `var(--color-${mod}-translucent)`;
  }
  return "var(--color-white-translucent)"; // default
});

const txtCol = computed(() => {
  if (props.textColor) {
    return props.textColor;
  } else if (props.mode === "code") {
    const mod = props.value.replace(/[0-9]/g, "");
    if (["HD"].includes(mod)) {
      return "black";
    }
  }
  return "white";
});

const txtSize = computed(() => {
  if (masterRef.value) {
    return masterRef.value.getBoundingClientRect().height * 0.5 + "px";
  } else {
    return "0px";
  }
});
</script>

<template>
  <div ref="masterRef" class="master-round-box" :style="{ backgroundColor: bgcol }">
    <span class="value" :style="{ fontSize: txtSize, color: txtCol }">{{ value }}</span>
  </div>
</template>

<style scoped>
.master-round-box {
  border-radius: 999999px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
</style>
