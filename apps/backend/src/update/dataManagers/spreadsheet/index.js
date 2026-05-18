const path = require("path");
const chokidar = require("chokidar");
const { google } = require("googleapis");
const { v2 } = require("osu-api-extended");
const eaw = require("eastasianwidth");
const logger = require("winston");

const { SlottedSheetsFetcher } = require("./sheetsApi");
const { getRandomInt, get2dValue } = require("../../../utils");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

const interval = 1500;
const consolePrefix = "[Spreadsheets] ";

function getColumnLabels(firstRow) {
  const data = {};
  for (let i = 0; i < firstRow.length; i++) {
    if (firstRow[i].length > 0) data[firstRow[i]] = i;
  }
  return data;
}

class SpreadsheetManager {
  constructor(config, session) {
    this.config = config;
    this.session = session;
    this.matchInfo = [];
    this.allTeams = [];
    this.matchSchedule = ""; // CSL - Keep sheet's schedule separated with actual schedule in session
    this.fetcher = new SlottedSheetsFetcher(sheets, config.sheet);
  }

  async init() {
    this.setup();

    const updateMatchInfoLoop = () => {
      this.updateMatchInfo().then(() => {
        setTimeout(updateMatchInfoLoop, interval + getRandomInt(100));
      });
    };

    updateMatchInfoLoop();
  }

  setup() {
    chokidar.watch(this.config.paths.streamConfig).on("all", () => {
      if (this.session.type === "match") {
        // Fetch match info only when match mode
        this.matchChanged();
      }
    });
  }

  async updateTeams(teams) {
    if (this.session.type !== "match") return;

    const range = "Teams"; // Specifying only the sheet name as range to get the whole cells in the sheet
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values; // Got data from the sheet

    const labels = getColumnLabels(rows[0]);

    const allTeamsData = [];
    const teamsData = new Array(teams.length);

    for (let i = 1; i < rows.length; i++) {
      const teamData = {
        name: rows[i][labels.TeamName],
        acronym: rows[i][labels.Acronym],
        seed: parseInt(rows[i][labels.Seed]),
        players: [
          { id: parseInt(rows[i][labels.uid1]), nick: rows[i][labels.Player1], rank: 0 },
          { id: parseInt(rows[i][labels.uid2]), nick: rows[i][labels.Player2], rank: 0 },
        ],
        comment: rows[i][labels.comment],
      };

      if (!teamData) continue;

      allTeamsData.push(teamData);
      if (teams.includes(parseInt(rows[i][labels.Index])))
        teamsData[teams.indexOf(parseInt(rows[i][labels.Index]))] = teamData;
    }

    for (let i = 0; i < teamsData.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (!teamsData[i].players[j].id) continue;
        logger.verbose(
          consolePrefix + `Querying rank and pp of player id ${teamsData[i].players[j].id}`
        );
        const playerdata = await v2.users.details({
          user: teamsData[i].players[j].id,
          mode: "osu",
          key: "id",
        });
        teamsData[i].players[j].rank = playerdata.statistics.global_rank;
        teamsData[i].players[j].pp = playerdata.statistics.pp;
      }
    }

    this.allTeams = allTeamsData;
    this.session.teams = teamsData;
    this.session.CSL.teams = allTeamsData;
    logger.info(consolePrefix + `Found teams ${teams} on sheet!`);
  }

  async matchChanged() {
    await this.updateMatchInfo(); // Update match info first

    this.session.schedule = this.matchSchedule; // CSL temporal change: timer control - update schedule value with on on sheet only when the matchCode has changed

    const rows = this.matchInfo;

    logger.info(consolePrefix + `Found match <${this.session.match_code}> on sheet!`);
    const teamNums = [
      parseInt(get2dValue.byRange(rows, "P4")),
      parseInt(get2dValue.byRange(rows, "P14")),
    ];
    logger.verbose(consolePrefix + "Going to query teams " + teamNums);

    await this.updateTeams(teamNums);
    await this.updateMappool(this.session.mappool_name);

    const streamTitle = get2dValue.byRange(rows, "J3");
    const titleLen = eaw.length(streamTitle);
    const lines = [];

    lines.push("┌" + "─".repeat(titleLen - 2) + "┐");
    lines.push(streamTitle);
    lines.push("└" + "─".repeat(titleLen - 2) + "┘");

    logger.warn(
      consolePrefix +
        "Stream title generated. Copy & paste the following to your streamer dashboard:\n" +
        lines.join("\n")
    );
    this.session.stream_title = get2dValue.byRange(rows, "W2"); // CSL
  }

  async updateMappool(mappoolName) {
    if (this.session.mappool_manual) return; // Don't get mappool info from the sheet if it is provided manually

    const range = "Mappool"; // Specifying only the sheet name as range to get the whole cells in the sheet
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values; // Got data from the sheet

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
      this.session.mappool = mappool;
      logger.info(
        consolePrefix + `Found mappool <${mappoolName}> (size: ${mappool.length}) on sheet!`
      );
    }
  }

  async updateMatchInfo() {
    if (this.session.type !== "match") return; // Not accessing the sheet if not in match mode

    const range = this.session.match_code; // Specifying only the sheet name (which is same with the match code) as range to get the whole cells in the sheet
    const res = await this.fetcher.fetchRange(range);

    const rows = res.values; // Got data from the sheet

    this.matchInfo = rows;

    this.session.bracket = get2dValue.byRange(rows, "P30");
    this.session.mappool_name = get2dValue.byRange(rows, "P31");
    this.session.bo = parseInt(get2dValue.byRange(rows, "P32"));
    this.session.schedule = get2dValue.byRange(rows, "P33");

    // Get Match Progress Data
    const rawProgressData = get2dValue.byRange(rows, "U2:V");

    this.session.progress.phase = rawProgressData[0][1];
    this.session.progress.curmap = rawProgressData[1][1];

    const pickDataLimit = ((bo) => {
      if (bo === 9) {
        return 12;
      } else if (bo === 11) {
        return 14;
      } else if (bo === 13) {
        return 16;
      } else {
        return 0;
      }
    })(this.session.bo); // 각 bo에 대한 TB 제외한 픽/밴 수
    let phases = [];
    let phaseData = null; // 파싱 중인 phase data
    for (let i = 10; i < rawProgressData.length; i++) {
      // 10번 행부터 픽/밴 데이터
      if (!rawProgressData[i][1]) break; // 데이터 없으면 파싱 종료

      if (i >= 10 + pickDataLimit && rawProgressData[i][0] !== "TB") continue; // pickDataLimit 도달하면 스킵; 마지막 TB만 파싱

      if (rawProgressData[i][0].length > 0) {
        // phaseData 초기화 및 배열에 바로 참조 추가
        phaseData = {
          label: rawProgressData[i][0],
          order: [],
        };
        phases.push(phaseData);
      }

      if (phaseData) {
        phaseData.order.push(JSON.parse(rawProgressData[i][1]));
      }
    }
    // session에 적용
    this.session.progress.phases = phases;
  }
}

exports = module.exports = { SpreadsheetManager };
