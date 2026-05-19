import { computed } from "vue";
import { useOverlayDataStore } from "@/socket";

export function useMatchProgressModel() {
  const store = useOverlayDataStore();

  const progress = computed(() => store.data?.progress || {});
  const phases = computed(() => progress.value.phases || []);

  const bo = computed(() => store.data?.bo);
  const activeInd = computed(() => {
    const currentPhaseLabel = progress.value.phase;
    const index = phases.value.findIndex((p) => p.label === currentPhaseLabel);
    return index;
  });

  const unavailableMapCodes = computed(() =>
    phases.value
      .map((x) => x.order || [])
      .flat(1)
      .map((x) => x.code)
  );

  const getMatchLayout = (order) => {
    if (!order || order.length === 0) return { items: [], maxX: 0 };

    let x = 0;
    let prevTeam = null;

    const items = order.map((item, index) => {
      if (index === 0) {
        x = 0;
      } else {
        if (item.team !== -1 && prevTeam !== -1 && item.team === prevTeam) {
          x += 1;
        } else {
          x += 0.5;
        }
      }
      prevTeam = item.team;

      let y = 0.5;
      if (item.team === 0) y = 0;
      else if (item.team === 1) y = 1;

      return {
        ...item,
        x,
        y,
      };
    });

    return {
      items,
      maxX: items[items.length - 1].x,
    };
  };

  return {
    progress,
    phases,
    bo,
    activeInd,
    unavailableMapCodes,
    getMatchLayout,
  };
}
