const path = require("path");
const fs = require("fs");

exports = module.exports = function (config, io) {
    const session = require("../templates/session");

    // Load debug values
    fs.access(path.join(process.cwd(), "session"), () => {
        const manualSession = require(path.join(process.cwd(), "session"));
        for (key in session){
            session[key] = manualSession[key];
        }
    });

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
    require("./foobar2000")(config, session);

    // Session data broadcasting
    function broadcastUpdate() {
        io.emit("update", session);
    }

    setInterval(broadcastUpdate, 100);
}


/*
setTimeout(() => {
        osuapi.getPlayers([6665667, 4585186, 1076236, 6537257]);
    }, 1000
);
*/