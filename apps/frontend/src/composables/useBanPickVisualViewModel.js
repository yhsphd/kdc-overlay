import { computed, ref, watch } from "vue";
import { useOverlayDataStore } from "@/socket";
import { useMatchProgressModel } from "./useMatchProgressModel";
import { getMappool } from "@/assets/main.js";

// Global Shared State for BanPick View
const viewIndex = ref(0);
const manualTimeoutSec = 5;
let manualTimeoutId = null;
const isManualOverride = ref(false);

export function useBanPickVisualViewModel() {
  const store = useOverlayDataStore();
  const { phases, activeInd, getMatchLayout } = useMatchProgressModel();

  const resetManualOverride = () => {
    isManualOverride.value = false;
    if (activeInd.value >= 0 && activeInd.value < phases.value.length) {
      viewIndex.value = activeInd.value; // Sync back to backend phase
    }
    if (manualTimeoutId) {
      clearTimeout(manualTimeoutId);
      manualTimeoutId = null;
    }
  };

  const triggerManualOverride = () => {
    isManualOverride.value = true;
    if (manualTimeoutId) {
      clearTimeout(manualTimeoutId);
    }
    manualTimeoutId = setTimeout(() => {
      resetManualOverride();
    }, manualTimeoutSec * 1000); // Revert after set timeout
  };

  // activeInd가 변하면 뷰를 해당 페이지로 변경 (ex. 백엔드에서 phase 변경됨)
  watch(
    activeInd,
    () => {
      // Upon backend change, immediately cancel manual override and sync
      resetManualOverride();
    },
    { immediate: true }
  );

  // User scrolling the carousel changes viewIndex via v-model
  watch(viewIndex, (newVal) => {
    // If it differs from the backend active phase and it wasn't just auto-synced
    if (newVal !== activeInd.value) {
      triggerManualOverride();
    }
  });

  const prevPage = () => {
    if (viewIndex.value > 0) {
      viewIndex.value--;
    }
  };

  const nextPage = () => {
    if (viewIndex.value < phases.value.length - 1) {
      viewIndex.value++;
    }
  };

  const setPage = (index) => {
    if (index >= 0 && index < phases.value.length) {
      viewIndex.value = index;
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

  const getLayoutForPhase = (order, isActivePhase, isTB) => {
    const baseLayout = getMatchLayout(order);

    let foundWaiting = false;
    const items = baseLayout.items.map((item) => {
      // Visibility Logic
      let visibility = 0;
      if (item.code && item.code.length > 0) {
        visibility = 2; // Decided
      } else {
        if (!foundWaiting && item.team !== -1 && isActivePhase) {
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
      items: isTB ? items : items.filter((i) => i.team !== -1), // 유효한 픽만 남김, TB인 경우 삭제하지 않음
      itemsRaw: items,
      maxX: baseLayout.maxX,
    };
  };

  const displayPhases = computed(() => {
    return phases.value.map((phase, index) => ({
      ...phase,
      layout: getLayoutForPhase(phase.order, index === activeInd.value, phase.label === "TB"),
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
