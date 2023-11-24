const path = require("path");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

exports = module.exports = function(config, session) {
  //
  // Match Info Update

  let matchCode = "";
  const range_data = "B19:F30";
  let streamTitle = "";

  async function updateData() {
    // We are not broadcasting match or there is no match code
    if (session.type !== "match" || !session.match_code) {
      // Print showcase stream title if changed
      if (streamTitle !== session.stream_title) {
        streamTitle = session.stream_title;
        console.log(
          "\n==================== Stream Title ====================",
        );
        console.log(
          `QS: ${session.stream_title}`,
        );
        console.log(
          "======================================================\n",
        );
      }
      // No need to fetch the match info
      return;
    }

    try {
      sheets.spreadsheets.values.get({
        spreadsheetId: config.sheet,
        range: session.match_code + "!" + range_data,
      }).then((response) => {
        let data = {};

        // Prepare data
        for (let i = 0; i < response.data.values.length; i++) {
          data[response.data.values[i][0]] = response.data.values[i].slice(1);
        }

        //console.log(data);

        // Create stream title if matchCode has changed
        if (matchCode !== session.match_code) {
          matchCode = session.match_code;

          console.log(
            "\n==================== Stream Title ====================",
          );
          console.log(
            `QS: [${data.round_string} match ${matchCode}] ${data.nick.join(" vs. ")}`,
          );
          console.log(
            "======================================================\n",
          );
        }

        // Get bracket
        session.bracket = data.round_string[0];

        // Get players
        if (!session.sheets.hasOwnProperty("players")) {
          session.sheets.players = [{ nick: "", uid: -1 }, { nick: "", uid: -1 }, { nick: "", uid: -1 }, {
            nick: "",
            uid: -1,
          }];
        }
        for (let i = 0; i < data.nick.length; i++) {
          while (session.sheets.players.length < i + 1) {
            session.sheets.players.push({});
          }
          session.sheets.players[i] = {
            nick: data.nick[i],
            id: parseInt(data.uid[i]),
          };
        }

        // Update points
        session.sheets.points = {
          advantage: data.advantage.map((x) => parseInt(x)),
          sum: data.total_point.map((x) => parseInt(x)),
          rank: data.standing.map((x) => parseInt(x)),
        };

        while (session.sheets.points.sum.length < 4) {
          session.sheets.points.sum.push(0);
        }
        while (session.sheets.points.rank.length < 4) {
          session.sheets.points.rank.push(0);
        }

        // Update map index
        session.sheets.order = [data.current_map[0], data.total_map[0]];
      });
    } catch (e) {
      console.log(`\nCouldn't find match "${session.match_code}" on the sheet.`);
    }
  }


  setInterval(updateData, 2000);


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
