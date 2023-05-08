let lobby_acronymElements = document.getElementById("topbar").querySelector(".acronym");
let lobby_teamNameElements = document.getElementsByClassName("teamName");
let lobby_leftBoxElement = document.getElementById("leftBox");
let lobby_bracketElement = document.getElementById("bracket");
let lobby_matchCodeElement = document.getElementById("matchCode");
let lobby_chatBoxElement = document.getElementById("chatBox");
let lobby_scoreBoxElement = document.getElementById("scoreBox");
let lobby_scoreElements = document.getElementsByClassName("scoreBox-teamBox-scoreSum");
let lobby_accElements = document.getElementsByClassName("scoreBox-teamBox-accAvg");
let lobby_scoreDiffElement = document.getElementById("scoreDiff");
let lobby_diffSpeedArrowElement = document.getElementById("diffSpeed");
let lobby_diffSpeedRotatorElement = document.getElementById("diffSpeedRotator");
let lobby_diffSpeedValueContainerElement = document.getElementById("diffSpeedValueContainer");
let lobby_diffSpeedValueElement = document.getElementById("diffSpeedValue");

let scoreDiffLog = [];

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
    for (let i = 0; i > 2; i++) {
        lobby_acronymElements.innerText = teams[i].acronym;
        lobby_teamNameElements.innerText = teams[i].name;
    }
}

function lobby_showChat(hide = false) {
    transitionCrossfadeElements(lobby_scoreBoxElement, lobby_chatBoxElement, 300);
}

function lobby_showScores(hide = false) {
    transitionCrossfadeElements(lobby_chatBoxElement, lobby_scoreBoxElement, 300);
}

function lobby_updateScores(lobby) {
    lobby_scoreElements[0].innerText = numberWithCommas(lobby[0].score + lobby[1].score);
    lobby_scoreElements[1].innerText = numberWithCommas(lobby[2].score + lobby[3].score);

    let diff = lobby[0].score + lobby[1].score - lobby[2].score - lobby[3].score;
    lobby_scoreDiffElement.innerText = numberWithCommas(Math.abs(diff));

    lobby_accElements[0].innerText = ((lobby[0].acc + lobby[1].acc) / 2).toFixed(2) + "%";
    lobby_accElements[1].innerText = ((lobby[2].acc + lobby[3].acc) / 2).toFixed(2) + "%";

    //Add diffspeed
    scoreDiffLog.push(diff);
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
    }
}


//
// Update Function

function lobby_update() {

}

setInterval(lobby_update, lobby_update_interval);