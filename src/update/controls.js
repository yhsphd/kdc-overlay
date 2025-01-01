const path = require("path");
const chokidar = require("chokidar");
const csv = require("csvtojson");
const logger = require("winston");

const controlEventHandlers = require("./controlEventHandlers");

const peopleCsvPath = path.join(process.cwd(), "people.csv");

chokidar.watch(peopleCsvPath).on("all", loadPeople);
const people = { people: [] };

function loadPeople() {
  csv()
    .fromFile(peopleCsvPath)
    .then((jsonObj) => {
      people.people = [...jsonObj];
    });
}

exports = module.exports = class controls {
  constructor(config, session) {
    this.config = config;
    this.session = session;
    this.handlers = new controlEventHandlers(config, session);
  }

  handleControlEvent(data) {
    logger.info(data);
    switch (data.type) {
      case "scheduleUpdate":
        logger.info("scheduleUpdate");
        this.handlers.updateSchedule(data.data); // data: <String> new schedule in ISO
        break;
      case "showPersonCard":
        logger.info("showPersonCard");
        break;
      case "addPerson":
        logger.info("addPerson");
        break;
      case "modifyPerson":
        logger.info("modifyPerson");
        break;
      case "deletePerson":
        logger.info("deletePerson");
        break;
    }
  }
};

loadPeople();
