<script setup>
import { useDecisionBoxViewModel } from "@/composables/useDecisionBoxViewModel";

const props = defineProps({
  visibility: Number,
  pickBan: Number, // 0-ban, 1-pick
  team: Number, // 0-red, 1-blue
  code: String,
  mapSetId: Number,
  mapData: Object,
});

const {
  title,
  artist,
  mapper,
  stats,
  backgroundUrl,
  isDecided,
  isPending,
  isDisabled,
  isHidden,
  mod,
} = useDecisionBoxViewModel(props);
</script>

<template>
  <div class="master-decision-box">
    <transition name="status-change">
      <div
        :key="visibility"
        class="wrapper"
        :style="{
          backgroundImage: backgroundUrl,
          opacity: isHidden ? 0 : 1,
        }"
      >
        <div class="overlay bgDim"></div>

        <!--Disabled-->
        <svg v-if="isDisabled" class="overlay disable" width="400" height="150">
          <line x1="0" y1="150" x2="400" y2="0"></line>
        </svg>

        <!--Pending-->
        <div v-if="isPending" class="loader"></div>

        <!--Decided-->
        <div v-if="isDecided" class="content layout-container">
          <div class="codeBox">
            <span class="codeText" :style="{ color: `var(--color-${mod})` }">{{ code }}</span>
          </div>

          <!-- Right side: Metadata -->
          <div class="metaBox">
            <div class="titleArtist">
              <span class="artist">{{ artist }}</span>
              <span class="title">{{ title }}</span>
            </div>
            <div class="mapper">Mapped by {{ mapper }}</div>
            <div class="statsRow">
              <div class="statBadge"><span class="statLable">CS</span> {{ stats.cs }}</div>
              <div class="statBadge"><span class="statLable">AR</span> {{ stats.ar }}</div>
              <div class="statBadge"><span class="statLable">OD</span> {{ stats.od }}</div>
              <div class="statBadge"><span class="statLable">BPM</span> {{ stats.bpm }}</div>
              <div class="statBadge stars"><span class="statLable">★</span> {{ stats.stars }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.master-decision-box {
  position: relative;
  width: 400px;
  height: 150px;
  overflow: hidden;
}

.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bgDim {
  background-color: rgba(0, 0, 0, 0.65);
}

.disable {
  stroke: var(--color-line, #ff4c4c);
  stroke-width: 2px;
}

.loader {
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
}

.layout-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
}

.codeBox {
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-right: 2px solid var(--color-line);
  padding-right: 12px;
  margin-right: 12px;
}

.codeText {
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
}

.metaBox {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.titleArtist {
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

.artist {
  font-size: 13px;
  font-weight: 600;
  color: #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mapper {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.statsRow {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.statBadge {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.statLable {
  font-size: 9px;
  color: #ccc;
  font-weight: 500;
}

.statBadge.stars {
  background: rgba(255, 204, 34, 0.2);
  color: #ffcc22;
}

.statBadge.stars .statLable {
  color: #ffcc22;
}
</style>
