const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const osuapi = require(__dirname + "/osuapi.js");

app.use(express.static(__dirname + "/public"));

server.listen(port, () => {
    console.log(`KDC23 overlay server running at http://localhost:${port}/`);
});