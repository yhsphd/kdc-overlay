<script setup>
defineProps({
  visibility: Number,
  pickBan: Number, // 0-ban, 1-pick
  team: Number, // 0-red, 1-blue
  code: String,
  mapSetId: Number,
});
</script>

<template>
  <div class="master-decision-box">
    <transition name="status-change">
      <div
        :key="visibility"
        class="wrapper"
        :style="{
          backgroundImage: mapSetId
            ? `url(https://assets.ppy.sh/beatmaps/${mapSetId}/covers/list@2x.jpg)`
            : null,
          opacity: visibility === -2 ? 0 : 1,
        }"
      >
        <div class="overlay bgDim"></div>
        <svg v-if="visibility === -1" class="overlay disable" width="200" height="150">
          <line x1="0" y1="150" x2="200" y2="0"></line>
        </svg>
        <div v-if="visibility === 1" class="loader absolute-center"></div>
        <div v-if="visibility === 2" class="content absolute-center">
          <div class="code">{{ code }}</div>
          <div class="pickBan">{{ pickBan ? "PICK" : "BAN" }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.master-decision-box {
  position: relative;
  margin-right: 10px;
  width: 200px;
  height: 150px;
}

.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.master-decision-box:last-child {
  margin-right: 0;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bgDim {
  background-color: rgba(0, 0, 0, 0.5);
}

.disable {
  stroke: var(--color-line);
  stroke-width: 2px;
}

.loader {
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear;
}

@keyframes l5 {
  0% {
    box-shadow:
      20px 0 rgba(255, 255, 255, 0.2),
      -20px 0 rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.2);
  }
  25% {
    box-shadow:
      20px 0 rgba(255, 255, 255, 0.2),
      -20px 0 rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 1);
  }
  50% {
    box-shadow:
      20px 0 rgba(255, 255, 255, 1),
      -20px 0 rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.2);
  }
  75% {
    box-shadow:
      20px 0 rgba(255, 255, 255, 0.2),
      -20px 0 rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow:
      20px 0 rgba(255, 255, 255, 0.2),
      -20px 0 rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.2);
  }
}

.status-change-enter-active {
  animation: fadeIn 1s;
}

.status-change-leave-active {
  animation: fadeIn 1s reverse;
}

.content {
  text-align: center;
  font-weight: bold;
  font-style: italic;
}

.code {
  font-size: 36px;
}

.pickBan {
  font-size: 24px;
}
</style>
