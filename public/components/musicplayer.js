let musicplayer_coverElements = document.getElementsByClassName("intro-musicplayer-cover");
let musicplayer_titleElements = document.getElementsByClassName("intro-musicplayer-title");
let musicplayer_artistElements = document.getElementsByClassName("intro-musicplayer-artist");
let musicplayer_progressbarElements = document.getElementsByClassName("intro-musicplayer-progressbar");
let musicplayer_positionElements = document.getElementsByClassName("intro-musicplayer-position");
let musicplayer_lengthElements = document.getElementsByClassName("intro-musicplayer-length");

let musicplayer_position = 0;
let musicplayer_length = 0;

function musicplayer_update(params) {
    const cover = params.hasOwnProperty("cover") ? params.cover : "";
    const title = params.hasOwnProperty("title") ? params.title : "";
    const artist = params.hasOwnProperty("artist") ? params.artist : "";
    if (params.hasOwnProperty("position")) {
        musicplayer_position = params.position;
    }
    if (params.hasOwnProperty("length")) {
        musicplayer_length = params.length;
    }

    if (cover !== "") {
        console.log("update cover!");
        musicplayer_coverElements.forEach(function (element) {
            element.src = cover;
        });
    }
    if (title !== "") {
        console.log("update title!");
        musicplayer_titleElements.forEach(function (element) {
            element.innerText = title;
        });
    }
    if (artist !== "") {
        console.log("update artist!");
        musicplayer_artistElements.forEach(function (element) {
            element.innerText = artist;
        });
    }
    musicplayer_positionElements.forEach(function (element) {
        element.innerText = secondsToMMSS(musicplayer_position);
    });
    musicplayer_lengthElements.forEach(function (element) {
        element.innerText = secondsToMMSS(musicplayer_length)
    });
    musicplayer_progressbarElements.forEach(function (element) {
        element.style.width = musicplayer_position / musicplayer_length * 100 + "%";
    })
}