const express = require("express");
const router = express.Router();

const path = require('path');
const {v2, auth} = require('osu-api-extended');

const config = require(path.join(process.cwd(), "config"));

let players = {};
let beatmaps = {};

async function authenticate() {
    await auth.login(config.clientID, config.clientSecret);
    const data = await v2.beatmap.diff(75);
    if (data.beatmapset_id === 1) {
        console.log("osu!api authentication success!");
    } else {
        console.log("osu!api authentication failure");
        console.log("Please check if your client ID and secret you entered in config.js are correct.\n");
    }
}

async function getPlayers(playerIDs, callback) {
    let playerIDsToRequest = [];
    playerIDs.forEach((playerID) => {
        if (!(playerID.toString() in players)) {
            playerIDsToRequest.push(playerID);
        }
    });

    let data = await v2.user.list(playerIDsToRequest);
    data.users.forEach((playerData) => {
        players[playerData.id] = playerData;
    })

    let playersToReturn = [];
    playerIDs.forEach((playerID) => {
        playersToReturn.push(players[playerID]);
    });
    callback(playersToReturn);
}

authenticate();


router.get("/beatmaps", (req, res) => {
    console.log("osu!api beatmaps");
});

router.get("/player", (req, res) => {

});

module.exports = router;