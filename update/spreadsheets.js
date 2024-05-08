const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { v2 } = require("osu-api-extended");
const session = require("../templates/session");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

exports = module.exports = function(config, session) {
  //
  // Team Info Update

  // Rows: matchCode, bracket, bo, streamTitle, schedule, team1, team2
  const range_updateTeams = "export!A4:AX10";
  let matchCode = 0;

  async function updateTeams() {
    if (session.type !== "match") {
      return;
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range_updateTeams,
    });
    const rows = res.data.values;

    let col;

    for (let i = 0; i < rows[0].length; i++) {
      if (rows[0][i] === matchCode.toString()) {
        console.log(`\nFound <Match ${rows[0][i]}> on sheet!`);
        col = i;
      }
    }
    session.bracket = rows[1][col];
    session.bo = parseInt(rows[2][col]);
    console.log("\n==================== Stream Title ====================");
    console.log(rows[3][col]);
    console.log("======================================================\n");
    session.schedule = rows[4][col];
    session.teams = [JSON.parse(rows[5][col]), JSON.parse(rows[6][col])];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const playerdata = await v2.user.details(session.teams[i].players[j].id);
        session.teams[i].players[j].rank = playerdata.statistics.global_rank;
      }
    }
  }

  setInterval(() => {
    if (matchCode !== session.match_code) {
      matchCode = session.match_code;
      updateTeams();
    }
  }, 1000);

  //
  // Mappool Update

  // Rows: mappool_name + mappool (each map)
  const range_updateMappool = "pool_export!A1:A";
  let mappoolName = "";

  async function updateMappool() {
    if (session.type === "showcase") {
      return;
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range_updateMappool,
    });
    const rows = res.data.values;
    let mappool = [];

    let gettingMappool = false;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === mappoolName) {
        console.log(`Found <Mappool ${rows[i][0]}> on sheet!`);
        gettingMappool = true;
      } else if (gettingMappool) {
        if (rows[i][0].startsWith("{")) {
          const data = JSON.parse(rows[i][0]);
          mappool.push(data);
        } else {
          break;
        }
      }
    }

    if (mappool.length) {
      session.mappool = mappool;
    }
  }

  setInterval(() => {
    if (!session.mappool_manual && mappoolName !== session.mappool_name) {
      mappoolName = session.mappool_name;
      updateMappool();
    }
  }, 1000);

  //
  // BanPick Update

  let range_updateBanPick;

  async function updateBanPick() {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range_updateBanPick,
    });
    const rows = res.data.values;

    session.progress.phase = parseInt(rows[0][1]);
    session.progress.phases[0].first_pick = rows[2][1];
    session.progress.phases[1].first_pick = rows[3][1];

    let order = [];
    let phase = 0;
    for (let i = 4; i < rows.length; i++) {
      const pick = JSON.parse(rows[i][1]);

      if (rows[i][0].startsWith("phase_")) {
        // change phase
        phase = parseInt(rows[i][0].substring(6)) - 1;
        order.push([]);
      }

      if (!(pick.pick === -1 && pick.team === -1)) {
        // pass if invalid pick
        order[phase].push(pick);
      }
    }

    order[order.length - 1].pop(); // last map is TB

    for (let i = 0; i < order.length; i++) {
      // apply to session
      session.progress.phases[i].order = order[i];
    }
  }

  setInterval(() => {
    range_updateBanPick = session.match_code + "!B2:C";
    if (session.type === "match") {
      updateBanPick();
    }
  }, 5000);
};
