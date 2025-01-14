const path = require("path");
const chokidar = require("chokidar");
const csv = require("csvtojson");
const logger = require("winston");

const controlEventHandlers = require("./controlEventHandlers");

const peopleCsvPath = path.join(process.cwd(), "people.csv");

exports = module.exports = class controls {
  constructor(config, session) {
    this.config = config;
    this.session = session;
    this.handlers = new controlEventHandlers(config, session);
  }

  CSL_watchPeopleList() {
    chokidar.watch(peopleCsvPath).on("all", () => {
      csv()
        .fromFile(peopleCsvPath)
        .then((jsonObj) => {
          this.session.CSL.people = jsonObj;
        });
    });
  }

  handleControlEvent(data, io) {
    logger.verbose(data);
    switch (data.type) {
      case "titleUpdate":
        this.handlers.updateTitle(data.data); // data: <String> new Stream Title
        break;
      case "scheduleUpdate":
        this.handlers.updateSchedule(data.data); // data: <String> new schedule in ISO
        break;
      case "showPersonCards":
        this.handlers.showPersonCards(data.data, io); // "data":{"duration":5,"people":[{"nick":"Fuvell","pfp":"https://a.ppy.sh/10220343","uid":"10220343","desc":"Host"}]}
        break;
    }
  }
};
