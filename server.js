const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");


// Config File Check
if (!fs.existsSync("./config.js")) {
    fs.copyFile("./defaults/config.default.js", "./config.js", (err) => {
        if (err) throw err;
        console.log("Default config file created! Please re-run the program after you complete!");
        process.exit();
    });
}
const config = require("./config.js");
const port = config.port;


// Static Folder
app.use("/", express.static("./public"));

// API
const api = require("./api");
app.use("/api", api);

// Info fetching and sending to browser
require("./update")(io.of("/update"));


// Run Server
server.listen(port, () => {
    console.log(`KDC23 overlay server running at http://localhost:${port}/`);
});