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

  return {
    progress,
    phases,
    bo,
    activeInd,
    unavailableMapCodes,
  };
}
