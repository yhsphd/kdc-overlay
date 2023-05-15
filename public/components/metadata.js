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
        metadata_valueElements = document.getElementsByClassName("metadata-value");
    } catch (e) {
        setTimeout(metadata_getDOM, 1000);
    }
}

metadata_getDOM();


//
// Utils
function getMapIndex(progress) {
    let currentPhrasePicks = progress.phases[progress.phase - 1].pick;
    for (let i = 0; i < currentPhrasePicks.length; i++) {
        if (currentPhrasePicks[i].current) {
            return [i + 1, currentPhrasePicks.length];
        }
    }
}


//
// UI Update Functions

function updateMetadata(overlayData) {
    metadata_phaseElement.innerText = `Phase ${overlayData.progress.phase}`;
    metadata_indexElement.innerText = `map ${getMapIndex(overlayData.progress).join(" of ")}`;
    metadata_mapCodeElement.innerText = overlayData.now_playing.osu.code;
    metadata_bgElement.style.backgroundImage = `url("${overlayData.now_playing.osu.background}")`;
    const values = [
        overlayData.now_playing.osu.title,
        overlayData.now_playing.osu.artist,
        overlayData.now_playing.osu.mapper,
        overlayData.now_playing.osu.difficulty,
        overlayData.now_playing.osu.stats.modified.cs,
        overlayData.now_playing.osu.stats.modified.ar,
        overlayData.now_playing.osu.stats.modified.od,
        overlayData.now_playing.osu.stats.modified.hp,
        overlayData.now_playing.osu.stats.modified.sr,
        secondsToMMSS(overlayData.now_playing.osu.stats.modified.length),
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