let mappool_phaseElement = document.getElementById("phase");
let mappool_teamInfoElements = document.getElementsByClassName("teamInfoBox");
let mappool_teamPlayersElements = document.getElementsByClassName("teamPlayersBox");

let mappool_offsetElements = document.getElementsByClassName("mappool-pickBoxRowStartOffset");
let mappool_pickBoxElements;

function mappool_pickedMaps_getDOM() {
    try {
        mappool_pickBoxElements = document.getElementsByClassName("mappool-pickBox");
    } catch (e) {
        setTimeout(mappool_pickedMaps_getDOM, 1000);
    }
}

mappool_pickedMaps_getDOM();

let mappool_mapElements;

function mappool_maps_getDOM() {
    try {
        mappool_mapElements = document.getElementsByClassName("mappool-map");
    } catch (e) {
        setTimeout(mappool_maps_getDOM, 1000);
    }
}

mappool_maps_getDOM();

let mappool_bracketElement = document.getElementById("bracket");
let mappool_matchCodeElement = document.getElementById("matchCode");
let mappool_chatBoxElement = document.getElementById("chatBox");

let order, pickOrder, banOrder;


//
// Utils

function mappool_alterPickBoxVisibility(index, mode, reset) {
    const element = mappool_pickBoxElements[index];

    if (mode === 0) {           // pick/ban able
        element.style.opacity = 1;
        element.getElementsByClassName("mappool-pickBox-slash")[0].style.opacity = 0;
        if (reset) {
            mappool_resetPickBox(element);
        }
    } else if (mode === 1) {    // disable, slash out
        element.style.opacity = 1;
        element.getElementsByClassName("mappool-pickBox-slash")[0].style.opacity = 1;
        mappool_resetPickBox(element);
    } else if (mode === 2) {    // hide
        element.style.opacity = 0;
    }
}

function mappool_resetPickBox(element) {
    element.style.backgroundImage = "none";
    element.getElementsByClassName("mappool-pickBox-loading")[0].style.opacity = 0;
    element.getElementsByClassName("mappool-pickBox-code")[0].innerText = "";
    element.getElementsByClassName("mappool-pickBox-banpick")[0].innerText = "";
}

/**
 * @param {number} index - index of the pickBox
 * @param {number} mode - 0:blank the pickBox, 1:show loading, 2:picked, 3:banned
 * @param {string} image - url to the background image of the map
 */
function mappool_editPickBoxContent(index, mode, code, image) {
    const element = mappool_pickBoxElements[index];

    if (mode === 0) {                       // blank state

    } else if (mode === 1) {                // picking a map
        element.getElementsByClassName("mappool-pickBox-loading")[0].style.opacity = 1;
        element.getElementsByClassName("mappool-pickBox-code")[0].innerText = "";
        element.getElementsByClassName("mappool-pickBox-banpick")[0].innerText = "";
    } else if (mode === 2 || mode === 3) {  // picked or banned a map
        element.getElementsByClassName("mappool-pickBox-loading")[0].style.opacity = 0;
        element.getElementsByClassName("mappool-pickBox-code")[0].innerText = code;
        element.getElementsByClassName("mappool-pickBox-banpick")[0].innerText = mode === 1 ? "PICK" : "BAN";
        element.style.backgroundImage = mode === 1 ? `url('${image}')` : "none";
    }
}


//
// UI Update Functions

function mappool_updatePhase(progress) {
    mappool_phaseElement.innerText = "Phase " + progress.phase;
}

function mappool_updateMatchInfo(overlayData) {
    mappool_bracketElement.innerText = overlayData.bracket;
    mappool_matchCodeElement.innerText = overlayData.match_code;
}

function mappool_updateTeams(teams) {
    for (let i = 0; i < 2; i++) {
        let acronymElement = mappool_teamInfoElements[i].getElementsByClassName("acronym")[0];
        let teamNameElement = mappool_teamInfoElements[i].getElementsByClassName("mappool-teamName")[0];
        acronymElement.innerText = teams[i].acronym;
        teamNameElement.innerText = teams[i].name;
        let pfpElements = mappool_teamPlayersElements[i].getElementsByClassName("mappool-pfp");
        let nickElements = mappool_teamPlayersElements[i].getElementsByClassName("mappool-nick");
        for (let j = 0; j < 2; j++) {
            pfpElements[j].src = "https://a.ppy.sh/" + teams[i].players[j].id;
            nickElements[j].innerText = teams[i].players[j].nick;
        }
    }
}

function mappool_arrangePickBoxes(overlayData) {
    let hide, crossOut, ban, pick;
    const firstPick = teamName2color(overlayData, 0, overlayData.progress.phases[overlayData.progress.phase - 1].first_pick);

    if (firstPick === "red") {
        mappool_offsetElements[0].style.width = "105px";
        mappool_offsetElements[1].style.width = "0px";
        mappool_offsetElements[2].style.width = "0px";
        mappool_offsetElements[3].style.width = "105px";
    } else if (firstPick === "blue") {
        mappool_offsetElements[0].style.width = "0px";
        mappool_offsetElements[1].style.width = "105px";
        mappool_offsetElements[2].style.width = "105px";
        mappool_offsetElements[3].style.width = "0px";
    }

    if (firstPick === "red") {
        if (overlayData.bo === 9) {
            if (overlayData.progress.phase === 1) {
                hide = [5, 10];
                crossOut = [0, 2, 7, 11];
                ban = [3, 1];
                pick = [4, 8, 9, 6];
            } else if (overlayData.progress.phase === 2) {
                hide = [5, 10];
                crossOut = [0, 2, 7, 11];
                ban = [3, 1];
                pick = [4, 8, 9, 6];
            }
        } else if (overlayData.bo === 11) {
            if (overlayData.progress.phase === 1) {
                hide = [5, 10];
                crossOut = [0, 2, 7, 11];
                ban = [3, 1];
                pick = [4, 8, 9, 6];
            } else if (overlayData.progress.phase === 2) {
                hide = [5, 10];
                crossOut = [0, 2];
                ban = [3, 1];
                pick = [4, 8, 9, 6, 7, 11];
            }
        } else if (overlayData.bo === 13) {
            if (overlayData.progress.phase === 1) {
                hide = [5, 10];
                crossOut = [];
                ban = [2, 0, 3, 1];
                pick = [4, 8, 9, 6, 7, 11];
            } else if (overlayData.progress.phase === 2) {
                hide = [5, 10];
                crossOut = [0, 2];
                ban = [3, 1];
                pick = [4, 8, 9, 6, 7, 11];
            }
        }
    } else if (firstPick === "blue") {
        if (overlayData.bo === 9) {
            if (overlayData.progress.phase === 1) {
                hide = [6, 9];
                crossOut = [0, 2, 7, 11];
                ban = [1, 3];
                pick = [8, 4, 5, 10];
            } else if (overlayData.progress.phase === 2) {
                hide = [6, 9];
                crossOut = [0, 2, 7, 11];
                ban = [1, 3];
                pick = [8, 4, 5, 10];
            }
        } else if (overlayData.bo === 11) {
            if (overlayData.progress.phase === 1) {
                hide = [6, 9];
                crossOut = [0, 2, 7, 11];
                ban = [1, 3];
                pick = [8, 4, 5, 10];
            } else if (overlayData.progress.phase === 2) {
                hide = [6, 9];
                crossOut = [0, 2];
                ban = [1, 3];
                pick = [8, 4, 5, 10, 11, 7];
            }
        } else if (overlayData.bo === 13) {
            if (overlayData.progress.phase === 1) {
                hide = [6, 9];
                crossOut = [];
                ban = [0, 2, 1, 3];
                pick = [8, 4, 5, 10, 11, 7];
            } else if (overlayData.progress.phase === 2) {
                hide = [6, 9];
                crossOut = [0, 2];
                ban = [1, 3];
                pick = [8, 4, 5, 10, 11, 7];
            }
        }
    }

    hide.forEach((index) => {
        mappool_alterPickBoxVisibility(index, 2, true);
    });
    crossOut.forEach((index) => {
        mappool_alterPickBoxVisibility(index, 1, true);
    });
    pick.forEach((index) => {
        mappool_alterPickBoxVisibility(index, 0, true);
    });
    ban.forEach((index) => {
        mappool_alterPickBoxVisibility(index, 0, true);
    });

    pickOrder = pick;
    banOrder = ban;
    order = pick.concat(ban);
}

function mappool_updatePick(overlayData) {
    const currentPhrase = overlayData.progress.phrases[overlayData.progress.phase - 1];

    for (let i = 0; i < currentPhrase.length; i++) {
        mappool_editPickBoxContent(order[i], currentPhrase.order[i].pick ? 2 : 3, currentPhrase.order[i].code, currentPhrase.order[i].background);
    }

    if(mappool_pickBoxElements.length !== currentPhrase)

    mappool_editPickBoxContent(order[c], currentPhrase.order[i].pick ? 2 : 3, currentPhrase.order[i].code, currentPhrase.order[i].background);
}


//
// Update Function

let phase, bo, firstPick;

function mappool_update() {
    mappool_updatePhase(overlayData.progress);
    mappool_updateMatchInfo(overlayData);
    mappool_updateTeams(overlayData.teams);
    if (phase !== overlayData.progress.phase || bo !== overlayData.bo || firstPick !== overlayData.progress.phases[overlayData.progress.phase - 1].first_pick) {
        phase = overlayData.progress.phase;
        bo = overlayData.bo;
        firstPick = overlayData.progress.phases[overlayData.progress.phase - 1].first_pick;
        mappool_arrangePickBoxes(overlayData);
    }
    mappool_updatePick(overlayData);
}

setInterval(mappool_update, 100);

function mappool_switchTeamBox() {
    if (window.getComputedStyle(mappool_teamInfoElements[0]).opacity === "0") {
        for (let i = 0; i < 2; i++) {
            transitionCrossfadeElements(mappool_teamPlayersElements[i], mappool_teamInfoElements[i], 500);
        }
    } else {
        for (let i = 0; i < 2; i++) {
            transitionCrossfadeElements(mappool_teamInfoElements[i], mappool_teamPlayersElements[i], 500);
        }
    }
}

for (let i = 0; i < 2; i++) {
    mappool_teamPlayersElements[i].style.opacity = 0;
}
setInterval(mappool_switchTeamBox, 10000);