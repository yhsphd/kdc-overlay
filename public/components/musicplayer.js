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

    if (!musicplayer_coverElement || !musicplayer_titleElement || !musicplayer_artistElement || !musicplayer_progressbarElement || !musicplayer_positionElement || !musicplayer_lengthElement) {
        setTimeout(musicplayer_getDOM, 1000);
    }
}

musicplayer_getDOM();


//
// UI Update Functions

let tempTitle, tempArtist;

function updateMusicplayer(nowPlaying) {
    const npInfo = nowPlaying[nowPlaying.mode];

    if (npInfo.title) {
        musicplayer_titleElement.innerText = npInfo.title;
    }
    if (npInfo.artist) {
        musicplayer_artistElement.innerText = npInfo.artist;
    }

    if (nowPlaying.mode === "fb2k") {
        musicplayer_positionElement.innerText = secondsToMMSS(npInfo.time / 1000);
        musicplayer_lengthElement.innerText = secondsToMMSS(npInfo.length / 1000);
        musicplayer_progressbarElement.style.width = npInfo.time / npInfo.length * 100 + "%";
        if (tempTitle !== npInfo.title || tempArtist !== npInfo.artist) {
            musicplayer_coverElement.style.backgroundImage = `url("${npInfo.cover + "?" + new Date().getTime()}")`;
            tempTitle = npInfo.title;
            tempArtist = npInfo.artist;
        }
    } else {
        musicplayer_positionElement.innerText = secondsToMMSS(npInfo.time / 1000);
        musicplayer_lengthElement.innerText = secondsToMMSS(npInfo.stats.length / 1000);
        musicplayer_progressbarElement.style.width = npInfo.time / npInfo.stats.length * 100 + "%";
        musicplayer_coverElement.style.backgroundImage = `url("${npInfo.background}")`;
        tempTitle = npInfo.title;
        tempArtist = npInfo.artist;
    }
}


//
// Update Function

function musicplayer_update() {
    updateMusicplayer(overlayData.now_playing);
}

setInterval(musicplayer_update, 100);
setInterval(musicplayer_getDOM, 2000);