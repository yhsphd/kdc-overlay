import { computed } from "vue";
import { useOverlayDataStore } from "@/socket";
import { splitCode } from "@/assets/main.js";
import { useMatchProgressModel } from "./useMatchProgressModel";

export function useMapListViewModel() {
  const store = useOverlayDataStore();
  const { unavailableMapCodes } = useMatchProgressModel();

  const mappool = computed(() => store.data?.mappool || []);

  const maps = computed(() => {
    const data = [];
    mappool.value.forEach((map) => {
      const splittedCode = splitCode(map.code);
      data.push({
        code: map.code,
        mod: splittedCode[0],
        i: splittedCode[1],
        title: map.title,
        artist: map.artist,
        mapper: map.mapper,
        last: false,
        id: map.map_id,
        setId: map.mapset_id,
      });
    });

    for (let i = 0; i < data.length; i++) {
      if (i === data.length - 1 || data[i].mod !== data[i + 1].mod) {
        data[i].last = true;
      }
    }
    return data;
  });

  const columns = computed(() => {
    let columns = []; // Array of column
    let column = []; // Array of maps

    for (let i = 0; i < maps.value.length; i++) {
      let currentMod = maps.value[i].mod;

      // TB will be added at the end of DTs
      if (currentMod !== "TB") {
        column.push(maps.value[i]);
      }

      // Line Break Condition 1: not the last map
      if (i !== maps.value.length - 1) {
        let nextMod = maps.value[i + 1].mod;

        if (
          currentMod !== nextMod && // Condition 2: mod changed
          !(currentMod === "HD" && nextMod === "HR") && // Condition 3: HDs and HRs should be in the same column
          !(currentMod === "FM" && nextMod === "FcM") // Condition 4: same for FMs and FcMs
        ) {
          // Add TB at the end of DTs before proceeding to the next column
          if (currentMod === "DT" && maps.value.slice(-1)[0].mod === "TB") {
            column.push(maps.value.slice(-1)[0]);
          }

          // Column completed
          columns.push(column.slice());
          column = [];
        }
      }
    }
    // Push remaining column if exists
    if (column.length !== 0) {
      columns.push(column.slice());
    }

    return columns;
  });

  const isUnavailable = (map) => unavailableMapCodes.value.includes(map.code);

  return {
    columns,
    isUnavailable,
  };
}
