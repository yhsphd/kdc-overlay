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

  handleControlEvent(data) {
    logger.info(data);
    switch (data.type) {
      case "scheduleUpdate":
        this.handlers.updateSchedule(data.data); // data: <String> new schedule in ISO
        break;
      case "showPeopleCards":
        logger.info(JSON.stringify(data));
        break;
    }
  }
};