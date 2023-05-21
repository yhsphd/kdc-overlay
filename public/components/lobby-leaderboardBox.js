let lobby_leaderboardBoxElements;   // The order is same with the lobby
let lobby_leaderboardBox_rankElements;
let lobby_leaderboardBox_pfpElements;
let lobby_leaderboardBox_nickElements;
let lobby_leaderboardBox_scoreElements;
let lobby_leaderboardBox_comboElements;
let lobby_leaderboardBox_accElements;

function lobby_leaderboard_getDOM() {
    try {
        lobby_leaderboardBoxElements = document.getElementsByClassName("lobby-leaderboardBox");
        lobby_leaderboardBox_rankElements = document.getElementsByClassName("lobby-leaderboardBox-rank");
        lobby_leaderboardBox_pfpElements = document.getElementsByClassName("lobby-leaderboardBox-pfp");
        lobby_leaderboardBox_nickElements = document.getElementsByClassName("lobby-leaderboardBox-nick");
        lobby_leaderboardBox_scoreElements = document.getElementsByClassName("lobby-leaderboardBox-score");
        lobby_leaderboardBox_comboElements = document.getElementsByClassName("lobby-leaderboardBox-combo");
        lobby_leaderboardBox_accElements = document.getElementsByClassName("lobby-leaderboardBox-acc");

        lobby_leaderboardBoxElements[0].style.backgroundColor = "var(--red)";
        lobby_leaderboardBoxElements[1].style.backgroundColor = "var(--red)";

        for (let i = 0; i < lobby_leaderboardBoxElements.length; i++) {
            lobby_leaderboardBoxElements[i].style.top = "0px";
        }
    } catch (e) {
        setTimeout(lobby_leaderboard_getDOM, 1000);
    }
}
lobby_leaderboard_getDOM();


let lobby_leaderboardEnabled = true;


//
// UI Update Functions

function lobby_showLeaderboard(hide = false) {
    if (!hide) {    // show leaderboard
        lobby_showMapCompacts(true);
        playerOrder = [0, 1, 2, 3];
        transformsY = [0, 0, 0, 0];
        for (let i = 0; i < lobby_leaderboardBoxElements.length; i++) {
            lobby_leaderboardBoxElements[i].style.transition = "";
            lobby_leaderboardBoxElements[i].style.transform = "translateX(-100%)";
        }
        setTimeout(() => {
            for (let i = 0; i < lobby_leaderboardBoxElements.length; i++) {
                setTimeout(() => {
                    lobby_leaderboardBoxElements[i].style.transition = "transform 500ms cubic-bezier(0, 0, 0, 1)";
                    lobby_leaderboardBoxElements[i].style.transform = "";
                    lobby_leaderboardBoxElements[i].addEventListener("animationend", () => {
                        lobby_leaderboardBoxElements[i].style.transition = "transform 500ms cubic-bezier(0, 1.4, 0.6, 1)";
                    }, {once: true});
                }, 100 * i);
            }
            setTimeout(() => {
                lobby_leaderboardEnabled = true;
            }, 1000);
        }, 1000);
    } else {    // hide leaderboard
        lobby_leaderboardEnabled = false;
        for (let i = 0; i < playerOrder.length; i++) {
            setTimeout(() => {
                lobby_leaderboardBoxElements[playerOrder[i]].style.transition = "transform 500ms cubic-bezier(0, 0, 0, 1)";
                lobby_leaderboardBoxElements[playerOrder[i]].style.transform += " translateX(-100%)";
                lobby_leaderboardBoxElements[playerOrder[i]].addEventListener("animationend", () => {
                    lobby_leaderboardBoxElements[playerOrder[i]].style.transform = "translateX(-100%)";
                }, {once: true});
            }, 100 * i);
        }
    }
}

function updateLeaderboardValue(players) {
    for (let i = 0; i < lobby_leaderboardBoxElements.length; i++) {
        lobby_leaderboardBox_pfpElements[i].src = `https://a.ppy.sh/${players[i].id}`;
        lobby_leaderboardBox_nickElements[i].innerText = players[i].nick;
        lobby_leaderboardBox_scoreElements[i].innerText = numberWithCommas(players[i].score);
        lobby_leaderboardBox_comboElements[i].innerText = `${players[i].combo}x`;
        lobby_leaderboardBox_accElements[i].innerText = `${players[i].acc.toFixed(2)}%`;
    }
}

let playerOrder = [0, 1, 2, 3];     // top to bottom
let transformsY = [0, 0, 0, 0];

function updateLeaderboardOrder(players) {
    const height = 110;

    for (let i = 0; i < playerOrder.length - 1; i++) {
        if (players[playerOrder[i]].score < players[playerOrder[i + 1]].score) {
            transformsY[playerOrder[i]] += height;
            transformsY[playerOrder[i + 1]] -= height;
            let num = playerOrder[i];
            playerOrder[i] = playerOrder[i + 1];
            playerOrder[i + 1] = num;
        }
    }

    for (let i = 0; i < lobby_leaderboardBoxElements.length; i++) {
        lobby_leaderboardBoxElements[i].style.transform = `translateY(${transformsY[i]}px)`;
        lobby_leaderboardBox_rankElements[i].innerText = playerOrder.indexOf(i) + 1;
    }
}


//
// Update Function

function lobby_leaderboard_update() {
    if (lobby_leaderboardEnabled) {
        updateLeaderboardValue(overlayData.lobby.players);
        updateLeaderboardOrder(overlayData.lobby.players);
    }
}
setInterval(lobby_leaderboard_update, 100);