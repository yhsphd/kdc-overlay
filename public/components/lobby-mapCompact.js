let lobby_mapCompactElements;
let lobby_mapCompact_pickElements;
let lobby_mapCompact_codeElements;
let lobby_mapCompact_winTextElements;
let lobby_mapCompact_circleElements;
let lobby_mapCompact_playIcon;

function lobby_mapCompact_getDOM() {
    try {
        lobby_mapCompactElements = document.getElementsByClassName("lobby-mapCompact");
        lobby_mapCompact_pickElements = document.getElementsByClassName("lobby-mapCompact-pick");
        lobby_mapCompact_codeElements = document.getElementsByClassName("lobby-mapCompact-map");
        lobby_mapCompact_winTextElements = document.getElementsByClassName("lobby-mapCompact-winText");
        lobby_mapCompact_circleElements = document.querySelector(".lobby-mapCompact>.circle");
        lobby_mapCompact_playIcon = document.getElementsByClassName("lobby-mapCompact-play");
    } catch (e) {
        setTimeout(lobby_mapCompact_getDOM, 1000);
    }
}
lobby_mapCompact_getDOM();


//
// UI Update Functions

function lobby_showMapCompacts(hide = false) {
    if (!hide) {    // show mapCompact
        lobby_showLeaderboard(true);
        setTimeout(() => {
            for (let i = 0; i < lobby_mapCompactElements.length; i++) {
                setTimeout(() => {
                    lobby_mapCompactElements[i].style.transform = "";
                }, 100 * i);
            }
        }, 1000);
    } else {    // hide mapCompact
        for (let i = 0; i < lobby_mapCompactElements.length; i++) {
            setTimeout(() => {
                lobby_mapCompactElements[i].style.transform = "translateX(-100%)";
            }, 100 * i);
        }
    }
}


function lobby_addMapCompact(element2add2) {
    fetch("/components/lobby-mapcompact.html")
        .then((response) => response.text())
        .then((text) => element2add2.innerHTML += text);
    lobby_mapCompact_getDOM();
}

function lobby_removeMapCompact(clear = false, index = -1) {
    if (clear) {
        for (; lobby_mapCompactElements.length > 0;) {
            lobby_mapCompactElements[0].remove();
        }
    } else {
        lobby_mapCompactElements[index].remove();
    }
    lobby_mapCompact_getDOM();
}

function lobby_updateMapCompact(index, pick) {
    if (pick[i].team === overlayData.teams[0].name) {
        lobby_mapCompact_pickElements[i].style.backgroundColor = "var(--red)"
    } else if (pick[i].team === overlayData.teams[1].name) {
        lobby_mapCompact_pickElements[i].style.backgroundColor = "var(--blue)"
    } else {
        lobby_mapCompact_pickElements[i].style.backgroundColor = "var(--white)";
    }

    lobby_mapCompact_codeElements[i].innerText = pick[i].code;

    if (pick[i].current) {  // now playing
        lobby_mapCompact_winTextElements[i].style.opacity = 0;
        lobby_mapCompact_circleElements[i].style.backgroundColor = "var(--white)";
        lobby_mapCompact_playIcon[i].style.opacity = 1;
    } else {
        if (pick[i].win === overlayData.teams[0].name) {    // red win
            lobby_mapCompact_winTextElements[i].style.opacity = 1;
            lobby_mapCompact_circleElements[i].style.backgroundColor = "var(--red)";
            lobby_mapCompact_playIcon[i].style.opacity = 0;
        } else if (pick[i].win === overlayData.teams[1].name) { // blue win
            lobby_mapCompact_winTextElements[i].style.opacity = 1;
            lobby_mapCompact_circleElements[i].style.backgroundColor = "var(--blue)";
            lobby_mapCompact_playIcon[i].style.opacity = 0;
        } else {    // yet to be played
            lobby_mapCompact_winTextElements[i].style.opacity = 0;
            lobby_mapCompact_circleElements[i].style.opacity = 0;
            lobby_mapCompact_playIcon[i].style.opacity = 0;
        }
    }
}


//
// Update Function

function lobby_mapCompact_update() {
}

setInterval(lobby_mapCompact_update, 100);

setTimeout(() => lobby_showMapCompacts(true), 2000);