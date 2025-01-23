const { w3cwebsocket: WebSocket } = require("websocket");
const { v2 } = require("osu-api-extended");
const { response } = require("express");
const fs = require("fs");
const difficultyCalculator = require("./difficultyCalculator");
const logger = require("winston");

let gosuWs;
let connected = false;

exports = module.exports = function (config, session) {
  function setupGosuWs() {
    gosuWs = new WebSocket(`ws://${config.gosumemoryHost}:${config.gosumemoryPort}/ws`);

    gosuWs.onopen = () => {
      logger.info("Successfully Connected to Gosumemory!");
      // connected will be updated onmessage
    };

    gosuWs.onclose = (event) => {
      logger.info("Gosumemory WebSocket Connection closed.");
      connected = false;
      setTimeout(setupGosuWs, 1000);
    };

    gosuWs.onerror = (error) => {
      logger.error("Gosumemory WebSocket Connection error.");
    };

    function updateAspect(gosuData) {
      const osuPath = gosuData.settings.folders.game;
      fs.readFile(path.join(osuPath, "tournament.cfg"), (err, data) => {
        if (err) {
          // If failing to read the tournament.cfg file, fall back to the default value of 1
          // It can be because the file disappeared somehow,
          // or gosumemory(tosu) and tournament client is running remotely.
          session.lobby.aspect = 1;
          return;
        }
        data
          .toString()
          .split(/\r?\n/)
          .forEach((x) => {
            if (x.startsWith("Aspect")) {
              session.lobby.aspect = parseFloat(x.replace("Aspect", "").replace(/[^\d.-]/g, ""));
            }
          });
      });
    }

    // CSL CSL CSL CSL CSL CSL CSL CSL CSL
    function saveHistoryFile() {
      fs.writeFileSync(
        path.join(process.cwd(), `history.${session.match_code}.json`),
        JSON.stringify(session.CSL.history)
      );
    }

    let chatCount = 0;
    let mapIdTemp = 0;
    let modsTemp = -1;
    // CSL CSL CSL CSL CSL CSL CSL CSL CSL
    let lastDiffSaveTime = -2000;
    let recordingDiff = false;
    // CSL CSL CSL CSL CSL CSL CSL CSL CSL
    let fetchingBeatmapInfo = false;
    // Set timeout of the connection, as tosu just stops sending data when osu gets closed and
    // silently resumes when opened. With this we can detect situations where osu is restarted.
    let timeout = setTimeout(() => (connected = false), 1000);
    // Update osu! data when receiving websocket message
    gosuWs.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
        // Reset the connection timeout
        clearTimeout(timeout);
        timeout = setTimeout(() => (connected = false), 1000);
      } catch (exception) {
        connected = false; // osu! is closed or something
        return;
      }

      let code = "";
      for (let i = 0; i < session.mappool.length; i++) {
        // Check if current map is mappool
        if (session.mappool[i].map_id === data.menu.bm.id) {
          code = session.mappool[i].code;
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

      const dt = (mods >> 6) % 2 === 1;

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
      session.now_playing.osu.length = data.menu.bm.time.mp3;
      session.now_playing.osu.time = data.menu.bm.time.current;
      session.now_playing.osu.count_circles = data.menu.bm.stats.circles;
      session.now_playing.osu.count_sliders = data.menu.bm.stats.sliders;
      session.now_playing.osu.count_spinners = data.menu.bm.stats.spinners;
      Object.assign(session.now_playing.osu.stats, {
        cs: data.menu.bm.stats.memoryCS,
        ar: data.menu.bm.stats.memoryAR,
        od: data.menu.bm.stats.memoryOD,
        hp: data.menu.bm.stats.memoryHP,
        //sr: data.menu.bm.stats.SR,  // Broken on tosu
        bpm: data.menu.bm.stats.BPM.common * (dt ? 2 / 3 : 1),
        length: data.menu.bm.time.full,
        modified: {
          cs: data.menu.bm.stats.CS,
          ar: data.menu.bm.stats.AR,
          od: data.menu.bm.stats.OD,
          hp: data.menu.bm.stats.HP,
          sr: data.menu.bm.stats.fullSR,
          bpm: data.menu.bm.stats.BPM.common,
          length: data.menu.bm.time.full * (dt ? 2 / 3 : 1),
        },
      });

      // tosu reads stats well but left for future when things should go wrong
      /*
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
          session.now_playing.osu.length = data.menu.bm.time.mp3;

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
      }*/

      // Get original sr from the api
      if (mapIdTemp !== data.menu.bm.id) {
        // Beatmap changed
        if (!fetchingBeatmapInfo) {
          logger.info(`[tourney] Beatmap changed to ${data.menu.bm.id}`);
          fetchingBeatmapInfo = true;

          // CSL CSL CSL CSL CSL CSL
          lastDiffSaveTime = -2000;
          session.CSL.history[data.menu.bm.id] = {
            log: [],
            score: [0, 0],
            acc: [0, 0],
            combo: [0, 0],
            miss: [0, 0],
          };

          v2.beatmap.id.attributes(data.menu.bm.id, {}).then((res) => {
            session.now_playing.osu.stats.sr = res?.attributes?.star_rating;
            mapIdTemp = data.menu.bm.id;
            fetchingBeatmapInfo = false;
          });
        }
      }

      // If Tourney Mode
      let tourney = data.menu.state === 22;
      if (tourney) {
        // Match gosumemory and overlay's slot count
        if (session.lobby.players.length !== data.tourney.ipcClients.length) {
          logger.info("slot mismatch");
          session.lobby.players = [];
          for (let i = 0; i < data.tourney.ipcClients.length; i++) {
            session.lobby.players.push({});
          }
          updateAspect(data); // Slot mismatch usually occurs when the client is restarted, when aspect can be changed
        }

        // Get aspect value in tournament.cfg: needed for determining 1vs1 or 2vs2 in KDC24
        if (!connected) {
          // Run only once when connected
          updateAspect(data);
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
        for (let i = 0; i < data.tourney.ipcClients.length; i++) {
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

        /*
        // Copyright (c) ppy Pty Ltd <contact@ppy.sh>. Licensed under the MIT Licence.
        // See the LICENCE file in the repository root for full licence text.

        namespace osu.Game.Tournament.IPC {
          public enum TourneyState {
            Initialising,
            Idle,
            WaitingForClients,
            Playing,
            Ranking
          }
        }
        */

        // Get IPCstate
        if (session.progress.state !== data.tourney.manager.ipcState) {
          // CSL CSL CSL CSL CSL CSL CSL CSL CSL
          const oldState = session.progress.state;
          const newState = data.tourney.manager.ipcState;

          if (newState === 3) {
            // Started Playing
            logger.info(`[tourney] Started playing map ${data.menu.bm.id}!`);
            recordingDiff = true;
          } else if (newState === 1) {
            // Idle
            logger.info(`[tourney] osu!tourney now idle!`);
            recordingDiff = false;
          } else if (newState === 4) {
            // Ranking
            logger.info(`[tourney] Finished playing the map!`);
            recordingDiff = false;
            if (true) {
              session.CSL.history[data.menu.bm.id].score = data.tourney.ipcClients.map(
                (x) => x.gameplay.score
              );
              session.CSL.history[data.menu.bm.id].acc = data.tourney.ipcClients.map(
                (x) => x.gameplay.accuracy
              );
              session.CSL.history[data.menu.bm.id].combo = data.tourney.ipcClients.map(
                (x) => x.gameplay.combo.max
              );
              session.CSL.history[data.menu.bm.id].miss = data.tourney.ipcClients.map(
                (x) => x.gameplay.hits[0]
              );
              saveHistoryFile();
            }
          }

          session.progress.state = data.tourney.manager.ipcState;
        }

        const time = data.menu.bm.time.current;

        if (recordingDiff) {
          if (lastDiffSaveTime > time) {
            while (session.CSL.history[data.menu.bm.id].log.pop()?.[0] > time);
            lastDiffSaveTime = time;
          }

          if (lastDiffSaveTime + 1000 <= time) {
            session.CSL.history[data.menu.bm.id].log.push([
              time,
              data.tourney.ipcClients[0].gameplay.score - data.tourney.ipcClients[1].gameplay.score,
            ]);
            lastDiffSaveTime = time;
            saveHistoryFile();
          }
        }
      }

      // We are now connected as we received data just now
      connected = true;
    };
  }

  setupGosuWs();
};
