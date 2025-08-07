const path = require("path");
const chokidar = require("chokidar");
const { google } = require("googleapis");
const { v2 } = require("osu-api-extended");
const logger = require("winston");

const { SlottedSheetsFetcher } = require("./sheetsApi");
const { getRandomInt, sheetStrToBool } = require("../../../utils");
const { parseMatch, parseQualsResults, parseOiiResults, parseDrawResults } = require("./omln4");

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
    this.rawMatchInfo = [];
    this.allTeams = [];
    this.matchSchedule = ""; // CSL - Keep sheet's schedule separated with actual schedule in session
    this.fetcher = new SlottedSheetsFetcher(sheets, config.sheet);
  }

  /**
   * Configure and start the SpreadsheetManager.
   */
  async init() {
    this.setup();

    const updateMatchInfoLoop = () => {
      this.updateMatchInfo().then(() => {
        setTimeout(updateMatchInfoLoop, interval + getRandomInt(100));
      });
    };

    const updateAllMatchesLoop = () => {
      this.updateAllMatches().then(() => {
        setTimeout(updateAllMatchesLoop, interval + getRandomInt(100));
      });
    };

    const updateOiiResultsLoop = () => {
      this.omln4_getOiiResults().then(() => {
        setTimeout(updateOiiResultsLoop, interval + getRandomInt(100));
      });
    };

    const updateDrawResultsLoop = () => {
      this.omln4_getDrawResults().then(() => {
        setTimeout(updateDrawResultsLoop, interval + getRandomInt(100));
      });
    };

    updateAllMatchesLoop();
    updateMatchInfoLoop();
    updateOiiResultsLoop();
    updateDrawResultsLoop();
  }

  async setup() {
    chokidar.watch(path.join(process.cwd(), "config_stream.yaml")).on("all", () => {
      // temporary fix: wait for a brief moment until this.session.type is updated by /update/index.js
      setTimeout(() => {
        if (this.session.type === "match") {
          // Fetch match info only when match mode
          this.matchChanged();
        }
      }, 300);
    });

    await this.getBracketList();
    await this.omln4_getQualsResults();
  }

  async getBracketList() {
    const range = "RoundSetup"; // Specifying only the sheet name as range to get the whole cells in the sheet
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values; // Got data from the sheet

    const labels = getColumnLabels(rows[0]);

    const brackets = [];

    for (let i = 1; i < rows.length; i++) {
      brackets.push({
        code: rows[i][labels.RoundCode],
        name: rows[i][labels.RoundName],
        bo: rows[i][labels.Bo],
        poolName: rows[i][labels.PoolName],
      });
    }

    this.session.brackets = brackets;
  }

  /**
   * TODO: Add teamSize constant
   */
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
        index: parseInt(rows[i][labels.Index]),
        seed: parseInt(rows[i][labels.Seed]),
        flag: rows[i][labels.Flag],
        players: [{ id: parseInt(rows[i][labels.UID1]), nick: rows[i][labels.Player1], rank: 0 }],
      };

      if (!teamData) continue;

      allTeamsData.push(teamData);
      if (teams.includes(parseInt(rows[i][labels.Index])))
        teamsData[teams.indexOf(parseInt(rows[i][labels.Index]))] = teamData;
    }

    for (let i = 0; i < teamsData.length; i++) {
      for (let j = 0; j < 1; j++) {
        // TeamSize = 1
        if (!teamsData[i].players[j].id) continue;
        logger.verbose(
          consolePrefix + `Querying rank, pp, and flag of player id ${teamsData[i].players[j].id}`
        );
        const playerdata = await v2.users.details({
          user: teamsData[i].players[j].id,
          mode: "mania", // o!mLN4
          key: "id",
        });
        teamsData[i].players[j].rank = playerdata.statistics.global_rank;
        teamsData[i].players[j].pp = playerdata.statistics.pp;
        teamsData[i].players[j].country_code = playerdata.country_code;
      }
    }

    this.allTeams = allTeamsData;
    this.session.teams = teamsData;
    this.session.extended.teams = allTeamsData;
    logger.info(consolePrefix + `Found teams ${teams} on sheet!`);
  }

  /**
   * The match code has changed - so we re-fetch information
   * We get the match's team information, mappool, and title here, and the rest is handled by updateMatchInfo().
   */
  async matchChanged() {
    await this.updateMatchInfo(); // Update match info first

    this.session.schedule = this.matchSchedule; // CSL temporal change: timer control - update schedule value with on on sheet only when the matchCode has changed

    logger.info(consolePrefix + `Found match <${this.session.match_code}> on sheet!`);
    const teamNums = [
      this.session.progress.pre_match.red_index,
      this.session.progress.pre_match.blue_index,
    ];
    logger.verbose(consolePrefix + "Going to query teams " + teamNums);

    await this.updateTeams(teamNums);
    await this.updateMappool(this.session.mappool_name);

    /*     const streamTitle = get2dValue.byRange(rows, "W2");
    const titleLen = eaw.length(streamTitle);
    const lines = [];

    // Print stream title
    lines.push("┌" + "─".repeat(titleLen - 2) + "┐");
    lines.push(streamTitle);
    lines.push("└" + "─".repeat(titleLen - 2) + "┘");

    logger.warn(
      consolePrefix +
        "Stream title generated. Copy & paste the following to your streamer dashboard:\n" +
        lines.join("\n")
    );
    this.session.stream_title = get2dValue.byRange(rows, "W2"); // CSL */
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
          map_id: parseInt(rows[i][labels.ID_Map]),
          mapset_id: parseInt(rows[i][labels.ID_Mapset]),
          code: rows[i][labels.Code],
          background: rows[i][labels.Background],
          cover: rows[i][labels.Cover],
          title: rows[i][labels.Title],
          artist: rows[i][labels.Artist],
          mapper: rows[i][labels.Mapper],
          difficulty: rows[i][labels.Difficulty],
          custom: sheetStrToBool(rows[i][labels.Custom]),
          original: sheetStrToBool(rows[i][labels.Original]),
          stats: {
            od: parseFloat(rows[i][labels.OD]),
            hp: parseFloat(rows[i][labels.HP]),
            sr: parseFloat(rows[i][labels.SR]),
            bpm: parseFloat(rows[i][labels.BPM]),
            length: parseFloat(rows[i][labels.Length]),
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

    const range = "Match Progression"; // in o!mLN4, all the match progression data is on a single sheet
    const res = await this.fetcher.fetchRange(range);

    const rows = res.values; // Got data from the sheet
    this.rawMatchInfo = rows;

    // Get Match Progress Data
    const progressData = parseMatch(rows, this.session.match_code);
    this.session.progress = progressData;

    this.session.bracket = progressData.round;
    this.session.mappool_name = progressData.round_code;
    this.session.bo = progressData.bo;
    this.session.schedule = progressData.schedule;
  }

  async updateAllMatches() {
    if (this.session.type !== "match") return; // Not accessing the sheet if not in match mode

    const range = "Schedule"; // Specifying only the sheet name (which is same with the match code) as range to get the whole cells in the sheet
    const res = await this.fetcher.fetchRange(range);

    const rows = res.values; // Got data from the sheet

    const labels = getColumnLabels(rows[0]);

    const matches = {};
    const rCodeToFullname = (() => {
      const brackets = this.session.brackets;
      const rtn = {};

      brackets.forEach((element) => {
        rtn[element.code] = element.name;
      });

      return rtn;
    })();

    for (let i = 1; i < rows.length; i++) {
      const matchCode = rows[i][labels.Match];
      matches[matchCode] = {
        code: matchCode,
        bracket: rCodeToFullname[rows[i][labels.Round]],
        schedule: rows[i][labels.Schedule_ISO],
        players: [rows[i][labels.R_Index], rows[i][labels.B_Index]].map((x) =>
          !x ? 0 : isNaN(Number(x)) ? -1 : Number(x)
        ),
        result: [rows[i][labels.R_Score], rows[i][labels.B_Score]].map(
          (x) => (!x ? 0 : isNaN(Number(x)) ? -1 : Number(x)) // handle non-existing Array element and FF
        ),
      };
    }

    Object.assign(this.session.extended.matches, matches);
  }

  async omln4_getQualsResults() {
    const range = "Qualifier Data";
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values;

    this.session.extended.quals = parseQualsResults(rows);
  }

  async omln4_getOiiResults() {
    const range = "OII Results";
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values;

    this.session.extended.oiiResults = parseOiiResults(rows);
  }

  async omln4_getDrawResults() {
    const range = "OII Winners";
    const res = await this.fetcher.fetchRange(range);
    const rows = res.values;

    this.session.extended.oiiWinners = parseDrawResults(rows);
  }
}

exports = module.exports = { SpreadsheetManager };
