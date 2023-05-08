let mappool_phaseElement = document.getElementById("phase");
let mappool_teamInfoElements = document.getElementsByClassName("teamInfoBox");
let mappool_teamPlayersElements = document.getElementsByClassName("teamPlayersBox");

let mappool_offsetElements = document.getElementsByClassName("mappool-pickedMapRowStartOffset");
let mappool_pickedMapElements;

function mappool_pickedMaps_getDOM() {
    try {
        mappool_pickedMapElements = document.getElementsByClassName("mappool-pickedMap");
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


//
// Utils


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

function mappool_alterPickedMap(index, mode, map, pick) {
    const element = mappool_pickedMapElements[index];

    if (mode === 0) {           // pick/ban
        element.style.opacity = 1;
        element.getElementsByClassName("mappool-pickedMap-slash")[0].style.opacity = 0;
    } else if (mode === 1) {    // disable
        element.style.opacity = 1;
        element.getElementsByClassName("mappool-pickedMap-code")[0].innerText = "";
        element.getElementsByClassName("mappool-pickedMap-banpick")[0].innerText = "";
        element.getElementsByClassName("mappool-pickedMap-slash")[0].style.opacity = 1;
    } else if (mode === 2) {    // hide
        element.style.opacity = 0;
    }
}

for (let i = 0; i < 2; i++) {
    mappool_teamPlayersElements[i].style.opacity = 0;
}
setInterval(mappool_switchTeamBox, 10000);


//
// Update Function

function mappool_update() {
    mappool_updatePhase(overlayData.progress);
    mappool_updateMatchInfo(overlayData);
    mappool_updateTeams(overlayData.teams);
}

setInterval(mappool_update, 100);