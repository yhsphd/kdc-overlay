let musicplayer_coverElement;
let musicplayer_titleElement;
let musicplayer_artistElement;
let musicplayer_progressbarElement;
let musicplayer_positionElement;
let musicplayer_lengthElement;

let musicplayer_position = 0;
let musicplayer_length = 0;

function musicplayer_getDOM() {
    try {
        musicplayer_coverElement = document.getElementsByClassName("intro-musicplayer-cover")[0];
        musicplayer_titleElement = document.getElementsByClassName("intro-musicplayer-title")[0];
        musicplayer_artistElement = document.getElementsByClassName("intro-musicplayer-artist")[0];
        musicplayer_progressbarElement = document.getElementsByClassName("intro-musicplayer-progressbar")[0];
        musicplayer_positionElement = document.getElementsByClassName("intro-musicplayer-position")[0];
        musicplayer_lengthElement = document.getElementsByClassName("intro-musicplayer-length")[0];
    } catch (e) {
        setTimeout(musicplayer_getDOM, 1000);
    }
}

musicplayer_getDOM();


//
// UI Update Functions

function updateMusicplayer(nowPlaying) {
    const npInfo = nowPlaying[nowPlaying.mode];

    musicplayer_positionElement.innerText = secondsToMMSS(nowPlaying.time);
    musicplayer_lengthElement.innerText = secondsToMMSS(npInfo.length);
    musicplayer_progressbarElement.style.width = nowPlaying.time / npInfo.length * 100 + "%";

    if (nowPlaying.mode === "fb2k") {
        musicplayer_coverElement.src = npInfo.cover + "?" + new Date().getTime();
    } else if (npInfo.background) {
        musicplayer_coverElement.src = npInfo.background;
    } else {
        musicplayer_coverElement.src = "none";
    }

    if (npInfo.title) {
        musicplayer_titleElement.innerText = npInfo.title;
    }
    if (npInfo.artist) {
        musicplayer_artistElement.innerText = npInfo.artist;
    }
}


//
// Update Function

function musicplayer_update() {
    updateMusicplayer(overlayData.now_playing);
}

setInterval(musicplayer_update, 100);
setInterval(musicplayer_getDOM, 2000);