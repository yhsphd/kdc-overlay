const {w3cwebsocket: WebSocket} = require("websocket");
const session = require("../templates/session");

const sc_tokens = [
    "mapsetid", "titleRoman", "artistRoman", "creator", "diffName", "time", "modsEnum", "cs", "ar", "od", "hp",
    "starsNomod", "bpm", "totalAudioTime", "mCS", "mAR", "mOD", "mHP", "mStars", "mBpm"].concat((() => {
    const clientsTokenNames = ["username", "acc", "combo", "score"];
    let clientsTokens = [];

    clientsTokenNames.forEach((tokenName) => {
        for (let i = 0; i < 4; i++) {
            clientsTokens.push(`client_${i}_${tokenName}`);
        }
    });

    return clientsTokens;
})());

let SCws;

exports = module.exports = function(config, session){
    function SetupSCws() {
        SCws = new WebSocket(`ws://${config.SChost}:${config.SCport}/tokens`);

        SCws.onopen = () => {
            console.log("Successfully Connected to StreamCompanion!");
            SCws.send(JSON.stringify(sc_tokens));
        };

        SCws.onclose = event => {
            console.log("StreamCompanion WebSocket Connection closed.");
            setTimeout(SetupSCws, 1000);
        };

        SCws.onerror = error => {
            console.log("StreamCompanion WebSocket Connection error.");
        };

        let dt = false;

        function handleToken(key, data) {
            let clientNum = -1;
            if (key.startsWith("client_")) {
                clientNum = parseInt(key.split("_")[1]);
                key = key.split("_").slice(2).join("_");

                if (key === "username") {
                    session.lobby.players[clientNum].nick = data;
                } else if (key === "acc") {
                    session.lobby.players[clientNum].acc = data;
                } else if (key === "combo") {
                    session.lobby.players[clientNum].combo = data;
                } else if (key === "score") {
                    session.lobby.players[clientNum].score = data;
                }
            }

            if (key === "mapid") {
                session.now_playing.osu.map_id = data;
                for (let key in session.mappool) {      // Check if current map is mappool
                    if (session.mappool[key].map_id === data) {
                        session.now_playing.osu.code = key
                    }
                }
            } else if (key === "mapsetid") {
                session.now_playing.osu.mapset_id = data;
                session.now_playing.osu.background = `https://assets.ppy.sh/beatmaps/${data}/covers/raw.jpg`;
                session.now_playing.osu.cover = `https://assets.ppy.sh/beatmaps/${data}/covers/cover@2x.jpg`;
            } else if (key === "titleRoman") {
                session.now_playing.osu.title = data;
            } else if (key === "artistRoman") {
                session.now_playing.osu.artist = data;
            } else if (key === "creator") {
                session.now_playing.osu.mapper = data;
            } else if (key === "diffName") {
                session.now_playing.osu.difficulty = data;
            } else if (key === "time") {
                session.now_playing.osu.time = (data * 1000).toFixed();
            } else if (key === "modsEnum") {
                dt = (data >> 6) % 2 === 1;
            } else if (key === "cs") {
                session.now_playing.osu.stats.cs = data;
            } else if (key === "ar") {
                session.now_playing.osu.stats.ar = data;
            } else if (key === "od") {
                session.now_playing.osu.stats.od = data;
            } else if (key === "hp") {
                session.now_playing.osu.stats.hp = data;
            } else if (key === "starsNomod") {
                session.now_playing.osu.stats.sr = data;
            } else if (key === "bpm") {
                session.now_playing.osu.stats.bpm = data.split(" ")[0];
            } else if (key === "totalAudioTime") {
                session.now_playing.osu.stats.length = data.toFixed();
                session.now_playing.osu.stats.modified.length = data.toFixed() * (dt ? (2 / 3) : 1);
            } else if (key === "mCS") {
                session.now_playing.osu.stats.modified.cs = data;
            } else if (key === "mAR") {
                session.now_playing.osu.stats.modified.ar = data;
            } else if (key === "mOD") {
                session.now_playing.osu.stats.modified.od = data;
            } else if (key === "mHP") {
                session.now_playing.osu.stats.modified.hp = data;
            } else if (key === "mStars") {
                session.now_playing.osu.stats.modified.sr = data;
            } else if (key === "mBpm") {
                session.now_playing.osu.stats.modified.bpm = data.split(" ")[0];
            }
        }

        // Update osu! data when receiving websocket messaage
        SCws.onmessage = event => {
            const data = JSON.parse(event.data);

            for (key in data) {
                handleToken(key, data[key]);
            }
        };
    }

    SetupSCws();
}