const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { v2 } = require("osu-api-extended");
const session = require("../templates/session");
const { response } = require("express");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

exports = module.exports = function (config, session) {
  //
  // Match Info Update

  let matchCode = "";

  const range_round = "!H3";
  const range_playerIds = "!AI4:AL5"; // Rows: nicks, ids

  async function updateMatch() {
    // No need to fetch the match info if we are not broadcasting match or there is no match code
    if (session.type !== "match" || !matchCode) {
      return;
    }

    try {
      sheets.spreadsheets.values
        .batchGet({
          spreadsheetId: config.sheet,
          ranges: [
            matchCode + range_round,
            matchCode + range_playerIds,
            matchCode + range_points,
          ],
        })
        .then((response) => {
          session.bracket = response.data.valueRanges[0].values[0][0];
          session.sheets.players = [
            {
              nick: response.data.valueRanges[1].values[0][0],
              id: parseInt(response.data.valueRanges[1].values[1][0]),
            },
            {
              nick: response.data.valueRanges[1].values[0][1],
              id: parseInt(response.data.valueRanges[1].values[1][1]),
            },
            {
              nick: response.data.valueRanges[1].values[0][2],
              id: parseInt(response.data.valueRanges[1].values[1][2]),
            },
            {
              nick: response.data.valueRanges[1].values[0][3],
              id: parseInt(response.data.valueRanges[1].values[1][3]),
            },
          ];

          console.log(
            "\n==================== Stream Title ===================="
          );
          console.log(
            `QS: [${
              session.bracket
            } match ${matchCode}] ${response.data.valueRanges[1].values[0].join(
              " vs. "
            )}`
          );
          console.log(
            "======================================================\n"
          );
        });
    } catch (e) {
      console.log(`\nCouldn't find match "${matchCode}" on the sheet.`);
    }
  }

  setInterval(() => {
    if (matchCode !== session.match_code) {
      matchCode = session.match_code;
      updateMatch();
    }
  }, 1000);

  //
  // Score Update

  const range_points = "!AD25:AG27"; // Rows: advantage, sum, rank

  async function updatePoints() {
    if (session.type !== "match" || !matchCode) {
      return;
    }

    try {
      sheets.spreadsheets.values
        .get({
          spreadsheetId: config.sheet,
          range: matchCode + range_points,
        })
        .then((response) => {
          session.sheets.points = {
            advantage: response.data.values[0].map((x) => parseInt(x)),
            sum: response.data.values[1].map((x) => parseInt(x)),
            rank: response.data.values[2].map((x) => parseInt(x)),
          };
        });
    } catch (e) {
      console.log(`\nCouldn't fetch scores on the sheet.`);
    }
  }

  setInterval(() => {
    if (session.type === "match") {
      updatePoints();
    }
  }, 5000);

  //
  // Mappool Update

  /*    TODO: UPDATE CODE TO CORRESPOND WITH THE QS REF SHEET       */
  /*
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
      let mappool = {};

      let gettingMappool = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === mappoolName) {
          console.log(`Found <Mappool ${rows[i][0]}> on sheet!`);
          gettingMappool = true;
        } else if (gettingMappool) {
          if (rows[i][0].startsWith("{")) {
            const data = JSON.parse(rows[i][0]);
            Object.assign(mappool, data);
          } else {
            break;
          }
        }
      }

      session.mappool = mappool;
    }

    setInterval(() => {
      if (mappoolName !== session.mappool_name) {
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

        if (!(pick.pick === -1 && pick.team === "")) {
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
    }, 5000);*/
};
