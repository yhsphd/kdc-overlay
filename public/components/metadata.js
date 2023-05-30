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
        metadata_phaseElement = document.getElementsByClassName("metadata-phase")[0];
        metadata_indexElement = document.getElementsByClassName("metadata-index")[0];
        metadata_mapCodeElement = document.getElementsByClassName("metadata-map")[0];
        metadata_bgElement = document.getElementsByClassName("metadata-bg")[0];
        metadata_valueElements = Array.from(document.getElementsByClassName("metadata-value"));
        [0, 1, 2, 3].forEach((i) => {       // overflowScroll values are nested
            metadata_valueElements[i] = metadata_valueElements[i].getElementsByTagName("span")[0];
        })
    } catch (e) {
        setTimeout(metadata_getDOM, 1000);
    }

    if (!metadata_phaseElement || !metadata_indexElement || !metadata_mapCodeElement || !metadata_bgElement || !metadata_valueElements) {
        setTimeout(metadata_getDOM, 1000);
    }
}

metadata_getDOM();


//
// Utils

function getMapIndex(progress) {
    let currentPhrasePicks = progress.phases[progress.phase - 1].order;
    for (let i = 0; i < currentPhrasePicks.length; i++) {
        if (currentPhrasePicks[i].current) {
            return [i + 1, currentPhrasePicks.length];
        }
    }
}


//
// UI Update Functions
function updateMetadata(overlayData) {
    const showcase = overlayData.type === "showcase";

    metadata_bgElement.style.backgroundImage = `url("${overlayData.now_playing.osu.cover}")`;

    if (overlayData.now_playing.osu.code) {
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

        metadata_mapCodeElement.style.opacity = 1;
        if (showcase) {
            metadata_phaseElement.style.opacity = 1;
            metadata_phaseElement.innerText = `map ${getMapIndex(overlayData.progress).join(" of ")}`;
            metadata_indexElement.style.opacity = 0;
        } else {
            metadata_phaseElement.style.opacity = 1;
            metadata_phaseElement.innerText = `Phase ${overlayData.progress.phase}`;
            metadata_indexElement.style.opacity = 1;
            metadata_indexElement.innerText = `map ${getMapIndex(overlayData.progress).join(" of ")}`;
        }
    } else {
        metadata_phaseElement.style.opacity = 0;
        metadata_indexElement.style.opacity = 0;
        metadata_mapCodeElement.style.opacity = 0;
    }

    const values = [
        overlayData.now_playing.osu.title,
        overlayData.now_playing.osu.artist,
        overlayData.now_playing.osu.mapper,
        overlayData.now_playing.osu.difficulty,
        overlayData.now_playing.osu.stats.modified.cs.toFixed(1),
        overlayData.now_playing.osu.stats.modified.ar.toFixed(1),
        overlayData.now_playing.osu.stats.modified.od.toFixed(1),
        overlayData.now_playing.osu.stats.modified.hp.toFixed(1),
        overlayData.now_playing.osu.stats.modified.sr.toFixed(1),
        secondsToMMSS(overlayData.now_playing.osu.stats.modified.length / 1000),
        overlayData.now_playing.osu.stats.modified.bpm
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