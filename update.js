const path = require("path");
const fs = require("fs");
const config = require("./config");
const {w3cwebsocket: WebSocket} = require("websocket");
exports = module.exports = function (io) {
    const path = require("path");
    const fs = require("fs");
    const WebSocket = require("websocket").w3cwebsocket;

    const config = require("./config");
    const defaultSession = require("./templates/session");
    let session = defaultSession;

    // Load debug values
    fs.access(path.join(process.cwd(), "session"), () => {
        session = require(path.join(process.cwd(), "session"));
    });

    let getOsuNp = false;

    // socket.io setup
    io.on("connection", function (socket) {
        socket.on("file1Event", function () {
            console.log("file1Event triggered");
        });
    });


    // Gosumemory websocket setup
    let gosuWs;

    function setupGosuWs() {
        gosuWs = new WebSocket(`ws://${config.gosumemoryHost}:${config.gosumemoryPort}/ws`);

        gosuWs.onopen = () => {
            console.log("Successfully Connected to Gosumemory!");
        };

        gosuWs.onclose = event => {
            console.log("Gosumemory WebSocket Connection closed.");
            setTimeout(setupGosuWs, 1000);
        };

        gosuWs.onerror = error => {
            console.log("Gosumemory WebSocket Connection error.");
        };

        let chatCount = 0;
        // Update osu! data when receiving websocket messaage
        gosuWs.onmessage = event => {
            const data = JSON.parse(event.data);

            // If Tourney Mode
            let tourney = data.menu.state === 22;
            if (tourney) {
                // If not null, receive new chat messages
                if (data.tourney.manager.chat != null) {
                    if (data.tourney.manager.chat.length > chatCount) {
                        let chats2addCount = data.tourney.manager.chat.length - chatCount;
                        chatCount = data.tourney.manager.chat.length;

                        for (let i = 0; i < chats2addCount; i++) {
                            session.chat.push([new Date(), data.tourney.manager.chat[(chatCount - 1) - i].name, data.tourney.manager.chat[(chatCount - 1) - i].messageBody]);
                        }
                    } else if (data.tourney.manager.chat.length < chatCount) {      // If chat count has decreased, reset the chat
                        session.chat = [];
                        chatCount = 0;
                    }
                }

                // Get players' live playdata
                for (let i = 0; i < 4; i++) {
                    session.lobby.players[i].id = data.tourney.ipcClients[i].spectating.userID;
                    session.lobby.bo = data.tourney.manager.bestOF;
                    session.lobby.set_scores = [data.tourney.manager.stars.left, data.tourney.manager.stars.right];
                    session.lobby.scores = [data.tourney.manager.gameplay.score.left, data.tourney.manager.gameplay.score.right];
                }

                // Get IPCstate
                session.progress.state = data.tourney.manager.ipcState;
            }
        };
    }

    setupGosuWs();


    // StreamCompanion websocket setup
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


    // Updating fb2k data
    function fb2k_updateNowplaying() {
        fetch(`http://127.0.0.1:${config.port}/api/fb2k/nowplaying`)
            .then((response) => response.json())
            .then((data) => {
                if (data.fb2k_running && data.player.activeItem.index !== -1 && data.player.playbackState !== "stopped") {
                    getOsuNp = false;
                    session.now_playing = defaultSession.now_playing;
                    session.now_playing.mode = "fb2k";
                    session.now_playing.fb2k.title = data.player.activeItem.columns[1];
                    session.now_playing.fb2k.artist = data.player.activeItem.columns[0];
                    session.now_playing.fb2k.time = data.player.activeItem.position * 1000;
                    session.now_playing.fb2k.length = data.player.activeItem.duration * 1000;
                } else {
                    getOsuNp = true;
                    session.now_playing.mode = "osu";
                }
            });
    }

    setInterval(fb2k_updateNowplaying, 200);


    //
    // Session data broadcasting
    function broadcastUpdate() {
        io.emit("update", session);
    }

    setInterval(broadcastUpdate, 100);
}


/*
setTimeout(() => {
        osuapi.getPlayers([6665667, 4585186, 1076236, 6537257]);
    }, 1000
);
*/