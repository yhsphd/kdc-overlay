<script setup>
import TeamBox from "@/components/BanPick/BanPickVisual/TeamBox.vue";
import DecisionBox from "@/components/BanPick/BanPickVisual/DecisionBox.vue";
import { Carousel, Slide, Navigation as CarouselNavigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { onMounted, ref } from "vue";
import { useBanPickVisualViewModel } from "@/composables/useBanPickVisualViewModel";

const { teams, viewIndex, phases, pointsFromSheet } = useBanPickVisualViewModel();

const teamBoxes = ref([]);
onMounted(() => {
  setInterval(() => {
    teamBoxes.value.forEach((teamBox) => {
      // 컴포넌트가 unmount된 뒤 배열 요소가 없거나 함수가 제공되지 않을 대응
      if (teamBox && typeof teamBox.advancePage === "function") {
        teamBox.advancePage();
      }
    });
  }, 10000); // Synchronize two carousels
});
</script>

<template>
  <div class="master-ban-pick-visual horizontal-box">
    <!--TeamBox Area-->
    <div>
      <div
        v-for="(team, i) in teams"
        :key="'team-' + i"
        :class="{ teamBox: true, red: !i, blue: i }"
      >
        <div class="content">
          <TeamBox ref="teamBoxes" :team="team" :point="pointsFromSheet[i]"></TeamBox>
        </div>
      </div>
    </div>
    <!--PhaseBox Area (Ban & Pick Combined Layout)-->
    <div class="phaseBox">
      <!-- Grid Content within Carousel -->
      <Carousel
        v-model="viewIndex"
        items-to-show="auto"
        :gap="10"
        :wrap-around="false"
        :mouse-wheel="true"
        snap-align="center"
        class="phaseCarousel"
      >
        <Slide v-for="(phase, i) in phases" :key="'slide-' + i">
          <div class="content">
            <div class="gridContainer" :style="{ '--max-x': phase.layout.maxX || 0 }">
              <!-- Horizontal Divider -->
              <div v-if="phase.label !== 'TB'" class="boxDivider"></div>

              <!-- Phase Label -->
              <div
                class="phaseLabel"
                :class="{
                  top: phase.layout.items[0].team === 1,
                  bottom: phase.layout.items[0].team === 0,
                  tb: phase.label === 'TB',
                }"
              >
                {{ phase.label }}
              </div>

              <!-- Foreground Decision Boxes -->
              <DecisionBox
                v-for="(item, j) in phase.layout.items"
                :key="'decision-' + j"
                class="gridItem"
                :visibility="item.visibility"
                :pick-ban="item.pickBan"
                :team="item.team"
                :code="item.code"
                :map-set-id="item.mapSetId"
                :style="{
                  '--x': item.x,
                  '--y': item.y,
                }"
              ></DecisionBox>
            </div>
          </div>
        </Slide>
        <template #addons>
          <CarouselNavigation />
        </template>
      </Carousel>
    </div>
  </div>
</template>

<style scoped>
.teamBox {
  width: 390px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.teamBox.red {
  background-color: var(--color-red-translucent);
}

.teamBox.blue {
  margin-top: 10px;
  background-color: var(--color-blue-translucent);
}

.teamBox > .content {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  background-color: var(--color-black-translucent);
}

.phaseBox {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  height: 100%;
  background-color: var(--color-white-translucent);
  margin-left: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.phaseCarousel {
  height: 100%;

  --vc-nav-background: var(--color-black-translucent);
  --vc-nav-color: white;
  --vc-nav-color-hover: #e5e5e5;
  --vc-nav-border-radius: 50%;
  --vc-nav-width: 40px;
  --vc-nav-height: 40px;
}

.phaseCarousel :deep(.carousel__viewport) {
  mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}
.phaseCarousel :deep(.carousel__slide:first-child) {
  padding-left: 250px;
}
.phaseCarousel :deep(.carousel__slide:last-child) {
  padding-right: 250px;
}

.phaseCarousel .content {
  background: var(--color-black-translucent);
  padding: 10px;
  height: 100%;
}

.boxDivider {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-black-translucent);
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
}

/* Grid System for Absolute Positioning */
.gridContainer {
  /* 400px width + 10px gap */
  --grid-step-x: 410px;
  /* 150px height is the decision box perfectly aligned to bottom */
  --grid-step-y: calc(100% - 150px);

  position: relative;
  /* Width dynamically adjusts via inline CSS based on maxX items */
  width: calc((var(--max-x) + 1) * var(--grid-step-x) - 10px);
  height: 100%;
}

.decisionBoxOffset {
  position: absolute;
  width: 400px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  text-align: center;
  font-style: italic;
  font-weight: bold;
  opacity: 0.15;
  transform: translateX(calc(var(--x) * var(--grid-step-x)));
  top: calc(var(--y) * var(--grid-step-y));
}

.gridItem {
  position: absolute;
  transition:
    transform 0.5s ease,
    top 0.5s ease;
  transform: translateX(calc(var(--x) * var(--grid-step-x)));
  top: calc(var(--y) * var(--grid-step-y));
}

.phaseLabel {
  position: absolute;
  left: 0;
  width: 200px;
  text-align: center;
  font-size: 48px;
  color: var(--color-white-translucent);
  font-weight: bold;
  line-height: 150px;
}
.phaseLabel.top {
  top: 0;
}
.phaseLabel.bottom {
  bottom: 10px;
}
.phaseLabel.tb {
  width: 100%;
  line-height: 75px;
}
</style>
