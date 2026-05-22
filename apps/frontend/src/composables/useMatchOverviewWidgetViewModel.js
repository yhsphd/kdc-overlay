import { computed } from "vue";
import { useMatchProgressModel } from "./useMatchProgressModel";
import { useBanPickVisualViewModel } from "./useBanPickVisualViewModel";

export function useMatchOverviewWidgetViewModel() {
  const { phases, bo, activeInd, getMatchLayout } = useMatchProgressModel();
  const { viewIndex, setPage } = useBanPickVisualViewModel();

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
    viewIndex,
    setPage,
  };
}
