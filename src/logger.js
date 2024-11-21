const winston = require("winston");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");

exports = module.exports = function () {
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logFileName = path.join(logDir, `overlay_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.log`);

  winston.configure({
    level: "silly",
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS A",
          }),
          winston.format.align(),
          winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        ),
      }),
      new winston.transports.File({
        filename: logFileName,
        format: winston.format.json(),
      }),
    ],
  });
};
