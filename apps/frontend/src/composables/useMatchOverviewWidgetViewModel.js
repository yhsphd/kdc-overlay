import { computed } from "vue";
import { useMatchProgressModel } from "./useMatchProgressModel";

export function useMatchOverviewWidgetViewModel() {
  const { phases, bo, activeInd } = useMatchProgressModel();

  const getLayout = (order) => {
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

  const layoutPhases = computed(() => {
    return phases.value.map((phase) => ({
      ...phase,
      layout: getLayout(phase.order),
    }));
  });

  return {
    bo,
    activeInd,
    layoutPhases,
  };
}
