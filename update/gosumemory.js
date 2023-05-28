const { w3cwebsocket: WebSocket } = require("websocket");

let gosuWs;

exports = module.exports = function (config, session) {
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

            // SC time not working
            session.now_playing.osu.time = data.menu.bm.time.current;

            // If Tourney Mode
            let tourney = data.menu.state === 22;
            if (tourney) {
                // Match gosumemory and overlay's slot count
                if (session.lobby.players.length !== data.tourney.ipcClients.length) {
                    console.log("slot mismatch");
                    session.lobby.players = [];
                    for (let i = 0; i < data.tourney.ipcClients.length; i++) {
                        session.lobby.players.push({});
                    }
                }

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
                    session.lobby.players[i].score = data.tourney.ipcClients[i].gameplay.score;
                }

                // Get manager data
                session.lobby.bo = data.tourney.manager.bestOF;
                session.lobby.set_scores = [data.tourney.manager.stars.left, data.tourney.manager.stars.right];
                session.lobby.scores = [data.tourney.manager.gameplay.score.left, data.tourney.manager.gameplay.score.right];

                // Get IPCstate
                session.progress.state = data.tourney.manager.ipcState;
            }
        };
    }

    setupGosuWs();
}