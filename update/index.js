const path = require("path");
const fs = require("fs");

// Initialize session object structure
const session = require("../templates/session");

function loadStreamConfig() {
    console.log("streamConfig file updated!");
    delete require.cache[path.join(process.cwd(), "streamConfig.js")];
    const streamConfig = require(path.join(process.cwd(), "streamConfig.js"));
    session.type = streamConfig.type;
    session.match_code = streamConfig.match_code;
    session.mappool_name = streamConfig.mappool_name;
    session.schedule = streamConfig.schedule;
    session.stream_title = streamConfig.title;
}

exports = module.exports = function (config, io) {
    // Load debug values
    if (fs.existsSync(path.join(process.cwd(), "session.js"))) {
        const manualSession = require(path.join(process.cwd(), "session.js"));
        for (key in manualSession) {
            session[key] = manualSession[key];
        }
    }

    // Load streamConfig values
    loadStreamConfig();
    // Update value whenever the config file is changed
    fs.watch(path.join(process.cwd(), "streamConfig.js"), loadStreamConfig);

    // socket.io setup
    io.on("connection", function (socket) {
        socket.on("file1Event", function () {
            console.log("file1Event triggered");
        });
    });

    // Gosumemory websocket setup
    require("./gosumemory")(config, session);

    // StreamCompanion websocket setup
    require("./streamcompanion")(config, session);

    // Updating fb2k data
    require("./fb2k")(config, session);

    // Information from Google sheets
    require("./spreadsheets")(config, session);

    // Session data broadcasting
    function broadcastUpdate() {
        io.emit("update", session);
    }

    setInterval(broadcastUpdate, 100);
}