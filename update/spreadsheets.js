const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { v2 } = require("osu-api-extended");
const get2dValue = require("../globs/get2dValue");
const session = require("../templates/session");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

exports = module.exports = function (config, session) {
  function getColumnLabels(firstRow) {
    const data = {};
    for (let i = 0; i < firstRow.length; i++) {
      data[firstRow[i]] = i;
    }
    return data;
  }

  //
  // Team Info Update
  async function updateTeams(teams) {
    if (session.type !== "match") {
      return;
    }

    const range = "Teams"; // Specifying only the sheet name as range to get the whole cells in the sheet
    let matchCode = 0;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range,
    });
    const rows = res.data.values; // Got data from the sheet

    const labels = getColumnLabels(rows[0]);

    const teamsData = new Array(teams.length);

    for (let i = 1; i < rows.length; i++) {
      if (teams.includes(parseInt(rows[i][labels.Index]))) {
        teamsData[teams.indexOf(parseInt(rows[i][labels.Index]))] = {
          name: rows[i][labels.TeamName],
          acronym: rows[i][labels.Acronym],
          seed: parseInt(rows[i][labels.Seed]),
          players: [
            { id: parseInt(rows[i][labels.uid1]), nick: rows[i][labels.Player1], rank: 0 },
            { id: parseInt(rows[i][labels.uid2]), nick: rows[i][labels.Player2], rank: 0 },
          ],
        };
      }
    }

    for (let i = 0; i < teamsData.length; i++) {
      for (let j = 0; j < 2; j++) {
        const playerdata = await v2.user.details(teamsData[i].players[j].id);
        teamsData[i].players[j].rank = playerdata.statistics.global_rank;
      }
    }

    session.teams = teamsData;
    console.log(`Found teams ${teams} on sheet!`);
  }

  //
  // Mappool Update (from sheets)
  async function updateMappoolFromSheet(mappoolName) {
    if (session.mappool_manual) {
      // Don't get mappool info from the sheet if it is provided manually
      return;
    }

    const range = "Mappool"; // Specifying only the sheet name as range to get the whole cells in the sheet

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range,
    });
    const rows = res.data.values; // Got data from the sheet

    const labels = getColumnLabels(rows[0]);

    let mappool = [];

    let gettingMappool = false;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][labels.RoundCode] === mappoolName) {
        if (!gettingMappool) gettingMappool = true;
      } else if (gettingMappool) {
        // Finished reading current bracket's mappool
        break;
      }

      if (gettingMappool) {
        mappool.push({
          map_id: parseInt(rows[i][labels.map_id]),
          mapset_id: parseInt(rows[i][labels.mapset_id]),
          code: rows[i][labels.Code],
          background: rows[i][labels.background],
          cover: rows[i][labels.cover],
          title: rows[i][labels.title],
          artist: rows[i][labels.artist],
          mapper: rows[i][labels.mapper],
          difficulty: rows[i][labels.difficulty],
          stats: {
            cs: parseFloat(rows[i][labels.cs]),
            ar: parseFloat(rows[i][labels.ar]),
            od: parseFloat(rows[i][labels.od]),
            hp: parseFloat(rows[i][labels.hp]),
            sr: parseFloat(rows[i][labels.sr]),
            bpm: parseFloat(rows[i][labels.bpm]),
            length: parseFloat(rows[i][labels.length]),
          },
        });
      }
    }

    if (mappool.length) {
      session.mappool = mappool;
      console.log(`\nFound mappool <${mappoolName}> (size: ${mappool.length}) on sheet!`);
    }
  }

  //
  // Match Info Update
  let matchCode = 0;

  async function updateMatchInfo() {
    if (session.type !== "match") {
      // Not accessing the sheet if not in match mode
      return;
    }
    const range = session.match_code; // Specifying only the sheet name (which is same with the match code) as range to get the whole cells in the sheet

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheet,
      range: range,
    });
    const rows = res.data.values; // Got data from the sheet

    session.bracket = get2dValue.byRange(rows, "W7");
    session.mappool_name = get2dValue.byRange(rows, "G2");
    session.bo = parseInt(get2dValue.byRange(rows, "W4"));
    session.schedule = get2dValue.byRange(rows, "W3");
    session.stream_title = get2dValue.byRange(rows, "W2");

    if (matchCode !== session.match_code) {
      // Match changeds

      matchCode = session.match_code;

      console.log(`\nFound Match <${matchCode}> on sheet!`);
      const teamNums = [
        parseInt(get2dValue.byRange(rows, "N4")),
        parseInt(get2dValue.byRange(rows, "S4")),
      ];
      updateTeams(teamNums);
      updateMappoolFromSheet(session.mappool_name);
      console.log();
      console.log("\n==================== Stream Title ====================");
      console.log(get2dValue.byRange(rows, "W2"));
      console.log("======================================================\n");
    }

    // Get Match Progress Data
    const progressData = get2dValue.byRange(rows, "B2:C");

    session.progress.phase = parseInt(progressData[0][1]);
    session.progress.phases[0].first_pick = parseInt(progressData[2][1]);
    session.progress.phases[1].first_pick = parseInt(progressData[3][1]);

    let order = [];
    let phase = 0;
    for (let i = 4; i < progressData.length; i++) {
      if (!progressData[i][1]) {
        // Stop reading if empty
        break;
      }

      const pick = JSON.parse(progressData[i][1]);

      if (progressData[i][0].startsWith("phase_")) {
        // change phase
        phase = parseInt(progressData[i][0].substring(6)) - 1;
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
    if (session.type === "match") {
      updateMatchInfo();
    }
  }, 1100);
};
