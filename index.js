const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const fs = require("fs");
const path = require("path");

async function Init() {
  const configFileExists = fs.existsSync(
    path.join(process.cwd(), "./config.js")
  );
  const streamConfigFileExists = fs.existsSync(
    path.join(process.cwd(), "./streamConfig.js")
  );
  const firstRun = !(configFileExists && streamConfigFileExists);

  if (firstRun) {
    if (!configFileExists) {
      await fs.copyFileSync(
        path.join(__dirname + "/templates/config.default.js"),
        path.join(process.cwd(), "./config.js")
      );
      console.log(
        "Default config file created! Please re-run the program after you complete!"
      );
    }
    if (!streamConfigFileExists) {
      await fs.copyFileSync(
        path.join(__dirname + "/templates/streamConfig.default.js"),
        path.join(process.cwd(), "./streamConfig.js")
      );
      console.log(
        "Default streamConfig file created! Please re-run the program after you complete!"
      );
    }
    process.exit();
  } else {
    const config = require(path.join(process.cwd(), "./config.js"));

    // osu!api (v2) init
    require("./osuApi")(config);

    // Static Folder
    //const publicBase = require("./public");
    //app.use("/", publicBase);

    // API
    const api = require("./api")(config);
    app.use("/api", api);

    // Info fetching and sending to browser
    require("./update")(config, io.of("/update"));

    // Run Server
    server.listen(config.port, () => {
      console.log(
        `KDC23 overlay server running at http://localhost:${config.port}/`
      );
    });
  }
}

Init();
