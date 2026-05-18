<script setup>
import { useMapListViewModel } from "@/composables/useMapListViewModel";

const { columns, isUnavailable } = useMapListViewModel();
</script>

<template>
  <div class="master-map-list horizontal-box">
    <div v-for="(column, i) in columns" :key="i" class="column">
      <div
        v-for="(map, j) in column"
        :key="j"
        class="maps"
        :style="{ flexGrow: `${map.mod === 'TB' ? 1 : 0}` }"
      >
        <div class="row horizontal-box">
          <div
            class="code roboto"
            :style="{ color: `var(--color-${map.mod}`, opacity: map.i - 1 ? 0 : 1 }"
          >
            <div v-if="map.i === 1" class="first"></div>
            {{ map.mod }}
          </div>
          <div class="horizontal-box map" :class="{ unavailable: isUnavailable(map) }">
            <div class="divider" :class="{ last: map.last }"></div>
            <div class="horizontal-box info-wrapper">
              <div
                class="bg"
                :style="{
                  backgroundImage: `url(https://assets.ppy.sh/beatmaps/${map.setId}/covers/list@2x.jpg)`,
                }"
              ></div>
              <div>
                <div class="title">
                  {{ map.title }}
                </div>
                <div class="artistMapper">{{ map.artist }} // {{ map.mapper }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.master-map-list {
  height: 240px;
  padding: 0 20px 0 20px;
  flex-wrap: wrap;
}

.column {
  max-width: 25%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.maps {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.row {
  height: 40px;
  align-items: center;
  transition: opacity 0.5s;
}

.code {
  position: relative;
  font-size: 36px;
  width: 70px;
  min-width: 70px;
  text-align: right;
}

.unavailable {
  opacity: 0.4;
}

.divider {
  box-sizing: border-box;
  height: 40px;
  margin: 0 10px 0 10px;
  width: 2px;
  min-width: 2px;
  background-color: var(--color-line-highlight);
}

.divider.last {
  height: 32px;
  margin-bottom: 8px;
}

.first {
  position: absolute;
  right: -15px;
  width: 8px;
  height: 8px;
  background-color: white;
}

.map,
.map div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-wrapper {
  min-width: 0;
}

.bg {
  width: 45px;
  min-width: 45px;
  height: 36px;
  background-position: center;
  background-size: cover;
  margin-right: 8px;
}

.unavailable .bg {
  filter: grayscale(100%);
}

.title {
  font-size: 20px;
  line-height: 20px;
}

.artistMapper {
  font-size: 12px;
  opacity: 0.8;
}
</style>
