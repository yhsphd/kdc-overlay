let mapCompactElements;
let mapCompact_pickElements;
let mapCompact_codeElements;
let mapCompact_winTextElements;
let mapCompact_circleElements;
let mapCompact_playIcon;

function mapCompact_getDOM() {
    try {
        mapCompactElements = document.getElementsByClassName("lobby-mapCompact");
        mapCompact_pickElements = document.getElementsByClassName("lobby-mapCompact-pick");
        mapCompact_codeElements = document.getElementsByClassName("lobby-mapCompact-map");
        mapCompact_winTextElements = document.getElementsByClassName("lobby-mapCompact-winText");
        mapCompact_circleElements = document.querySelector(".lobby-mapCompact>.circle");
        mapCompact_playIcon = document.getElementsByClassName("lobby-mapCompact-play");
    } catch (e) {
        setTimeout(mapCompact_getDOM, 1000);
    }
}

mapCompact_getDOM();


//
// UI Update Functions

function mapCompact_showMapCompacts(hide = false) {
    if (!hide) {    // show mapCompact
        lobby_showLeaderboard(true);
        setTimeout(() => {
            for (let i = 0; i < mapCompactElements.length; i++) {
                setTimeout(() => {
                    mapCompactElements[i].style.transform = "";
                }, 100 * i);
            }
        }, 1000);
    } else {    // hide mapCompact
        for (let i = 0; i < mapCompactElements.length; i++) {
            setTimeout(() => {
                mapCompactElements[i].style.transform = "translateX(-100%)";
            }, 100 * i);
        }
    }
}

function mapCompact_clearMapCompact() {
    for (; mapCompactElements.length > 0;) {
        mapCompactElements[0].remove();
    }
    mapCompact_getDOM();
}

function mapCompact_regenMapCompacts(currentPhaseOrder, element2add2) {
    mapCompact_clearMapCompact();
    fetch("/components/lobby-mapcompact.html")
        .then((response) => response.text())
        .then((text) => {
            for (let i = 0; i < currentPhaseOrder.length; i++) {
                element2add2.innerHTML += text;
            }
        });
    mapCompact_getDOM();
}

function mapCompact_updateInfo(teams, currentPhaseOrder) {
    let ban = 0;
    for (let i = 0; i < currentPhaseOrder.length; i++) {
        if (currentPhaseOrder[i].pick === 0) {
            ban++;
        } else if (currentPhaseOrder[i].pick === -1) {
        } else {
            if (currentPhaseOrder[i].team === teams[0].name) {
                mapCompact_pickElements[i - ban].style.backgroundColor = "var(--red)"
            } else if (currentPhaseOrder[i - ban].team === teams[1].name) {
                mapCompact_pickElements[i - ban].style.backgroundColor = "var(--blue)"
            } else {
                mapCompact_pickElements[i - ban].style.backgroundColor = "var(--white)";
            }

            mapCompact_codeElements[i - ban].innerText = currentPhaseOrder[i].code;

            if ((currentPhaseOrder[i - 1].win || i === 0) && !currentPhaseOrder[i].win) {   // now playing
                mapCompact_winTextElements[i - ban].style.opacity = 0;
                mapCompact_circleElements[i - ban].style.backgroundColor = "var(--white)";
                mapCompact_playIcon[i - ban].style.opacity = 1;
            } else {
                if (currentPhaseOrder[i].win === teams[0].name) {           // red win
                    mapCompact_winTextElements[i - ban].style.opacity = 1;
                    mapCompact_circleElements[i - ban].style.backgroundColor = "var(--red)";
                    mapCompact_playIcon[i - ban].style.opacity = 0;
                } else if (currentPhaseOrder[i].win === teams[1].name) {    // blue win
                    mapCompact_winTextElements[i - ban].style.opacity = 1;
                    mapCompact_circleElements[i - ban].style.backgroundColor = "var(--blue)";
                    mapCompact_playIcon[i - ban].style.opacity = 0;
                } else {                                                    // yet to be played
                    mapCompact_winTextElements[i - ban].style.opacity = 0;
                    mapCompact_circleElements[i - ban].style.opacity = 0;
                    mapCompact_playIcon[i - ban].style.opacity = 0;
                }
            }
        }
    }
}


//
// Update Function

let currentPhaseOrder;
let phase, matchCode, mappoolName;

function mapCompact_updateMapCompact(overlayData, leftBoxElement) {
    currentPhaseOrder = overlayData.progress.phases[overlayData.progress.phase - 1].order;

    if (phase !== overlayData.progress.phase || matchCode !== overlayData.match_code || mappoolName !== overlayData.mappool_name) {
        phase = overlayData.progress.phase;
        matchCode = overlayData.match_code;
        mappoolName = overlayData.mappool_name;

        mapCompact_regenMapCompacts(currentPhaseOrder, leftBoxElement);
    } else {
        mapCompact_updateInfo(overlayData.teams, currentPhaseOrder);
    }
}

mapCompact_showMapCompacts(true);