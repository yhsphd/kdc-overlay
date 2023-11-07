const { w3cwebsocket: WebSocket } = require("websocket");
const { v2 } = require("osu-api-extended");
const { response } = require("express");
const difficultyCalculator = require("./difficultyCalculator");

let gosuWs;

exports = module.exports = function (config, session) {
  function setupGosuWs() {
    gosuWs = new WebSocket(
      `ws://${config.gosumemoryHost}:${config.gosumemoryPort}/ws`
    );

    gosuWs.onopen = () => {
      console.log("Successfully Connected to Gosumemory!");
    };

    gosuWs.onclose = (event) => {
      console.log("Gosumemory WebSocket Connection closed.");
      setTimeout(setupGosuWs, 1000);
    };

    gosuWs.onerror = (error) => {
      console.log("Gosumemory WebSocket Connection error.");
    };

    let chatCount = 0;
    let mapIdTemp = 0;
    let modsTemp = -1;
    // Update osu! data when receiving websocket messaage
    gosuWs.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
      } catch (exception) {
        return;
      }

      let code = "";
      for (let key in session.mappool) {
        // Check if current map is mappool
        if (session.mappool[key].map_id === data.menu.bm.id) {
          code = key;
          break;
        }
      }

      let mods;
      if (code.startsWith("HD")) {
        mods = 8;
      } else if (code.startsWith("HR")) {
        mods = 16;
      } else if (code.startsWith("EZ")) {
        mods = 2;
      } else if (code.startsWith("DT")) {
        mods = 64;
      } else if (code.startsWith("HT")) {
        mods = 256;
      } else {
        mods = data.menu.mods.num;
      }

      // Update now playing data in session
      session.now_playing.osu.map_id = data.menu.bm.id;
      session.now_playing.osu.mapset_id = data.menu.bm.set;
      session.now_playing.osu.mods = mods;
      session.now_playing.osu.code = code;
      session.now_playing.osu.background = `https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/raw.jpg`;
      session.now_playing.osu.cover = `https://assets.ppy.sh/beatmaps/${data.menu.bm.set}/covers/cover.jpg`;
      session.now_playing.osu.title = data.menu.bm.metadata.title;
      session.now_playing.osu.artist = data.menu.bm.metadata.artist;
      session.now_playing.osu.mapper = data.menu.bm.metadata.mapper;
      session.now_playing.osu.difficulty = data.menu.bm.metadata.difficulty;
      session.now_playing.osu.time = data.menu.bm.time.current;
      /*session.now_playing.osu.stats = {
                cs : data.menu.bm.stats.CS,
                ar : data.menu.bm.stats.AR,
                od : data.menu.bm.stats.OD,
                hp : data.menu.bm.stats.HP,
                sr : data.menu.bm.stats.SR,
                bpm : data.menu.bm.stats.BPM.min === data.menu.bm.stats.BPM.max ? data.menu.bm.stats.BPM.min : data.menu.bm.stats.BPM.min + "-" + data.menu.bm.stats.BPM.max,
                length : data.menu.bm.time.mp3,
                modified : {
                    cs : data.menu.bm.stats.memoryCS,
                    ar : data.menu.bm.stats.memoryAR,
                    od : data.menu.bm.stats.memoryOD,
                    hp : data.menu.bm.stats.memoryHP,
                    sr : data.menu.bm.stats.fullSR,
                    bpm : data.menu.bm.stats.BPM.min === data.menu.bm.stats.BPM.max ? data.menu.bm.stats.BPM.min * (dt ? 1.5 : 1) : data.menu.bm.stats.BPM.min * (dt ? 1.5 : 1) + "-" + data.menu.bm.stats.BPM.max * (dt ? 1.5 : 1),
                    length : data.menu.bm.time.mp3 * (dt ? (2 / 3) : 1)
                }
            };*/ // Currently not working on gosumemory

      // Using osu!Api as gosumemory cannot pull metadata
      if (mapIdTemp !== data.menu.bm.id) {
        // Beatmap changed
        v2.beatmap.id.details(data.menu.bm.id).then((response) => {
          session.now_playing.osu.stats.cs = response.cs;
          session.now_playing.osu.stats.ar = response.ar;
          session.now_playing.osu.stats.od = response.accuracy;
          session.now_playing.osu.stats.hp = response.drain;
          session.now_playing.osu.stats.sr = response.difficulty_rating;
          session.now_playing.osu.stats.bpm = response.bpm;
          session.now_playing.osu.stats.length = response.total_length * 1000;

          if (response.id === data.menu.bm.id) {
            // api call success
            mapIdTemp = data.menu.bm.id;
            modsTemp = -1;
          }
        });
      }

      if (modsTemp !== mods) {
        // Mods changed
        modsTemp = mods;
        difficultyCalculator
          .ApplyMods(mapIdTemp, session.now_playing.osu.stats, mods)
          .then((modified) => {
            session.now_playing.osu.stats.modified = modified;
          });
      }

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
              session.chat.push([
                new Date(),
                data.tourney.manager.chat[chatCount - 1 - i].name,
                data.tourney.manager.chat[chatCount - 1 - i].messageBody,
              ]);
            }
          } else if (data.tourney.manager.chat.length < chatCount) {
            // If chat count has decreased, reset the chat
            session.chat = [];
            chatCount = 0;
          }
        }

        // Get players' live playdata
        for (let i = 0; i < 4; i++) {
          session.lobby.players[i] = {
            id: data.tourney.ipcClients[i].spectating.userID,
            nick: data.tourney.ipcClients[i].spectating.name,
            score: data.tourney.ipcClients[i].gameplay.score,
            combo: data.tourney.ipcClients[i].gameplay.combo.current,
            acc: data.tourney.ipcClients[i].gameplay.accuracy,
          };
        }

        // Get manager data
        session.lobby.bo = data.tourney.manager.bestOF;
        session.lobby.set_scores = [
          data.tourney.manager.stars.left,
          data.tourney.manager.stars.right,
        ];
        session.lobby.scores = [
          data.tourney.manager.gameplay.score.left,
          data.tourney.manager.gameplay.score.right,
        ];

        // Get IPCstate
        session.progress.state = data.tourney.manager.ipcState;
      }
    };
  }

  setupGosuWs();
};
