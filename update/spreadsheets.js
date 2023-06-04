const path = require("path");
const fs = require("fs");
const {google} = require("googleapis");
const {v2} = require("osu-api-extended");
const session = require("../templates/session");

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});
const sheets = google.sheets({version: "v4", auth});

exports = module.exports = function (config, session) {

    //
    // Team Info Update

    // Rows: matchCode, bracket, bo, streamTitle, schedule, team1, team2
    const range_updateTeams = "export!A4:AV10";
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
        if (fs.existsSync(path.join(process.cwd(), "mappool.json"))) {
            fs.readFile(path.join(process.cwd(), "mappool.json"), "utf8", (err, data) => {
                if (err) throw err;
                
                session.mappool = JSON.parse(data.toString()).mappool;
            });
        } else {
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
    }

    setInterval(() => {
        if (mappoolName !== session.mappool_name) {
            mappoolName = session.mappool_name;
            updateMappool();
        }
    }, 1000);
}