const path = require("path");
const chokidar = require("chokidar");
const csv = require("csvtojson");
const logger = require("winston");

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
  }

  handleControlEvent(data) {
    switch (data.type) {
      case "showPersonCard":
        logger.info("showPersonCard");
      case "addPerson":
        logger.info("addPerson");
      case "modifyPerson":
        logger.info("modifyPerson");
      case "deletePerson":
        logger.info("deletePerson");
    }
  }
};

loadPeople();
