<script setup>
import { useMatchOverviewWidgetViewModel } from "@/composables/useMatchOverviewWidgetViewModel";

// ViewModel에서 가공이 모두 끝난 데이터만 가져와서 바인딩합니다.
const { bo, layoutPhases, viewIndex, setPage } = useMatchOverviewWidgetViewModel();
</script>

<template>
  <div class="master-match-overview-widget">
    <table class="infoWidget">
      <tbody>
        <tr>
          <th>Best of</th>
          <th
            v-for="(phase, i) in layoutPhases"
            :key="'header-' + i"
            :class="{ active: i === viewIndex }"
            style="cursor: pointer"
            @click="setPage(i)"
          >
            <div>
              {{ phase.label }}
            </div>
          </th>
        </tr>
        <tr>
          <td class="bestof">{{ bo }}</td>
          <td
            v-for="(phase, i) in layoutPhases"
            :key="'content-' + i"
            :class="{ active: i === viewIndex }"
            style="cursor: pointer"
            @click="setPage(i)"
          >
            <!-- ViewModel에서 미리 계산된 layout.maxX 와 layout.items 를 사용합니다 -->
            <div class="grid-container" :style="{ '--max-x': phase.layout.maxX }">
              <div
                v-for="(item, j) in phase.layout.items"
                :key="j"
                class="grid-item"
                :class="{
                  'win-red': item.win === 0,
                  'win-blue': item.win === 1,
                  'is-ban': item.pick === 0,
                  'is-pick': item.pick === 1,
                }"
                :style="{
                  '--x': item.x,
                  '--y': item.y,
                }"
              >
                {{ item.code }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.master-match-overview-widget {
  text-align: center;
}

table {
  border-collapse: collapse;
}

th {
  position: relative;
  font-size: 16px;
  padding: 4px;
  line-height: 18px;
}

th::before {
  position: absolute;
  left: -2px;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--color-line-highlight);
  content: "";
}

th::after {
  position: absolute;
  right: -2px;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--color-line-highlight);
  content: "";
}

td:first-of-type {
  padding-right: 32px;
  padding-left: 32px;
  border-left: var(--color-line) solid 2px;
}

.active > * {
  animation: halfFadeIn 1s infinite alternate-reverse ease;
}

tr {
  padding-bottom: 24px;
}

td {
  padding: 8px 12px;
  vertical-align: top;
  text-align: center;
  border-right: var(--color-line) solid 2px;
}

.bestof {
  font-size: 52px;
  font-weight: bold;
  line-height: 52px;
}

.grid-container {
  /* 픽셀 값은 여기서 CSS 변수로 관리합니다 */
  --grid-step-x: 48px;
  --grid-step-y: 28px;

  position: relative;
  /* (최대 x좌표 * 격자 크기) + 아이템 크기(20px)를 더해 width를 딱 맞게 계산 */
  width: calc(var(--max-x) * var(--grid-step-x) + 48px);
  height: calc(var(--grid-step-y) * 2);
  margin: 0 auto; /* td 안에서 가운데 정렬 */
  transition: width 0.3s ease;
}

.grid-item {
  position: absolute;
  width: 44px;
  height: 24px;
  background-color: var(--color-white-translucent);
  border-radius: 2px;
  /* JS에서 넘겨준 --x, --y 값을 CSS calc()로 계산하여 적용합니다 */
  transform: translate(calc(var(--x) * var(--grid-step-x)), calc(var(--y) * var(--grid-step-y)));
  transition: transform 0.3s ease;
}

.is-pick.win-red {
  background-color: var(--color-red-translucent);
}

.is-pick.win-blue {
  background-color: var(--color-blue-translucent);
}

.is-ban {
  opacity: 0.5; /* 밴은 반투명하게 */
}
</style>
