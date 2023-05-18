const path = require("path");
const fs = require("fs");
exports = module.exports = function (io) {
    const path = require("path");
    const fs = require("fs");
    const ReconnectingWebSocket = require("./ReconnectingWebSocket");

    const config = require("./config");

    const gosuWebSocket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
    const defaultSession = require("./templates/session");
    let session = defaultSession;

    fs.access(path.join(process.cwd(), "session"), () => {
        session = require(path.join(process.cwd(), "session"));      // debug
    });

    let getOsuNp = false;

    io.on("connection", function (socket) {
        socket.on("file1Event", function () {
            console.log("file1Event triggered");
        });
    });

    gosuWebSocket.onopen = () => {
        console.log("Successfully Connected to Gosumemory!");
    };

    gosuWebSocket.onclose = event => {
        console.log("Socket Closed Connection: ", event);
        gosuWebSocket.send("Client Closed!");
    };

    gosuWebSocket.onerror = error => {
        console.log("Socket Error: ", error);
    };

    let chatCount = 0;
    // Update osu! data when receiving websocket messaage
    gosuWebSocket.onmessage = event => {
        const data = JSON.parse(event.data);
        const dt = (data.menu.mods.num >> 6) % 2 === 1;
        let code;

        for (let key in session.mappool) {      // Check if current map is mappool
            if (session.mappool[key].map_id === data.menu.bm.id) {
                code = key;
            }
        }

        // Update now playing data in session
        session.now_playing.osu = {
            map_id: data.menu.bm.id,
            mapset_id: data.menu.bm.set,
            code: code,
            background: `https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/raw.jpg`,
            cover: `https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover@2x.jpg`,
            title: data.menu.bm.metadata.title,
            artist: data.menu.bm.metadata.artist,
            mapper: data.menu.bm.metadata.mapper,
            difficulty: data.menu.bm.metadata.difficulty,
            time: data.menu.bm.time.current,
            stats: {
                cs: data.menu.bm.stats.CS,
                ar: data.menu.bm.stats.AR,
                od: data.menu.bm.stats.OD,
                hp: data.menu.bm.stats.HP,
                sr: data.menu.bm.stats.SR,
                bpm: data.menu.bm.stats.BPM.min === data.menu.bm.stats.BPM.max ? data.menu.bm.stats.BPM.min : data.menu.bm.stats.BPM.min + "-" + data.menu.bm.stats.BPM.max,
                length: data.menu.bm.time.mp3,
                modified: {
                    cs: data.menu.bm.stats.memoryCS,
                    ar: data.menu.bm.stats.memoryAR,
                    od: data.menu.bm.stats.memoryOD,
                    hp: data.menu.bm.stats.memoryHP,
                    sr: data.menu.bm.stats.fullSR,
                    bpm: data.menu.bm.stats.BPM.min === data.menu.bm.stats.BPM.max ? data.menu.bm.stats.BPM.min * (dt ? 1.5 : 1) : data.menu.bm.stats.BPM.min * (dt ? 1.5 : 1) + "-" + data.menu.bm.stats.BPM.max * (dt ? 1.5 : 1),
                    length: data.menu.bm.time.mp3 * (dt ? (2 / 3) : 1)
                }
            }
        }

        // Receive new chat messages
        if (data.tourney.manager.chat.length > chatCount) {
            let chats2addCount = data.tourney.manager.chat.length - chatCount;
            chatCount = chat.length;

            for (let i = 0; i < chats2addCount; i++) {
                session.chat.append([new Date(), data.tourney.manager.chat[chatCount - i].name, data.tourney.manager.chat[chatCount - i].messageBody]);
            }
        } else if (data.tourney.manager.chat.length < chatCount) {      // If chat count has decreased, reset the chat
            session.chat = [];
            chatCount = 0;
        }

        // Get players in lobby
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                session.teams[i].players[j].id = data.ipcClients[2 * i + j].spectating.userID;
                session.teams[i].players[j].nick = data.ipcClients[2 * i + j].spectating.name;
                session.teams[i].players[j].rank = data.ipcClients[2 * i + j].spectating.globalRank;
            }
            session.teams[i].set_score = data.tourney.manager.stars[["left", "right"][i]];
            session.teams[i].score = data.tourney.manager.gameplay.score[["left", "right"][i]];
        }

        // Get players' live playdata
        for (let i = 0; i < 4; i++) {
            session.lobby[i] = {
                id: data.ipcClients[i].spectating.userID,
                nick: data.ipcClients[i].spectating.name,
                score: data.ipcClients[i].gameplay.score,
                combo: data.ipcClients[i].gameplay.combo.current,
                acc: data.ipcClients[i].gameplay.accuracy
            }
        }

        // Get IPCstate
        session.progress.state = data.tourney.manager.ipcState;
    };

    // Updating fb2k data
    function fb2k_updateNowplaying() {
        fetch(`http://127.0.0.1:${config.port}/api/fb2k/nowplaying`)
            .then((response) => response.json())
            .then((data) => {
                if (data.fb2k_running && data.player.activeItem.index !== -1) {
                    getOsuNp = false;
                    session.now_playing = defaultSession.now_playing;
                    session.now_playing.mode = "fb2k";
                    session.now_playing.fb2k.title = data.player.activeItem.columns[1];
                    session.now_playing.fb2k.artist = data.player.activeItem.columns[0];
                    session.now_playing.fb2k.time = data.player.activeItem.position * 1000;
                    session.now_playing.fb2k.length = data.player.activeItem.duration * 1000;
                } else {
                    getOsuNp = true;
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