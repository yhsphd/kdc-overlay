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
    musicplayer_positionElement.innerText = secondsToMMSS(nowPlaying.time.position);
    musicplayer_lengthElement.innerText = secondsToMMSS(nowPlaying.time.length);
    musicplayer_progressbarElement.style.width = nowPlaying.time.position / nowPlaying.time.length * 100 + "%";

    if (nowPlaying.images.cover) {
        musicplayer_coverElement.src = nowPlaying.images.cover + "?" + new Date().getTime();
    } else if (nowPlaying.images.background) {
        musicplayer_coverElement.src = nowPlaying.images.background;
    }

    if (nowPlaying.metadata.title) {
        musicplayer_titleElement.innerText = nowPlaying.metadata.title;
    }
    if (nowPlaying.metadata.artist) {
        musicplayer_artistElement.innerText = nowPlaying.metadata.artist;
    }
}


//
// Update Function

function musicplayer_update() {
    updateMusicplayer(overlayData.now_playing);
}

setInterval(musicplayer_update, 100);
setInterval(musicplayer_getDOM, 2000);