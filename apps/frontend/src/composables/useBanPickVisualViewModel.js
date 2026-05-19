import { computed, ref, watch } from "vue";
import { useOverlayDataStore } from "@/socket";
import { useMatchProgressModel } from "./useMatchProgressModel";
import { getMappool } from "@/assets/main.js";

export function useBanPickVisualViewModel() {
  const store = useOverlayDataStore();
  const { phases, activeInd, getMatchLayout } = useMatchProgressModel();

  const viewIndex = ref(0);

  // activeInd가 변하면 뷰를 해당 페이지로 변경 (ex. 백엔드에서 phase 변경됨)
  watch(
    activeInd,
    (newVal) => {
      if (newVal >= 0 && newVal < phases.value.length) {
        viewIndex.value = newVal + 1; // 더미 페이지를 고려해 +1
      }
    },
    { immediate: true }
  );

  const prevPage = () => {
    if (viewIndex.value > 1) viewIndex.value--;
  };

  const nextPage = () => {
    if (viewIndex.value < phases.value.length) viewIndex.value++;
  };

  const setPage = (index) => {
    if (index >= 0 && index < phases.value.length) {
      viewIndex.value = index + 1;
    }
  };

  const pointsFromSheet = computed(() => {
    const data = [0, 0];
    const allPhases = store.data?.progress?.phases || [];

    for (let i = 0; i < allPhases.length; i++) {
      for (let j = 0; j < allPhases[i].order.length; j++) {
        if (allPhases[i].order[j].win === 0 || allPhases[i].order[j].win === 1) {
          data[allPhases[i].order[j].win]++;
        }
      }
    }
    return data;
  });

  const getLayoutForPhase = (order) => {
    const baseLayout = getMatchLayout(order);
    let foundWaiting = false;

    const items = baseLayout.items.map((item) => {
      // Visibility Logic
      let visibility = 0;
      if (item.code && item.code.length > 0) {
        visibility = 2; // Decided
      } else {
        if (!foundWaiting && item.team !== -1) {
          visibility = 1; // Waiting
          foundWaiting = true;
        } else {
          visibility = 0; // Future
        }
      }

      const mappoolData = item.code ? getMappool(store.data?.mappool, item.code) : null;

      return {
        ...item,
        visibility,
        mapSetId: mappoolData?.mapset_id || null,
        pickBan: item.pick, // 0 for Ban, 1 for Pick
      };
    });

    return {
      items: items.filter((i) => i.team !== -1), // Only keep valid turn blocks
      itemsRaw: items,
      maxX: baseLayout.maxX,
    };
  };

  const displayPhases = computed(() => {
    return phases.value.map((phase) => ({
      ...phase,
      layout: getLayoutForPhase(phase.order),
    }));
  });

  return {
    teams: computed(() => store.data?.teams || []),
    viewIndex,
    phases: displayPhases,
    prevPage,
    nextPage,
    setPage,
    pointsFromSheet,
  };
}
