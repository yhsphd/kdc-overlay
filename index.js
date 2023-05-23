const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const path = require("path");

if (!fs.existsSync("./config.js")) {
    fs.copyFile(path.join(__dirname + "/templates/config.default.js"), "./config.js", (err) => {
        if (err) throw err;
        console.log("Default config file created! Please re-run the program after you complete!");
        process.exit();
    });
} else {
    const config = require("./config");
    const port = config.port;

    // Static Folder
    const publicBase = require("./public");
    app.use("/", publicBase);

    // API
    const api = require("./api")(config);
    app.use("/api", api);

    // Info fetching and sending to browser
    require("./update")(config, io.of("/update"));


    // Run Server
    server.listen(port, () => {
        console.log(`KDC23 overlay server running at http://localhost:${port}/`);
    });
}