const logger = require("winston");

exports = module.exports = class controls {
  constructor(config, session) {
    this.config = config;
    this.session = session;
  }

  updateSchedule(schedule) {
    this.session.schedule = schedule;
    /* logger.info(this.session.schedule);
    setTimeout(() => {
      logger.info(this.session.schedule);
    }, 2000); */
  }
};
