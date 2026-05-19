<script setup>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import RoundBox from "@/components/RoundBox.vue";
import { computed, ref } from "vue";

const props = defineProps({
  team: Object,
  point: Number,
});

const players = computed(() =>
  props.team.players.map((x) => ({
    id: x.id,
    nick: x.nick,
  }))
);

const carousel = ref();

function advancePage() {
  carousel.value.next();
}

defineExpose({
  advancePage, // Expose function to advance page so that the parent component can synchronize multiple carousels
});
</script>

<template>
  <div class="master-team-box">
    <div class="point">{{ point }}</div>
    <Carousel ref="carousel" :wrap-around="true">
      <Slide v-for="slide in 1" :key="slide">
        <div class="carousel__item">
          <div class="item horizontal-box">
            <RoundBox :value="team.acronym" class="acronym"></RoundBox>
            <div class="teamName">{{ team.name }}</div>
          </div>
        </div>
      </Slide>
      <Slide v-for="slide in 1" :key="slide">
        <div class="carousel__item">
          <div v-for="(player, i) in players" :key="i" class="item player horizontal-box">
            <div
              class="pfp"
              :style="{ backgroundImage: `url(https://a.ppy.sh/${player.id})` }"
            ></div>
            <div class="nick">{{ player.nick }}</div>
          </div>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<style scoped>
.master-team-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item {
  width: 350px;
  align-items: center;
}

.acronym {
  width: 70px;
  min-width: 70px;
  height: 40px;
  margin: 10px;
}

.teamName {
  font-size: 32px;
  font-weight: bold;
  text-align: left;
  margin-right: 20px;
}

.player {
  margin: 16px;
  height: 48px;
}

.pfp {
  margin: 0 16px 0 16px;
  width: 48px;
  min-width: 48px;
  height: 48px;
  background-position: center;
  background-size: cover;
}

.nick {
  font-size: 24px;
  line-height: 48px;
}

.point {
  position: absolute;
  right: 10px;
  bottom: 0;
  font-size: 128px;
  line-height: 128px;
  font-style: italic;
  font-weight: bolder;
  color: black;
  opacity: 0.3;
}
</style>
