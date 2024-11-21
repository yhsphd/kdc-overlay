const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const logger = require("winston");

// Initialize session object structure
const session = require("../templates/session");

function loadStreamConfig() {
  logger.info("streamConfig file updated!");
  delete require.cache[path.join(process.cwd(), "streamConfig.js")];
  const streamConfig = require(path.join(process.cwd(), "streamConfig.js"));
  session.type = streamConfig.type;
  session.match_code = streamConfig.match_code;
  session.mappool_name = streamConfig.mappool_name;
  session.bracket = streamConfig.mappool_name;
  session.schedule = streamConfig.schedule;
  session.stream_title = streamConfig.title;
}

function loadManualMappool() {
  // Get mappool data from mappool.json if exists
  if (fs.existsSync(path.join(process.cwd(), "mappool.json"))) {
    logger.warn("Manual mappool: got mappool data from the mappool.json");
    session.mappool_manual = true;
    session.mappool = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "mappool.json"), "utf-8")
    ).mappool;
  } else {
    session.mappool_manual = false;
  }
}

exports = module.exports = function (config, io) {
  // Load debug values
  if (fs.existsSync(path.join(process.cwd(), "session.js"))) {
    const manualSession = require(path.join(process.cwd(), "session.js"));
    for (key in manualSession) {
      session[key] = manualSession[key];
    }
  }

  // Load streamConfig values and try to get mappool data from mappool.json
  // Update data whenever the files are changed
  chokidar.watch(path.join(process.cwd(), "streamConfig.js")).on("all", loadStreamConfig);
  chokidar.watch(path.join(process.cwd(), "mappool.json")).on("all", loadManualMappool);

  // socket.io setup
  io.on("connection", function (socket) {
    socket.on("file1Event", function () {
      logger.info("file1Event triggered");
    });
  });

  // Gosumemory websocket setup
  require("./gosumemory")(config, session);

  // Updating fb2k data
  require("./fb2k")(config, session);

  // Information from Google sheets
  require("./spreadsheets")(config, session);

  // Session data broadcasting
  function broadcastUpdate() {
    io.emit("update", session);
  }

  setInterval(broadcastUpdate, 100);
};
