import { computed } from "vue";
import { useMatchProgressModel } from "./useMatchProgressModel";
import { useOverlayDataStore } from "@/socket";
import { getMappool } from "@/assets/main.js";

export function usePhaseOverviewViewModel() {
  const store = useOverlayDataStore();
  const { phases, activeInd } = useMatchProgressModel();

  const mappoolData = computed(() => store.data?.mappool || []);

  const allPhases = computed(() => {
    const data = [];

    for (let i = 0; i < phases.value.length; i++) {
      const phaseObj = phases.value[i];
      if (!phaseObj || !phaseObj.label) continue;

      // Include all items to show empty slots
      const validItems = phaseObj.order;

      if (validItems && validItems.length > 0) {
        data.push({
          label: phaseObj.label,
          bans: validItems
            .filter((item) => item.pick === 0)
            .map((item) => ({
              ...item,
              artistTitle: item.code
                ? getMappool(mappoolData.value, item.code)?.artist +
                  " - " +
                  getMappool(mappoolData.value, item.code)?.title
                : "",
            })),
          picks: validItems
            .filter((item) => item.pick === 1)
            .map((item) => ({
              ...item,
              artistTitle: item.code
                ? getMappool(mappoolData.value, item.code)?.artist +
                  " - " +
                  getMappool(mappoolData.value, item.code)?.title
                : "",
            })),
          items: validItems.map((item) => {
            const map = item.code ? getMappool(mappoolData.value, item.code) : null;
            return {
              ...item,
              artistTitle: map && map.artist ? `${map.artist} - ${map.title}` : "",
            };
          }),
        });
      }
    }
    return data;
  });

  const idlePhases = computed(() => {
    return allPhases.value.filter((p) => {
      const lb = p.label.toLowerCase();
      return !lb.includes("tiebreaker") && lb !== "tb";
    });
  });

  const currentPhase = computed(() => {
    if (idlePhases.value.length === 0) return null;
    const maxInd = activeInd.value >= 0 ? activeInd.value : phases.value.length - 1;
    // activeInd에 해당하는 Phase 라벨과 일치하거나, 가장 최신(마지막) 유효 phase를 찾음
    const activeObj = phases.value[maxInd];
    if (activeObj) {
      const match = idlePhases.value.find((p) => p.label === activeObj.label);
      if (match) return match;
    }
    return idlePhases.value[idlePhases.value.length - 1];
  });

  return {
    allPhases,
    idlePhases,
    currentPhase,
  };
}
