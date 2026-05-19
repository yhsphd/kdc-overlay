import { computed } from "vue";
import { useMatchProgressModel } from "./useMatchProgressModel";

export function useMatchOverviewWidgetViewModel() {
  const { phases, bo, activeInd, getMatchLayout } = useMatchProgressModel();

  const layoutPhases = computed(() => {
    return phases.value.map((phase) => ({
      ...phase,
      layout: getMatchLayout(phase.order),
    }));
  });

  return {
    bo,
    activeInd,
    layoutPhases,
  };
}
