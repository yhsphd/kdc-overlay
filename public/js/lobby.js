let lobby_acronymElements = document.getElementById("topbar").getElementsByClassName("acronym");
let lobby_teamNameElements = document.getElementsByClassName("teamName");
let lobby_setScoreBoxElements = document.getElementsByClassName("setScoreBox");
let lobby_leftBoxElement = document.getElementById("leftBox");
let lobby_bracketElement = document.getElementById("bracket");
let lobby_matchCodeElement = document.getElementById("matchCode");
let lobby_chatBoxElement = document.getElementById("chatBox");
let lobby_scoreBoxElement = document.getElementById("scoreBox");
let lobby_scoreElements = document.getElementsByClassName("scoreBox-teamBox-scoreSum");
let lobby_accElements = document.getElementsByClassName("scoreBox-teamBox-accAvg");
let lobby_scoreDiffElement = document.getElementById("scoreDiff");
/*let lobby_diffSpeedArrowElement = document.getElementById("diffSpeed");
let lobby_diffSpeedRotatorElement = document.getElementById("diffSpeedRotator");
let lobby_diffSpeedValueContainerElement = document.getElementById("diffSpeedValueContainer");
let lobby_diffSpeedValueElement = document.getElementById("diffSpeedValue");*/

const lobby_update_interval = 100;


//
// Utils


//
// UI Update Functions

function lobby_updateMatchInfo(overlayData) {
    lobby_bracketElement.innerText = overlayData.bracket;
    lobby_matchCodeElement.innerText = overlayData.match_code;
}

function lobby_updateTeams(teams) {
    for (let i = 0; i < 2; i++) {
        lobby_acronymElements[i].innerText = teams[i].acronym;
        lobby_teamNameElements[i].innerText = teams[i].name;
    }
}

let chatVisible = true;

function lobby_showChat() {
    transitionCrossfadeElements(lobby_scoreBoxElement, lobby_chatBoxElement, 300);
    chatVisible = true;
}

function lobby_showScores() {
    transitionCrossfadeElements(lobby_chatBoxElement, lobby_scoreBoxElement, 300);
    chatVisible = false;
}


let scoreDiffLog = [];

function lobby_updateScores(lobby) {
    lobby_scoreElements[0].innerText = numberWithCommas(lobby.scores[0]);
    lobby_scoreElements[1].innerText = numberWithCommas(lobby.scores[1]);

    let diff = lobby.scores[0] - lobby.scores[1];
    lobby_scoreDiffElement.innerText = numberWithCommas(Math.abs(diff));

    if (diff > 0) {
        lobby_scoreDiffElement.style.backgroundImage = `url("/img/scorediff_red.svg")`;
        lobby_scoreElements[0].style.fontWeight = 900;
        lobby_scoreElements[1].style.fontWeight = 300;
    } else {
        lobby_scoreDiffElement.style.backgroundImage = `url("/img/scorediff_blue.svg")`;
        lobby_scoreElements[0].style.fontWeight = 300;
        lobby_scoreElements[1].style.fontWeight = 900;
    }

    lobby_accElements[0].innerText = ((lobby.players[0].acc + lobby.players[1].acc) / 2).toFixed(2) + "%";
    lobby_accElements[1].innerText = ((lobby.players[2].acc + lobby.players[3].acc) / 2).toFixed(2) + "%";

    //Add diffspeed
    /*scoreDiffLog.push(diff);
    let diffSpeed = (diff - scoreDiffLog[0]) * (1000 / (lobby_update_interval * (scoreDiffLog.length - 1)));
    if (scoreDiffLog.length === 11) {
        scoreDiffLog.shift();
    }
    lobby_diffSpeedValueElement.innerText = numberWithCommas(Math.abs(diffSpeed));
    lobby_diffSpeedArrowElement.style.width = clampNumber(Math.abs(diffSpeed) * 60 / 50000, 0, 60) + "%";
    if (diffSpeed >= 0) {
        lobby_diffSpeedRotatorElement.style.transform = "rotate(180deg)";
        lobby_diffSpeedValueContainerElement.style.textAlign = "right";
    } else {
        lobby_diffSpeedRotatorElement.style.transform = "";
        lobby_diffSpeedValueContainerElement.style.textAlign = "left";
    }*/
}

let bo = 0;
let setScores = [0, 0];
let setScorePointBaseElement = document.createElement("div")
setScorePointBaseElement.classList.add("setScorePoint");

function lobby_updateSetScores(lobby) {
    if (bo !== lobby.bo) {
        console.log("bo changed")
        setScores = [0, 0];
        bo = lobby.bo;
        lobby_setScoreBoxElements[0].innerHTML = "";
        lobby_setScoreBoxElements[1].innerHTML = "";
        for (let i = 0; i < (bo + 1) / 2; i++) {
            lobby_setScoreBoxElements[0].appendChild(setScorePointBaseElement.cloneNode(true));
            lobby_setScoreBoxElements[1].appendChild(setScorePointBaseElement.cloneNode(true));
        }
    } else {
        for (let i = 0; i < 2; i++) {
            if (setScores[i] < lobby.set_scores[i]) {
                console.log("add star")
                setScores[i]++;
                lobby_setScoreBoxElements[i].getElementsByClassName("setScorePoint")[setScores[i] - 1].style.backgroundColor = "#E7B942";
            } else if (setScores[i] > lobby.set_scores[i]) {
                console.log("remove star")
                setScores[i]--;
                lobby_setScoreBoxElements[i].getElementsByClassName("setScorePoint")[setScores[i]].style.backgroundColor = "white";
            }
        }
    }
}

let tempState = -1;

// Updates visibilities of chat/scores, leaderboard/mapcompacts
function lobby_updateVisibilities(overlayData) {
    if (tempState !== overlayData.progress.state) {
        tempState = overlayData.progress.state;
        if (tempState === 1) {
            lobby_showChat();
            mapCompact_showMapCompacts();
        } else {
            lobby_showScores();
            lobby_showLeaderboard();
        }
    }
    if (overlayData.progress.state === 4 && !overlayData.teams[0].score && !chatVisible) {
        lobby_showChat();
    }
}


//
// Update Function

function lobby_update() {
    lobby_updateMatchInfo(overlayData);
    lobby_updateTeams(overlayData.teams);
    lobby_updateSetScores(overlayData.lobby);
    chat_updateChat(overlayData.chat, lobby_chatBoxElement);
    lobby_updateScores(overlayData.lobby);
    lobby_updateVisibilities(overlayData);
    mapCompact_updateMapCompact(overlayData, lobby_leftBoxElement)
}

setInterval(lobby_update, lobby_update_interval);