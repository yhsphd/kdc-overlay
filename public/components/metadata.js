let metadata_element;
let metadata_phaseElement;
let metadata_indexElement;
let metadata_mapCodeElement;
let metadata_bgElement;
let metadata_valueElements;

/**
 * metadata_valueElements index
 *
 * 0-Title     1-Artist    2-Mapper    3-Difficulty
 * 4-CS        5-AR        6-OD        7-HP
 * 8-SR        9-Length    10-BPM
 */

function metadata_getDOM() {
  try {
    metadata_element = document.getElementsByClassName("metadata")[0];
    metadata_phaseElement =
      document.getElementsByClassName("metadata-phase")[0];
    metadata_indexElement =
      document.getElementsByClassName("metadata-index")[0];
    metadata_mapCodeElement =
      document.getElementsByClassName("metadata-map")[0];
    metadata_bgElement = document.getElementsByClassName("metadata-bg")[0];
    metadata_valueElements = Array.from(
      document.getElementsByClassName("metadata-value")
    );
    [0, 1, 2, 3].forEach((i) => {
      // overflowScroll values are nested
      metadata_valueElements[i] =
        metadata_valueElements[i].getElementsByTagName("span")[0];
    });
  } catch (e) {
    setTimeout(metadata_getDOM, 1000);
  }

  if (
    !metadata_element ||
    !metadata_phaseElement ||
    !metadata_indexElement ||
    !metadata_mapCodeElement ||
    !metadata_bgElement ||
    !metadata_valueElements
  ) {
    setTimeout(metadata_getDOM, 1000);
  }
}

metadata_getDOM();

//
// Utils

function getMapIndex(overlayData) {
  const currentPhaseOrder =
    overlayData.progress.phases[overlayData.progress.phase - 1].order;

  if (overlayData.type === "showcase") {
    const mappoolCount = Object.keys(overlayData.mappool).length;

    if (overlayData.now_playing.osu.code === "TB") {
      return [mappoolCount, mappoolCount];
    } else {
      const mods = ["NM", "HD", "HR", "DT", "FM", "FcM"];
      let index = 0;

      for (let i = 0; i < mods.length; i++) {
        for (let j = 1; overlayData.mappool.hasOwnProperty(mods[i] + j); j++) {
          index++;
          if (overlayData.now_playing.osu.code === mods[i] + j) {
            return [index, mappoolCount];
          }
        }
      }
    }
  } else if (overlayData.type === "match") {
    let banCount = 0;
    for (let i = 0; i < currentPhaseOrder.length; i++) {
      if (currentPhaseOrder[i].pick === 0) {
        // don't count bans
        banCount++;
      } else if (
        currentPhaseOrder[i].code === overlayData.now_playing.osu.code
      ) {
        return [i + 1 - banCount, currentPhaseOrder.length - banCount];
      }
    }
  }
  return false;
}

//
// UI Update Functions
function updateMetadata(overlayData) {
  metadata_bgElement.style.backgroundImage = `url("${overlayData.now_playing.osu.cover}")`;

  if (overlayData.now_playing.osu.code) {
    // Current map is a mappool
    metadata_mapCodeElement.style.opacity = 1;
    metadata_mapCodeElement.innerText = overlayData.now_playing.osu.code;
    if (overlayData.now_playing.osu.code.startsWith("NM")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--green)";
      metadata_mapCodeElement.style.color = "white";
    } else if (overlayData.now_playing.osu.code.startsWith("HD")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--yellow)";
      metadata_mapCodeElement.style.color = "black";
    } else if (overlayData.now_playing.osu.code.startsWith("HR")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--red)";
      metadata_mapCodeElement.style.color = "white";
    } else if (overlayData.now_playing.osu.code.startsWith("DT")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--purple)";
      metadata_mapCodeElement.style.color = "white";
    } else if (overlayData.now_playing.osu.code.startsWith("FM")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--blue)";
      metadata_mapCodeElement.style.color = "white";
    } else if (overlayData.now_playing.osu.code.startsWith("FcM")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--orange)";
      metadata_mapCodeElement.style.color = "white";
    } else if (overlayData.now_playing.osu.code.startsWith("TB")) {
      metadata_mapCodeElement.style.backgroundColor = "var(--black)";
      metadata_mapCodeElement.style.color = "white";
    }

    const mapIndex = getMapIndex(overlayData);
    if (overlayData.type === "match") {
      // phase
      metadata_phaseElement.style.opacity = 1;
      metadata_phaseElement.innerText = "Phase " + overlayData.progress.phase;

      // map index
      if (mapIndex) {
        // index found
        metadata_indexElement.style.opacity = 1;
        metadata_indexElement.innerText = `Map ${mapIndex[0]} of ${mapIndex[1]}`;
      } else {
        metadata_element.style.backgroundColor = "var(--white)";
        metadata_indexElement.style.opacity = 0;
      }

      // picked team metadata background
      metadata_element.style.backgroundColor = "var(--white)";
      if (overlayData.now_playing.osu.code !== "TB") {
        overlayData.progress.phases[
          overlayData.progress.phase - 1
        ].order.forEach((pick) => {
          if (
            overlayData.now_playing.osu.code === pick.code &&
            pick.pick === 1
          ) {
            metadata_element.style.backgroundColor =
              pick.team === overlayData.teams[0].name
                ? "var(--red)"
                : "var(--blue)";
          }
        });
      }
    } else if (overlayData.type === "showcase") {
      metadata_indexElement.style.opacity = 0; // not using index element
      metadata_element.style.backgroundColor = "var(--white)"; // always grey metadata background

      // map index
      if (mapIndex) {
        metadata_phaseElement.style.opacity = 1; // show map index on phaseElement when showcasing
        metadata_phaseElement.innerText = `Map ${mapIndex[0]} of ${mapIndex[1]}`;
      } else {
        metadata_phaseElement.style.opacity = 0;
      }
    }
  } else {
    // playing non-mappool
    metadata_element.style.backgroundColor = "var(--white)";
    metadata_phaseElement.style.opacity = 0;
    metadata_indexElement.style.opacity = 0;
    metadata_mapCodeElement.style.opacity = 0;
  }

  const useModified = !(
    overlayData.now_playing.osu.code.startsWith("FM") ||
    overlayData.now_playing.osu.code.startsWith("FcM") ||
    overlayData.now_playing.osu.code.startsWith("TB")
  );

  let stats;
  if (useModified) {
    stats = {
      cs: overlayData.now_playing.osu.stats.modified.cs,
      ar: overlayData.now_playing.osu.stats.modified.ar,
      od: overlayData.now_playing.osu.stats.modified.od,
      hp: overlayData.now_playing.osu.stats.modified.hp,
      sr: overlayData.now_playing.osu.stats.modified.sr,
      length: overlayData.now_playing.osu.stats.modified.length,
      bpm: overlayData.now_playing.osu.stats.modified.bpm,
    };
  } else {
    stats = {
      cs: overlayData.now_playing.osu.stats.cs,
      ar: overlayData.now_playing.osu.stats.ar,
      od: overlayData.now_playing.osu.stats.od,
      hp: overlayData.now_playing.osu.stats.hp,
      sr: overlayData.now_playing.osu.stats.sr,
      length: overlayData.now_playing.osu.stats.length,
      bpm: overlayData.now_playing.osu.stats.bpm,
    };
  }

  const values = [
    overlayData.now_playing.osu.title,
    overlayData.now_playing.osu.artist,
    overlayData.now_playing.osu.mapper,
    overlayData.now_playing.osu.difficulty,
    stats.cs.toFixed(1),
    stats.ar.toFixed(1),
    stats.od.toFixed(1),
    stats.hp.toFixed(1),
    stats.sr.toFixed(1),
    secondsToMMSS(stats.length / 1000),
    stats.bpm,
  ];
  for (let i = 0; i < metadata_valueElements.length; i++) {
    metadata_valueElements[i].innerText = values[i];
  }
}

//
// Update Function

function metadata_update() {
  updateMetadata(overlayData);
}

setInterval(metadata_update, 500);
