import { computed } from "vue";
import { splitCode } from "@/assets/main";

export function useDecisionBoxViewModel(props) {
  const mapData = computed(() => props.mapData || {});

  const title = computed(() => mapData.value.title || "");
  const artist = computed(() => mapData.value.artist || "");
  const mapper = computed(() => mapData.value.mapper || "");

  const stats = computed(() => {
    const s = mapData.value.stats || {};
    return {
      cs: s.cs !== undefined ? Number(s.cs).toFixed(1) : "-",
      ar: s.ar !== undefined ? Number(s.ar).toFixed(1) : "-",
      od: s.od !== undefined ? Number(s.od).toFixed(1) : "-",
      bpm: s.bpm !== undefined ? Number(s.bpm).toFixed(0) : "-",
      stars: s.sr !== undefined ? Number(s.sr).toFixed(2) : "-",
    };
  });

  const backgroundUrl = computed(() => {
    return props.mapSetId
      ? `url(https://assets.ppy.sh/beatmaps/${props.mapSetId}/covers/list@2x.jpg)`
      : null;
  });

  const isDecided = computed(() => props.visibility === 2);
  const isPending = computed(() => props.visibility === 1);
  const isDisabled = computed(() => props.visibility === -1);
  const isHidden = computed(() => props.visibility === -2);

  const mod = computed(() => {
    if (!props.code) return "";
    try {
      const [m] = splitCode(props.code);
      return m;
    } catch (e) {
      return "";
    }
  });

  const win = computed(() => props.win);
  const winTeamName = computed(() => props.winTeamName || "");

  return {
    title,
    artist,
    mapper,
    stats,
    backgroundUrl,
    isDecided,
    isPending,
    isDisabled,
    isHidden,
    mod,
    win,
    winTeamName,
  };
}
