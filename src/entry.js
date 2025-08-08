const http = require("http");
const express = require("express");
const ip = require("ip");
const { Server } = require("socket.io");
const path = require("path");
const logger = require("winston");

const { Apis } = require("./api");
const { DataUpdater } = require("./update");

async function start(config) {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Static Folder
  const isPackaged = !!process.pkg;
  const baseDir = isPackaged ? path.dirname(process.execPath) : __dirname;
  const publicPath = path.join(baseDir, "public");
  app.use("/overlay", express.static(publicPath));
  // Only serve index.html for non-file routes (SPA fallback)
  app.get("/overlay/*splat", (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(publicPath, "index.html"));
  });

  // API
  const api = new Apis(config);
  app.use("/api", api.router);

  // Info fetching and sending to browser
  const update = new DataUpdater(config, io.of("/update"));
  update.init();
  app.use("/json", update.router);

  // Run Server
  server.listen(config.port, () => {
    logger.info(
      `osu!mania Long Note Tournament 4 overlay backend server running at http://${ip.address()}:${config.port}/`
    );
  });
}

exports = module.exports = { start };
